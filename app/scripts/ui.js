import {
  createCreature,
  createItem,
  createSession,
  createPrintQueueEntry,
} from './models.js';
import { renderCreatureCard, renderItemCard, renderSessionNotesPage } from './print.js';

const PREP_CHECKLIST = [
  'Confirm session objective and expected session length',
  'Review prior session recap and unresolved hooks',
  'Prepare opening scene with read-aloud prompt',
  'Select 2-3 likely encounters and statblock cards',
  'Prepare key NPCs with names, goals, and voice notes',
  'Draft likely treasure and item rewards',
  'Print condition references and quick rules reminders',
  'Create fallback travel/social scene',
  'Prepare battle map notes and minis checklist',
  'Review player-specific spotlight opportunities',
];

/** @type {{getState: () => object, setState: (nextState: object) => void}} */
let appContext;

/**
 * Initializes UI layer with state management callbacks.
 * @param {{getState: () => object, setState: (nextState: object) => void}} context
 */
export function initializeUI(context) {
  appContext = context;
  bindGlobalEvents();
}

/**
 * Renders the current route view into the main content panel.
 * @param {string} route
 */
export function renderRoute(route) {
  highlightNav(route);
  const main = document.querySelector('#main-view');
  if (!main) return;

  switch (route) {
    case 'campaign':
      main.innerHTML = renderCampaignView();
      break;
    case 'sessions':
      main.innerHTML = renderSessionsView();
      bindSessionForm();
      break;
    case 'creatures':
      main.innerHTML = renderCreaturesView();
      bindCreatureForm();
      break;
    case 'items':
      main.innerHTML = renderItemsView();
      bindItemForm();
      break;
    case 'print-queue':
      main.innerHTML = renderPrintQueueView();
      bindPrintQueueActions();
      break;
    case 'settings':
      main.innerHTML = renderSettingsView();
      bindSettingsActions();
      break;
    case 'dashboard':
    default:
      main.innerHTML = renderDashboardView();
      bindWizardActions();
      break;
  }
}

function highlightNav(route) {
  document.querySelectorAll('[data-route-link]').forEach((link) => {
    const active = link.getAttribute('href') === `#/${route}`;
    link.classList.toggle('active', active);
  });
}

function renderDashboardView() {
  return `
    <section>
      <h2>Dashboard</h2>
      <p class="text-muted">Print-first Pathfinder 1e prep for in-person play.</p>
      <div class="card mb-4">
        <div class="card-body">
          <h3 class="h5">Guided Prep Checklist</h3>
          <ul class="checklist">
            ${PREP_CHECKLIST.map((item) => `<li><input type="checkbox" /> <span>${item}</span></li>`).join('')}
          </ul>
          <button class="btn btn-primary" id="start-session-wizard-btn">Start Session Wizard</button>
        </div>
      </div>
    </section>
  `;
}

function renderCampaignView() {
  const state = appContext.getState();
  const campaign = state.campaigns.find((c) => c.id === state.activeCampaignId);
  return `
    <section>
      <h2>Campaign</h2>
      <div class="card">
        <div class="card-body">
          <p><strong>Name:</strong> ${campaign?.name || '—'}</p>
          <p><strong>System:</strong> ${campaign?.system || 'PF1e'}</p>
          <p><strong>Created:</strong> ${campaign?.createdAt || '—'}</p>
          <p class="text-muted mb-0">Campaign management flow will be expanded in future wizard iterations.</p>
        </div>
      </div>
    </section>
  `;
}

