/**
 * Minimal localStorage persistence for the slices of Redux state that must
 * survive a full page reload (auth session, resolved ZIP/jurisdiction).
 * RTK Query's own cache is intentionally excluded — it re-fetches on demand.
 */
const STORAGE_KEY = 'wastewiz.persisted-state';

interface PersistedState {
  auth?: unknown;
  location?: unknown;
}

export function loadPersistedState(): PersistedState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return undefined;
  }
}

export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota exceeded) — session
    // simply won't survive a refresh; nothing else to do about it here.
  }
}
