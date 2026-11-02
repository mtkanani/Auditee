import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { loadProgress } from '../../lib/loadProgress';

const SHOW_AFTER_MS = 150;

/**
 * Thin bar along the top of the window while the user is waiting: a page's code downloading, or a
 * page loading its data for the first time. Background refreshes don't count. It only appears if
 * the wait lasts longer than SHOW_AFTER_MS, so quick switches stay calm, then fills and fades out.
 */
export const TopProgress = () => {
  const downloads = useSyncExternalStore(loadProgress.subscribe, loadProgress.getSnapshot);
  // Queries with no data yet (first load); refetches of data already on screen are ignored.
  const firstLoads = useIsFetching({ predicate: (q) => q.state.status === 'pending' });
  const busy = downloads + firstLoads > 0;

  const [phase, setPhase] = useState('idle'); // idle | running | done
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    if (busy) {
      timer.current = setTimeout(() => setPhase('running'), SHOW_AFTER_MS);
    } else {
      setPhase((p) => (p === 'running' ? 'done' : p));
      timer.current = setTimeout(() => setPhase('idle'), 400);
    }
    return () => clearTimeout(timer.current);
  }, [busy]);

  if (phase === 'idle') return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[3px] pointer-events-none" role="progressbar" aria-label="Loading page" aria-busy={phase === 'running'}>
      <div
        className={phase === 'running' ? 'top-progress-run' : 'top-progress-done'}
        style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', boxShadow: '0 0 10px var(--accent)' }}
      />
    </div>
  );
};
