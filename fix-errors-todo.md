# Fix Errors Todo

## Data Loading Errors
- [x] Fix `DATA_LOADING_ERROR` in tests trying to load `../examples/...`.
  - These tests fail because they try to load local files via XHR which isn't supported or the path is wrong.
  - Solution: Mock `$.ajax` in `vitest.setup.js` to read files from `site/demos/` when `../examples/` is requested.

## Assertion Errors
- [x] Fix `tests/js/hideInitValidationError.js`.
  - Error: `Initial validation should have discovered the form is invalid.: expected true to deeply equal false`.
  - Solution: Modified `src/js/Alpaca.js` to ensure validation state is refreshed even if initial validation errors are hidden.
- [x] Fix assertions in `EditForm.js`, `CreateForm.js` etc.
  - Status: `View normalization` fixed.
  - Solution: Added `.alpaca-controlfield` class in `src/js/ControlField.js` and updated test selectors. Corrected expectations for number of fields.

## Runtime Errors
- [x] Fix `ReferenceError: observable is not defined` in `tests/js/fields/AddressField.js`.
  - Location: `src/js/ObservableUtils.js:184:24`.
- [x] Fix `View normalization failed` in `tests/js/forms/EditForm.js`.
  - Solution: Added legacy view aliases in `vitest.setup.js`.
- [x] Fix `TypeError` in `CreateForm.js` due to missing fixture.
  - Solution: Added setup/teardown with fixture creation.

## Other Errors
- [x] Investigate and fix timeouts in `tests/js/fields/ArrayField.js`.
  - Solution:
    - Fixed selector issues (using `[type="text"]` instead of `:text` pseudo-selector for `happy-dom` compatibility).
    - Fixed race conditions by using `setTimeout` in click handlers (simulating async nature).
    - Fixed `simulateClick` reference error by attaching it to `window`.
    - Disabled animation in tests to avoid timing issues with `animatedSwap`.
    - Fixed DOM cleaning in `vitest.setup.js` to prevent test pollution.
