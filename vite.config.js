import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path'

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: 'generate-html',
      closeBundle() {
        const pages = ['popup', 'options', 'sidepanel'];
        const template = (name) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Startempire Wire Network${name !== 'popup' ? ` - ${name}` : ''}</title>
  <link rel="stylesheet" href="./styles/app.css">
  <meta name="color-scheme" content="light dark">
</head>
<body class="bg-white dark:bg-gray-800">
  <div id="app"></div>
  <script type="module" src="./${name}.js"></script>
</body>
</html>`;

        pages.forEach(page => {
          try {
            const dir = resolve(__dirname, 'dist');
            mkdirSync(dir, { recursive: true });
            writeFileSync(
              resolve(dir, `${page}.html`),
              template(page)
            );
            console.log(`Generated ${page}.html`);
          } catch (error) {
            console.error(`Error generating ${page}.html:`, error);
          }
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.js'),
        contentScript: resolve(__dirname, 'src/contentScript.js'),
        popup: resolve(__dirname, 'src/pages/popup/popup.js'),
        sidepanel: resolve(__dirname, 'src/pages/sidepanel/sidepanel.js'),
        options: resolve(__dirname, 'src/pages/options/options.js')
      },
      external: [
        'node:fs',
        'node:path',
        'node:url',
        'svelte-hmr'
      ],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: ({ name }) => {
          if (name.endsWith('.css')) {
            return 'styles/app.css';
          }
          return 'assets/[name].[ext]';
        },
        dir: 'dist'
      }
    }
  },
  resolve: {
    alias: {
      '$lib': path.resolve(__dirname, './src/lib')
    }
  }
}); 