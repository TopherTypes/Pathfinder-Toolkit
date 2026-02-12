/**
 * Minimal hash-based router for static hosting.
 * Routes map to view names consumed by ui.js.
 */

const VALID_ROUTES = new Set([
  'dashboard',
  'campaign',
  'sessions',
  'creatures',
  'items',
  'print-queue',
  'settings',
]);

/**
 * Reads the active route from window.location.hash.
 * @returns {string}
 */
export function getCurrentRoute() {
  const route = window.location.hash.replace(/^#\/?/, '').trim();
  return VALID_ROUTES.has(route) ? route : 'dashboard';
}

/**
 * Subscribes to route changes.
 * @param {(route: string) => void} onRoute
 */
export function startRouter(onRoute) {
  const run = () => onRoute(getCurrentRoute());
  window.addEventListener('hashchange', run);
  run();
}
