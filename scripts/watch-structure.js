import { generateStructure, ignoredPatterns } from './structure-generator.js';
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

// Event icons
const EVENT_ICONS = {
  add: '📝',
  unlink: '🗑️',
  addDir: '📁',
  unlinkDir: '🗑️',
  move: '📦'
};

// Format path for display
function formatPath(filePath) {
  return filePath === '.' ? 'root' : filePath;
}

// Print formatted message
function printFormattedMessage(icon, action, details) {
  console.log('\n+++++++');
  console.log(`${icon} ${action}`);
  console.log('---');
  console.log(details);
}

// Debug configuration
const DEBUG_MODE = process.argv.includes('--debug');

// File tracking system
class FileTracker {
  constructor() {
    this.fileIndex = new Map();
    this.dirIndex = new Map();
    this.recentlyMoved = new Map();
    this.recentlyMovedDirs = new Map();
    this.MOVE_TIMEOUT = 300;
    this.DEBUG = DEBUG_MODE;
  }

  debugLog(...args) {
    if (this.DEBUG) {
      console.log('🔍 FileTracker:', ...args);
    }
  }

  // Index a file
  indexFile(filePath) {
    try {
      const stats = fs.statSync(filePath);
      const key = path.basename(filePath);
      
      this.fileIndex.set(key, {
        path: filePath,
        directory: path.dirname(filePath),
        metadata: {
          size: stats.size,
          mtime: stats.mtime.getTime(),
          mode: stats.mode,
          ino: stats.ino
        },
        lastSeen: Date.now()
      });
      
      this.debugLog(`Indexed: ${key}`);
      this.debugLog(`Total files indexed: ${this.fileIndex.size}`);
      return true;
    } catch (error) {
      this.debugLog(`Failed to index: ${path.basename(filePath)}`, error.message);
      return false;
    }
  }

  // Track file removal
  trackRemoval(filePath) {
    const fileName = path.basename(filePath);
    const fileInfo = this.fileIndex.get(fileName);
    
    this.debugLog(`Checking removal: ${fileName}`);
    this.debugLog(`File in index: ${fileInfo ? 'yes' : 'no'}`);
    
    if (fileInfo) {
      // Store for potential move detection first
      this.recentlyMoved.set(fileName, {
        ...fileInfo,
        timestamp: Date.now(),
        handled: false
      });
      
      this.fileIndex.delete(fileName);
      this.debugLog(`File marked for move/delete tracking: ${fileName}`);
      
      // Return the info for deletion handling
      return {
        fileName,
        dirPath: fileInfo.directory,
        needsConfirmation: true
      };
    }
    return null;
  }

  // Check for move
  checkMove(filePath) {
    const fileName = path.basename(filePath);
    const movedFile = this.recentlyMoved.get(fileName);
    
    this.debugLog(`Checking move: ${fileName}`);
    this.debugLog(`Recent move record: ${movedFile ? 'yes' : 'no'}`);
    
    if (!movedFile || movedFile.handled) return null;
    
    try {
      const newStats = fs.statSync(filePath);
      const oldMetadata = movedFile.metadata;
      
      if (newStats.ino === oldMetadata.ino && 
          newStats.size === oldMetadata.size &&
          (Date.now() - movedFile.timestamp) < this.MOVE_TIMEOUT) {
        
        movedFile.handled = true;
        const result = {
          fileName,
          fromDir: movedFile.directory,
          toDir: path.dirname(filePath)
        };
        
        this.debugLog(`Move confirmed: ${fileName}`);
        this.recentlyMoved.delete(fileName);
        this.indexFile(filePath);
        return result;
      }
    } catch (error) {
      this.debugLog(`Move check error:`, error.message);
    }
    
    return null;
  }

  // Add directory scanning
  async scanDirectory(dir = '.') {
    const currentFiles = new Set();
    
    async function scan(directory) {
      try {
        const entries = await fs.promises.readdir(directory, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(directory, entry.name);
          
          // Skip ignored patterns
          if (ignoredPatterns.some(pattern => pattern.test(fullPath))) {
            continue;
          }
          
          if (entry.isDirectory()) {
            await scan(fullPath);
          } else {
            currentFiles.add(fullPath);
          }
        }
      } catch (error) {
        this.debugLog(`Scan error in ${directory}:`, error.message);
      }
    }
    
    await scan(dir);
    return currentFiles;
  }

