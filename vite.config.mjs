import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/js/index.js'),
      name: 'Alpaca',
      fileName: (format) => `alpaca.${format}.js`,
      formats: ['umd', 'es', 'cjs']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['jquery', 'handlebars'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          jquery: 'jQuery',
          handlebars: 'Handlebars'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css') return 'alpaca.css';
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist/alpaca'
  }
});
