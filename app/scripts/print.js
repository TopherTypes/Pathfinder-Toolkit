/**
 * Print template helpers for card/page rendering.
 */

/**
 * Escapes user-provided HTML-sensitive characters.
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Renders a creature print card.
 * @param {object} creature
 * @returns {string}
 */
export function renderCreatureCard(creature) {
  return `
    <article class="print-card">
      <header class="print-card-header">
        <h3>${escapeHtml(creature.name)}</h3>
      </header>
      <p class="key-stats">AC ${escapeHtml(creature.extracted?.ac || '—')} • HP ${escapeHtml(
    creature.extracted?.hp || '—'
  )} • Speed ${escapeHtml(creature.extracted?.speed || '—')}</p>
      <pre class="statblock">${escapeHtml(creature.sourceText || '(No statblock text yet)')}</pre>
    </article>
  `;
}

/**
 * Renders an item print card.
 * @param {object} item
 * @returns {string}
 */
export function renderItemCard(item) {
  return `
    <article class="print-card">
      <header class="print-card-header">
        <h3>${escapeHtml(item.name)}</h3>
      </header>
      <p><strong>Type:</strong> ${escapeHtml(item.type || '—')}</p>
      <p><strong>Description:</strong> ${escapeHtml(item.description || '—')}</p>
      <p><strong>Mechanics:</strong> ${escapeHtml(item.mechanics || '—')}</p>
    </article>
  `;
}

/**
 * Renders session notes as a printable page.
 * @param {object} session
 * @returns {string}
 */
export function renderSessionNotesPage(session) {
  return `
    <section class="session-print-page">
      <h2>${escapeHtml(session.title)}</h2>
      <p><strong>Date:</strong> ${escapeHtml(session.date || '—')}</p>
      <div class="session-sections">
        <div><h4>Opening Recap</h4><p></p></div>
        <div><h4>Scenes</h4><p></p></div>
        <div><h4>Encounters</h4><p></p></div>
        <div><h4>NPCs</h4><p></p></div>
        <div><h4>Loot</h4><p></p></div>
        <div><h4>Reminders</h4><p></p></div>
      </div>
      <h4>Existing Notes</h4>
      <pre class="statblock">${escapeHtml(session.notes || '(No notes yet)')}</pre>
    </section>
  `;
}
