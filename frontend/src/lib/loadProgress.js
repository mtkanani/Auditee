import { lazy } from 'react';

// Counts page-code downloads that are in flight, for the top progress bar (components/shell/TopProgress).
let pending = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const loadProgress = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => pending,
};

const track = (promise) => {
  pending += 1;
  emit();
  return promise.finally(() => {
    pending -= 1;
    emit();
  });
};

/**
 * React.lazy page with a preload() that starts the download early (on hover, on idle, during sign-in).
 * The import is shared, so preloading and rendering never download twice. Only downloads the user waits
 * for (not background preloads) move the progress bar.
 */
export const lazyPage = (loader, exportName) => {
  let promise;
  let resolved = false;
  const load = () => {
    promise ||= loader().then(
      (m) => {
        resolved = true;
        return m;
      },
      (error) => {
        promise = undefined; // let a later attempt retry (e.g. after a network blip)
        throw error;
      }
    );
    return promise;
  };
  const Component = lazy(() => {
    const p = load().then((m) => ({ default: exportName ? m[exportName] : m.default }));
    return resolved ? p : track(p);
  });
  Component.preload = () => load().catch(() => {});
  return Component;
};
