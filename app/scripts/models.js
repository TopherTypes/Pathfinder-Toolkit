/**
 * Core data model factories and schema metadata for Table-Ready.
 *
 * NOTE:
 * - These are intentionally plain JavaScript object factories (no classes)
 *   to keep persistence straightforward and serialization-friendly.
 * - Any schema changes should bump schemaVersion and be handled via migration logic
 *   in storage.js in future iterations.
 */

// Current schema version for localStorage payloads.
export const schemaVersion = 1;

/**
 * Creates a lightweight unique identifier.
 * @returns {string}
 */
export function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

/**
 * Campaign model factory.
 * @param {Partial<object>} overrides
 * @returns {{id: string, name: string, system: string, createdAt: string, sessions: string[], creatures: string[], items: string[]}}
 */
export function createCampaign(overrides = {}) {
  return {
    id: createId(),
    name: 'My Pathfinder Campaign',
    system: 'PF1e',
    createdAt: new Date().toISOString(),
    sessions: [],
    creatures: [],
    items: [],
    ...overrides,
  };
}

/**
 * Session model factory.
 * @param {Partial<object>} overrides
 * @returns {{id: string, campaignId: string, title: string, date: string, notes: string, encounters: string[]}}
 */
export function createSession(overrides = {}) {
  return {
    id: createId(),
    campaignId: '',
    title: 'New Session',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    encounters: [],
    ...overrides,
  };
}

/**
 * Creature model factory.
 * @param {Partial<object>} overrides
 * @returns {{id: string, name: string, sourceType: 'paste'|'manual'|'aon_url', sourceText: string, aonUrl: string, extracted: object, tags: string[]}}
 */
export function createCreature(overrides = {}) {
  return {
    id: createId(),
    name: 'New Creature',
    sourceType: 'paste',
    sourceText: '',
    aonUrl: '',
    extracted: {
      ac: '—',
      hp: '—',
      speed: '—',
    },
    tags: [],
    ...overrides,
  };
}

/**
 * Item model factory.
 * @param {Partial<object>} overrides
 * @returns {{id: string, name: string, type: string, description: string, mechanics: string, tags: string[]}}
 */
export function createItem(overrides = {}) {
  return {
    id: createId(),
    name: 'New Item',
    type: 'Wondrous Item',
    description: '',
    mechanics: '',
    tags: [],
    ...overrides,
  };
}

/**
 * Print queue entry factory.
 * @param {Partial<object>} overrides
 * @returns {{id: string, type: 'creature_card'|'item_card'|'session_notes', refId: string, options: object}}
 */
export function createPrintQueueEntry(overrides = {}) {
  return {
    id: createId(),
    type: 'creature_card',
    refId: '',
    options: {},
    ...overrides,
  };
}
