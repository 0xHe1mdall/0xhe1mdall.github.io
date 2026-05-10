/**
 * Tiny pub/sub store. Replaces the scattered globals from the original
 * (currentSection, currentView). ~40 lines, zero deps.
 *
 * Usage:
 *   const store = createStore({ section: 'main', view: 'graph' });
 *   store.subscribe(state => render(state));
 *   store.set({ section: 'projects' });
 */

export type Listener<T> = (state: Readonly<T>, prev: Readonly<T>) => void;

export interface Store<T extends object> {
  get(): Readonly<T>;
  set(patch: Partial<T>): void;
  subscribe(fn: Listener<T>): () => void;
}

export function createStore<T extends object>(initial: T): Store<T> {
  let state = { ...initial };
  const listeners = new Set<Listener<T>>();

  return {
    get: () => state,
    set(patch) {
      const prev = state;
      const next = { ...state, ...patch };
      // Cheap shallow equality — skip notifying if nothing changed.
      let changed = false;
      for (const k of Object.keys(patch) as (keyof T)[]) {
        if (next[k] !== prev[k]) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = next;
      for (const fn of listeners) fn(state, prev);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
