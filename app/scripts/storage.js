import {
  schemaVersion,
  createCampaign,
  createSession,
  createCreature,
  createItem,
  createPrintQueueEntry,
} from './models.js';

/**
 * Single storage key for v1 application state.
 * Keeping this centralized makes schema migration easier later.
 */
export const STORAGE_KEY = 'pf_toolkit_state_v1';

/**
 * Creates the application state object seeded with one campaign and sample records.
 * This first-run data supports immediate print queue testing.
 * @returns {object}
 */
function buildDefaultState() {
  const campaign = createCampaign({ name: 'Sample Campaign: Crown & Catacombs' });

  const creature = createCreature({
    name: 'Goblin Raider',
    sourceType: 'paste',
    sourceText:
      'Goblin Raider CR 1/3\nXP 135\nAC 16, touch 13, flat-footed 14\nHP 6 (1d8+2)\nSpeed 30 ft.\nMelee short sword +2 (1d4/19-20)',
    extracted: { ac: '16', hp: '6', speed: '30 ft.' },
    tags: ['goblin', 'low-level'],
  });

  const item = createItem({
    name: 'Potion of Cure Light Wounds',
    type: 'Potion',
    description: 'A stoppered vial of red liquid with a faint metallic taste.',
    mechanics: 'Drink to restore 1d8+1 hit points (CL 1st).',
    tags: ['consumable', 'healing'],
  });

  const session = createSession({
    campaignId: campaign.id,
    title: 'Session 1: Road to Blackhill',
    date: new Date().toISOString().slice(0, 10),
    notes:
      'Opening recap: the caravan leaves at dawn.\nScenes: ambush at the ford, ruined tollhouse, goblin cave entrance.\nNPCs: Harlan the driver.',
  });

  campaign.creatures.push(creature.id);
  campaign.items.push(item.id);
  campaign.sessions.push(session.id);

  return {
    schemaVersion,
    settings: {
      appName: 'Table-Ready',
      showCutLines: true,
    },
    activeCampaignId: campaign.id,
    campaigns: [campaign],
    sessions: [session],
    creatures: [creature],
    items: [item],
    printQueue: [
      createPrintQueueEntry({ type: 'creature_card', refId: creature.id, options: {} }),
      createPrintQueueEntry({ type: 'item_card', refId: item.id, options: {} }),
      createPrintQueueEntry({ type: 'session_notes', refId: session.id, options: {} }),
    ],
  };
}

/**
 * Loads state from localStorage.
 * @returns {object|null}
 */
export function loadAppState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error('Failed to parse stored state. Returning null.', error);
    return null;
  }
}

/**
 * Saves state to localStorage.
 * @param {object} state
 */
export function saveAppState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Ensures state exists in localStorage.
 * @returns {object}
 */
export function initDefaultStateIfMissing() {
  const existing = loadAppState();
  if (existing) return existing;

  const seeded = buildDefaultState();
  saveAppState(seeded);
  return seeded;
}

/**
 * Downloads current state as a JSON file.
 * @param {object} state
 */
export function exportStateToJsonDownload(state) {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `table-ready-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
}

/**
 * Imports state from a user-selected JSON file and persists it.
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function importStateFromJsonFile(file) {
  const text = await file.text();
  const imported = JSON.parse(text);

  // Minimal safety checks for v1 import behavior.
  if (!imported || typeof imported !== 'object') {
    throw new Error('Invalid JSON payload.');
  }
  if (!('schemaVersion' in imported)) {
    throw new Error('Imported file missing schemaVersion.');
  }

  saveAppState(imported);
  return imported;
}