  // Verify deletions
  async verifyDeletions() {
    const currentFiles = await this.scanDirectory();
    const deletions = [];
    
    // Check each indexed file
    for (const [fileName, fileInfo] of this.fileIndex) {
      if (!currentFiles.has(fileInfo.path)) {
        deletions.push({
          fileName,
          dirPath: fileInfo.directory
        });
        this.fileIndex.delete(fileName);
      }
    }
    
    return deletions;
  }

  // Add directory tracking
  indexDirectory(dirPath) {
    try {
      const stats = fs.statSync(dirPath);
      const key = path.basename(dirPath);
      
      this.dirIndex.set(key, {
        path: dirPath,
        parentDir: path.dirname(dirPath),
        metadata: {
          mtime: stats.mtime.getTime(),
          mode: stats.mode,
          ino: stats.ino
        },
        lastSeen: Date.now()
      });
      
      this.debugLog(`Indexed directory: ${key}`);
      return true;
    } catch (error) {
      this.debugLog(`Failed to index directory: ${path.basename(dirPath)}`);
      return false;
    }
  }

  trackDirectoryRemoval(dirPath) {
    const dirName = path.basename(dirPath);
    const dirInfo = this.dirIndex.get(dirName);
    
    if (dirInfo) {
      this.recentlyMovedDirs.set(dirName, {
        ...dirInfo,
        timestamp: Date.now(),
        handled: false
      });
      
      this.dirIndex.delete(dirName);
      return {
        dirName,
        parentDir: dirInfo.parentDir,
        needsConfirmation: true
      };
    }
    return null;
  }

  checkDirectoryMove(dirPath) {
    const dirName = path.basename(dirPath);
    const movedDir = this.recentlyMovedDirs.get(dirName);
    
    if (!movedDir || movedDir.handled) return null;
    
    try {
      const newStats = fs.statSync(dirPath);
      const oldMetadata = movedDir.metadata;
      
      if (newStats.ino === oldMetadata.ino && 
          (Date.now() - movedDir.timestamp) < this.MOVE_TIMEOUT) {
        
        movedDir.handled = true;
        const result = {
          dirName,
          fromDir: movedDir.parentDir,
          toDir: path.dirname(dirPath)
        };
        
        this.recentlyMovedDirs.delete(dirName);
        this.indexDirectory(dirPath);
        return result;
      }
    } catch (error) {
      this.debugLog(`Directory move check error:`, error.message);
    }
    
    return null;
  }
}

// Structure update handling
let updateTimeout = null;
let isUpdating = false;

async function debouncedStructureUpdate() {
  if (isUpdating) return;
  
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(async () => {
    try {
      isUpdating = true;
      await generateStructure(process.cwd());
      console.log('✅ Structure Updated Successfully!');
      console.log('========\n');
      isUpdating = false;
    } catch (err) {
      console.error('❌ Error updating structure:', err);
      console.log('========\n');
      isUpdating = false;
    }
  }, 300);
}

// Initialize tracker
const fileTracker = new FileTracker();

