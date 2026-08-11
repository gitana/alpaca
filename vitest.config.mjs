import { defineConfig } from 'vitest/config';

const qunitTransformPlugin = {
  name: 'qunit-transform',
  transform(code, id) {
    if (id.includes('tests/js/') && (id.endsWith('.js') || id.endsWith('.mjs'))) {
      // Replace module(...) with window.module(...) to avoid conflict with CommonJS module
      return {
        code: code.replace(/\bmodule\s*\(/g, 'window.module('),
        map: null
      };
    }
  }
};

export default defineConfig({
  plugins: [qunitTransformPlugin],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.js'],
    include: ['tests/js/**/*.{js,mjs}'],
  }
});
