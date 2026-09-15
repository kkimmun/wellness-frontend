// Keep pending dialogs mounted while only the newest eligible dialog is visible.
export function createModalStack() {
  const entries = new Map();
  const listeners = new Set();
  let active = null;
  const publish = () => {
    let next = null;
    let priority = -Infinity;
    for (const [id, value] of entries) {
      if (value >= priority) { next = id; priority = value; }
    }
    if (next === active) return;
    active = next;
    listeners.forEach((listener) => listener());
  };
  return {
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    getSnapshot: () => active,
    register(id, priority = 0) {
      entries.set(id, priority);
      publish();
      return () => { entries.delete(id); publish(); };
    },
  };
}

export const modalStack = createModalStack();
