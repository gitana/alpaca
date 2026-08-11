# Refactor ESM - Remaining Tasks

The core codebase has been migrated to ESM, and a Vite build system has been established. However, several follow-up tasks are recommended to fully complete the transition and ensure the ecosystem around AlpacaJS is consistent.

## 1. Update `package.json`
- Update the `"main"` field to point to the new CommonJS or UMD bundle (e.g., `dist/alpaca/alpaca.umd.js` or `dist/alpaca/alpaca.cjs.js`).
- Add a `"module"` field pointing to the ESM bundle (`dist/alpaca/alpaca.es.js`).
- Add an `"exports"` field to correctly expose the entry points for modern node environments and bundlers.
- Update `"scripts"`: Replace or augment `build` to use `vite build`.

## 2. Test Suite Migration
- **Unit Tests (`tests/`)**: Review unit tests. If they rely on global `Alpaca` variables or old path structures, update them to import the built artifacts or source modules.
- **Cucumber Tests (`features/`)**: Verify that cucumber tests run correctly against the new build.
- **Test Runner**: Consider moving from `grunt`/`gulp` based test runners to a modern runner like Vitest or Jest, which handles ESM natively.

## 3. Site and Documentation (`site/`)
- The `site` folder and `gulp site` task likely depend on the old build artifacts (`dist/alpaca/bootstrap/...`).
- Update the site generation process to consume the new `dist/alpaca/` bundles.
- Update documentation examples to show how to use Alpaca with ESM (`import Alpaca from 'alpaca'`) and Script Tags (using the UMD build).

## 4. Dependencies and Cleanup
- **Gulp/Grunt**: Determine if `gulp` and `grunt` are still needed. If their only purpose was building the library, they can be removed in favor of Vite. If they build the site/docs, plan a migration for those tasks as well.
- **Thirdparty**: Review `thirdparty/` directory. `Base.js` is currently imported. Consider if it should be refactored into the main source tree or kept as is.

## 5. Continuous Integration (CI)
- Update any `.travis.yml` or GitHub Actions workflows to use the new build commands (`npm run build` / `npx vite build`) and check generated artifacts.

## 6. Verification
- Perform a "Smoke Test" by creating a small separate project that installs this package (via `npm link` or local path) and attempts to use it in both a Webpack/Vite project (ESM) and a legacy script-tag project (UMD).