function renderSessionsView() {
  const state = appContext.getState();
  return `
    <section>
      <h2>Sessions</h2>
      <form id="session-form" class="card card-body mb-4">
        <h3 class="h5">Add Session</h3>
        <label class="form-label">Title<input required name="title" class="form-control" /></label>
        <label class="form-label">Date<input type="date" required name="date" class="form-control" /></label>
        <label class="form-label">Notes<textarea name="notes" class="form-control" rows="4"></textarea></label>
        <button class="btn btn-success" type="submit">Save Session</button>
      </form>
      <div class="list-group">
        ${state.sessions
          .map(
            (session) =>
              `<div class="list-group-item"><strong>${session.title}</strong> <span class="text-muted">(${session.date})</span></div>`
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderCreaturesView() {
  const state = appContext.getState();
  return `
    <section>
      <h2>Creatures</h2>
      <form id="creature-form" class="card card-body mb-4">
        <h3 class="h5">Add Creature</h3>
        <label class="form-label">Name<input required name="name" class="form-control" /></label>
        <label class="form-label">Source Type
          <select name="sourceType" id="source-type" class="form-select">
            <option value="paste">Paste</option>
            <option value="manual">Manual</option>
            <option value="aon_url">AoN URL (placeholder)</option>
          </select>
        </label>
        <div id="source-paste-wrap">
          <label class="form-label">Pasted Statblock<textarea name="sourceText" class="form-control" rows="5"></textarea></label>
        </div>
        <div id="source-url-wrap" class="d-none">
          <label class="form-label">AoN URL<input type="url" name="aonUrl" class="form-control" placeholder="https://aonprd.com/..." /></label>
        </div>
        <button class="btn btn-success" type="submit">Save Creature</button>
      </form>
      <div class="list-group">
        ${state.creatures.map((creature) => `<div class="list-group-item">${creature.name} <small class="text-muted">(${creature.sourceType})</small></div>`).join('')}
      </div>
    </section>
  `;
}

function renderItemsView() {
  const state = appContext.getState();
  return `
    <section>
      <h2>Items</h2>
      <form id="item-form" class="card card-body mb-4">
        <h3 class="h5">Add Item</h3>
        <label class="form-label">Name<input required name="name" class="form-control" /></label>
        <label class="form-label">Type<input name="type" class="form-control" /></label>
        <label class="form-label">Description<textarea name="description" class="form-control" rows="3"></textarea></label>
        <label class="form-label">Mechanics<textarea name="mechanics" class="form-control" rows="3"></textarea></label>
        <button class="btn btn-success" type="submit">Save Item</button>
      </form>
      <div class="list-group">
        ${state.items.map((item) => `<div class="list-group-item">${item.name} <small class="text-muted">${item.type}</small></div>`).join('')}
      </div>
    </section>
  `;
}

function renderPrintQueueView() {
  const state = appContext.getState();
  const queueRows = state.printQueue
    .map((entry) => {
      const label = getQueueLabel(entry, state);
      return `<li class="list-group-item d-flex justify-content-between align-items-center"><span>${label}</span><span class="badge bg-secondary">${entry.type}</span></li>`;
    })
    .join('');

  const printableHtml = buildPrintableHtml(state);

  return `
    <section>
      <h2>Print Queue</h2>
      <div class="d-flex gap-2 mb-3">
        <button class="btn btn-primary" id="print-btn">Print</button>
        <button class="btn btn-outline-secondary" id="toggle-cut-lines-btn">Toggle Cut Lines</button>
      </div>
      <ul class="list-group mb-4">${queueRows}</ul>
      <h3 class="h5">Print Preview (On-screen approximation)</h3>
      <div class="print-surface">${printableHtml}</div>
    </section>
  `;
}

function renderSettingsView() {
  const state = appContext.getState();
  return `
    <section>
      <h2>Settings</h2>
      <div class="card card-body">
        <p><strong>Storage:</strong> localStorage (local-first)</p>
        <p><strong>Schema Version:</strong> ${state.schemaVersion}</p>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" id="export-state-btn">Export JSON</button>
          <label class="btn btn-outline-secondary mb-0">
            Import JSON
            <input id="import-state-input" type="file" accept="application/json" hidden />
          </label>
        </div>
      </div>
    </section>
  `;
}

function bindGlobalEvents() {
  // Wizard modal is global and can be triggered from Dashboard view.
  const nextBtn = document.querySelector('#wizard-next-btn');
  const backBtn = document.querySelector('#wizard-back-btn');

  let wizardStep = 0;
  const wizardSteps = [
    'Step 1: Confirm session goal and table constraints.',
    'Step 2: Pick encounters and required creature cards.',
    'Step 3: Queue session notes and final print packet.',
  ];

  const updateWizardText = () => {
    const body = document.querySelector('#wizard-step-text');
    if (!body) return;
    body.textContent = wizardSteps[wizardStep];
    if (backBtn) backBtn.disabled = wizardStep === 0;
    if (nextBtn) nextBtn.textContent = wizardStep === wizardSteps.length - 1 ? 'Finish' : 'Next';
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (wizardStep < wizardSteps.length - 1) {
        wizardStep += 1;
      } else {
        wizardStep = 0;
      }
      updateWizardText();
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      wizardStep = Math.max(0, wizardStep - 1);
      updateWizardText();
    });
  }

  updateWizardText();
}

function bindWizardActions() {
  const trigger = document.querySelector('#start-session-wizard-btn');
  const modal = document.querySelector('#session-wizard-modal');
  if (!trigger || !modal) return;

  trigger.addEventListener('click', () => {
    const instance = bootstrap.Modal.getOrCreateInstance(modal);
    instance.show();
  });
}

function bindSessionForm() {
  const form = document.querySelector('#session-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const state = appContext.getState();
    const session = createSession({
      campaignId: state.activeCampaignId,
      title: String(formData.get('title') || '').trim(),
      date: String(formData.get('date') || ''),
      notes: String(formData.get('notes') || '').trim(),
    });

    state.sessions.push(session);
    const campaign = state.campaigns.find((c) => c.id === state.activeCampaignId);
    if (campaign) campaign.sessions.push(session.id);
    state.printQueue.push(createPrintQueueEntry({ type: 'session_notes', refId: session.id }));

    appContext.setState(state);
    renderRoute('sessions');
  });
}

function bindCreatureForm() {
  const form = document.querySelector('#creature-form');
  if (!form) return;

  const sourceType = form.querySelector('#source-type');
  const pasteWrap = form.querySelector('#source-paste-wrap');
  const urlWrap = form.querySelector('#source-url-wrap');

  const syncSourceVisibility = () => {
    const isUrl = sourceType.value === 'aon_url';
    pasteWrap.classList.toggle('d-none', isUrl);
    urlWrap.classList.toggle('d-none', !isUrl);
  };

  sourceType.addEventListener('change', syncSourceVisibility);
  syncSourceVisibility();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const sourceText = String(formData.get('sourceText') || '').trim();

    const creature = createCreature({
      name: String(formData.get('name') || '').trim(),
      sourceType: formData.get('sourceType'),
      sourceText,
      aonUrl: String(formData.get('aonUrl') || '').trim(),
      extracted: {
        ac: '—',
        hp: '—',
        speed: '—',
      },
    });

    const state = appContext.getState();
    state.creatures.push(creature);
    const campaign = state.campaigns.find((c) => c.id === state.activeCampaignId);
    if (campaign) campaign.creatures.push(creature.id);
    state.printQueue.push(createPrintQueueEntry({ type: 'creature_card', refId: creature.id }));

    appContext.setState(state);
    renderRoute('creatures');
  });
}

function bindItemForm() {
  const form = document.querySelector('#item-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const item = createItem({
      name: String(formData.get('name') || '').trim(),
      type: String(formData.get('type') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      mechanics: String(formData.get('mechanics') || '').trim(),
    });

    const state = appContext.getState();
    state.items.push(item);
    const campaign = state.campaigns.find((c) => c.id === state.activeCampaignId);
    if (campaign) campaign.items.push(item.id);
    state.printQueue.push(createPrintQueueEntry({ type: 'item_card', refId: item.id }));

    appContext.setState(state);
    renderRoute('items');
  });
}

function bindPrintQueueActions() {
  const printBtn = document.querySelector('#print-btn');
  const toggleBtn = document.querySelector('#toggle-cut-lines-btn');

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const state = appContext.getState();
      state.settings.showCutLines = !state.settings.showCutLines;
      document.body.classList.toggle('hide-cut-lines', !state.settings.showCutLines);
      appContext.setState(state);
      renderRoute('print-queue');
    });
  }
}

function bindSettingsActions() {
  const exportBtn = document.querySelector('#export-state-btn');
  const importInput = document.querySelector('#import-state-input');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const state = appContext.getState();
      window.TableReady.storage.exportStateToJsonDownload(state);
    });
  }

  if (importInput) {
    importInput.addEventListener('change', async () => {
      const file = importInput.files?.[0];
      if (!file) return;
      try {
        const imported = await window.TableReady.storage.importStateFromJsonFile(file);
        appContext.setState(imported);
        renderRoute('settings');
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    });
  }
}

function getQueueLabel(entry, state) {
  if (entry.type === 'creature_card') {
    return `Creature: ${state.creatures.find((c) => c.id === entry.refId)?.name || '(missing)'}`;
  }
  if (entry.type === 'item_card') {
    return `Item: ${state.items.find((i) => i.id === entry.refId)?.name || '(missing)'}`;
  }
  return `Session: ${state.sessions.find((s) => s.id === entry.refId)?.title || '(missing)'}`;
}

function buildPrintableHtml(state) {
  return state.printQueue
    .map((entry) => {
      if (entry.type === 'creature_card') {
        const creature = state.creatures.find((c) => c.id === entry.refId);
        return creature ? renderCreatureCard(creature) : '';
      }
      if (entry.type === 'item_card') {
        const item = state.items.find((i) => i.id === entry.refId);
        return item ? renderItemCard(item) : '';
      }
      const session = state.sessions.find((s) => s.id === entry.refId);
      return session ? renderSessionNotesPage(session) : '';
    })
    .join('');
}
