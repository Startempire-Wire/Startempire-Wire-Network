import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

const ignoredPatterns = [
  /(^|[\/\\])\.git/,
  /(^|[\/\\])\.DS_Store/,
  /node_modules/,
  /dist/,
  /\.cursorrules\..*\.backup$/,
  /\.svelte-kit/,
  /coverage/,
  /build/
];

async function generateStructure(rootPath) {
  try {
    let rules = {};
    
    try {
      // Read existing file
      await fs.access('.cursorrules');
      const existingRules = await fs.readFile('.cursorrules', 'utf8');
      rules = yaml.load(existingRules) || {};
    } catch (error) {
      console.log('Creating new .cursorrules file');
    }
    
    // Update only project_structure while preserving everything else
    const newStructure = await buildStructure(rootPath);
    
    // Initialize technical_requirements if it doesn't exist
    if (!rules.technical_requirements) {
      rules.technical_requirements = {};
    }
    
    // Only update the project_structure section
    rules.technical_requirements.project_structure = newStructure;
    
    // Write back with preserved content
    await fs.writeFile(
      '.cursorrules',
      yaml.dump(rules, { 
        noRefs: true,
        lineWidth: -1,
        indent: 2
      })
    );
    
  } catch (error) {
    console.error('Error generating structure:', error);
    throw error;
  }
}

async function buildStructure(rootPath) {
  const structure = {
    root_path: rootPath,
    metadata: {
      project_type: "chrome-extension",
      framework: {
        name: "svelte",
        build_tool: "vite"
      }
    },
    file_categories: {
      config: [],
      build: [],
      documentation: {
        path: 'docs',
        contents: {
          directories: {},
          files: []
        }
      }
    },
    directories: {},
    entry_points: {}
  };

  const configFiles = [
    '.env',
    '.prettierrc',
    'vite.config.js',
    'svelte.config.js',
    'tailwind.config.js',
    'postcss.config.cjs',
    'jsconfig.json'
  ];

  const buildFiles = [
    'package.json',
    'package-lock.json'
  ];

  const docFiles = [
    'README.md'
  ];

  async function traverse(currentPath, currentObj) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (ignoredPatterns.some(pattern => pattern.test(entry.name))) continue;
      
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);
      
      // Categorize root files
      if (path.dirname(relativePath) === '.') {
        if (configFiles.includes(entry.name)) {
          structure.file_categories.config.push({ path: entry.name });
          continue;
        }
        if (buildFiles.includes(entry.name)) {
          structure.file_categories.build.push({ path: entry.name });
          continue;
        }
        if (docFiles.includes(entry.name)) {
          if (!structure.file_categories.documentation.files) {
            structure.file_categories.documentation.files = [];
          }
          structure.file_categories.documentation.files.push({
            name: entry.name,
            path: entry.name,
            extension: path.extname(entry.name)
          });
          continue;
        }
      }
      
      if (entry.isDirectory()) {
        // Handle docs directory properly
        if (entry.name === 'docs') {
          structure.file_categories.documentation.contents = await scanDirectory(fullPath);
        } else {
          currentObj.directories[entry.name] = {
            path: relativePath,
            contents: {
              directories: {},
              files: []
            }
          };
          await traverse(fullPath, currentObj.directories[entry.name].contents);
        }
      } else {
        currentObj.files = currentObj.files || [];
        currentObj.files.push({
          name: entry.name,
          path: relativePath,
          extension: path.extname(entry.name)
        });
      }
    }
  }

  await traverse(rootPath, structure);
  
  // Add entry points
  structure.entry_points = {
    background: "src/background.js",
    content: "src/contentScript.js",
    popup: "src/pages/popup/popup.js",
    sidepanel: "src/pages/sidepanel/sidepanel.js"
  };

  return structure;
}

// Helper to scan directory contents
async function scanDirectory(dirPath) {
  try {
    const contents = {
      directories: {},
      files: []
    };
    
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (ignoredPatterns.some(pattern => pattern.test(entry.name))) continue;
      
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        contents.directories[entry.name] = {
          path: path.relative(process.cwd(), fullPath),
          contents: await scanDirectory(fullPath)
        };
      } else {
        contents.files.push({
          name: entry.name,
          path: path.relative(process.cwd(), fullPath),
          extension: path.extname(entry.name)
        });
      }
    }
    
    return contents;
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return { directories: {}, files: [] };
  }
}

export { generateStructure, ignoredPatterns }; 