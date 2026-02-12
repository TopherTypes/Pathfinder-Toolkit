import * as storage from './storage.js';
import { startRouter } from './router.js';
import { initializeUI, renderRoute } from './ui.js';

/**
 * Application bootstrap file.
 *
 * This app intentionally avoids build tools and runs directly in browser via ES modules.
 */
(function bootstrap() {
  /** @type {object} */
  let state = storage.initDefaultStateIfMissing();

  // Expose selective APIs for cross-module UI handlers (import/export from settings view).
  window.TableReady = {
    storage,
    getState: () => state,
    setState: (nextState) => {
      state = nextState;
      storage.saveAppState(state);
      applyGlobalState();
    },
  };

  const appNameEl = document.querySelector('#app-name');
  if (appNameEl) {
    appNameEl.textContent = state.settings?.appName || 'Table-Ready';
  }

  initializeUI({
    getState: () => state,
    setState: (nextState) => window.TableReady.setState(nextState),
  });

  applyGlobalState();
  startRouter((route) => renderRoute(route));
})();

/**
 * Applies body-level classes/settings derived from persisted state.
 */
function applyGlobalState() {
  const current = window.TableReady.getState();
  document.body.classList.toggle('hide-cut-lines', !current.settings?.showCutLines);
}