async function watchFiles() {
  console.log('\n+++++++');
  console.log('📡 Initializing File Watcher');
  console.log('---');
  console.log('🎯 Tracking all files except:');
  ignoredPatterns.forEach(pattern => {
    console.log(`   - ${pattern}`);
  });
  console.log('========\n');

  const watcher = chokidar.watch('.', {
    ignored: ignoredPatterns,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50
    }
  });

  let isInitialScan = true;

  // Index existing files
  watcher.on('add', async (filePath) => {
    if (isInitialScan) {
      fileTracker.indexFile(filePath);
      return;
    }
    
    const moveResult = fileTracker.checkMove(filePath);
    if (moveResult) {
      printFormattedMessage(
        EVENT_ICONS.move,
        `File Moved: ${moveResult.fileName}`,
        `📁 ${formatPath(moveResult.fromDir)} -> ${formatPath(moveResult.toDir)}`
      );
      debouncedStructureUpdate();
    } else {
      const indexed = fileTracker.indexFile(filePath);
      if (indexed) {
        printFormattedMessage(
          EVENT_ICONS.add,
          `File Created: ${path.basename(filePath)}`,
          `📁 Location: ${formatPath(path.dirname(filePath))}`
        );
        debouncedStructureUpdate();
      }
    }
  });

  // Add deletion verification after structure updates
  async function verifyAndUpdateDeletions() {
    const deletions = await fileTracker.verifyDeletions();
    for (const deletion of deletions) {
      printFormattedMessage(
        EVENT_ICONS.unlink,
        `File Deleted: ${deletion.fileName}`,
        `📁 From: ${formatPath(deletion.dirPath)}`
      );
    }
    if (deletions.length > 0) {
      debouncedStructureUpdate();
    }
  }

  watcher.on('unlink', async (filePath) => {
    if (!isInitialScan) {
      const deletionResult = fileTracker.trackRemoval(filePath);
      
      if (deletionResult && deletionResult.needsConfirmation) {
        // Wait to see if it's a move
        setTimeout(() => {
          const movedFile = fileTracker.recentlyMoved.get(deletionResult.fileName);
          if (movedFile && !movedFile.handled) {
            printFormattedMessage(
              EVENT_ICONS.unlink,
              `File Deleted: ${deletionResult.fileName}`,
              `📁 From: ${formatPath(deletionResult.dirPath)}`
            );
            fileTracker.recentlyMoved.delete(deletionResult.fileName);
            debouncedStructureUpdate();
          }
        }, fileTracker.MOVE_TIMEOUT + 50);
      }
    }
  });

  watcher.on('ready', () => {
    isInitialScan = false;
    console.log('+++++++');
    console.log('✨ Initial Scan Complete');
    console.log('---');
    console.log('📊 Current Structure:');
    console.log(`   - ${fileTracker.fileIndex.size} files indexed`);
    console.log('---');
    console.log('👀 Watching for changes...');
    console.log('========\n');
  });

  // Verify deletions periodically
  setInterval(async () => {
    if (!isInitialScan) {
      await verifyAndUpdateDeletions();
    }
  }, 1000); // Check every second

  // Add directory event handlers
  watcher.on('addDir', (dirPath) => {
    if (isInitialScan) {
      fileTracker.indexDirectory(dirPath);
      return;
    }
    
    const moveResult = fileTracker.checkDirectoryMove(dirPath);
    if (moveResult) {
      printFormattedMessage(
        EVENT_ICONS.move,
        `Directory Moved: ${moveResult.dirName}`,
        `📁 ${formatPath(moveResult.fromDir)} -> ${formatPath(moveResult.toDir)}`
      );
      debouncedStructureUpdate();
    } else {
      const indexed = fileTracker.indexDirectory(dirPath);
      if (indexed) {
        printFormattedMessage(
          EVENT_ICONS.addDir,
          `Directory Created: ${path.basename(dirPath)}`,
          `📁 Location: ${formatPath(path.dirname(dirPath))}`
        );
        debouncedStructureUpdate();
      }
    }
  });

  watcher.on('unlinkDir', (dirPath) => {
    if (!isInitialScan) {
      const deletionResult = fileTracker.trackDirectoryRemoval(dirPath);
      
      if (deletionResult && deletionResult.needsConfirmation) {
        setTimeout(() => {
          const movedDir = fileTracker.recentlyMovedDirs.get(deletionResult.dirName);
          if (movedDir && !movedDir.handled) {
            printFormattedMessage(
              EVENT_ICONS.unlinkDir,
              `Directory Deleted: ${deletionResult.dirName}`,
              `📁 From: ${formatPath(deletionResult.parentDir)}`
            );
            fileTracker.recentlyMovedDirs.delete(deletionResult.dirName);
            debouncedStructureUpdate();
          }
        }, fileTracker.MOVE_TIMEOUT + 50);
      }
    }
  });
}

// Call watchFiles and handle any errors
watchFiles().catch(error => {
  console.error('Error in watch process:', error);
  process.exit(1);
}); 