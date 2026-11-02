import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Button } from '../../../components/ui';

// TEMPORARY sample data switch for the firm admin home: lasts for this browser tab only, so real data
// always comes back. See sampleHome.js for how to remove it.
const SAMPLE_KEY = 'auditee-sample-charts';
const readSample = () => {
  try {
    return sessionStorage.getItem(SAMPLE_KEY) === '1';
  } catch {
    return false;
  }
};

export const useSampleMode = () => {
  const [sample, setSampleState] = useState(readSample);
  const setSample = (on) => {
    setSampleState(on);
    try {
      if (on) sessionStorage.setItem(SAMPLE_KEY, '1');
      else sessionStorage.removeItem(SAMPLE_KEY);
    } catch {
      // storage blocked: the switch still applies until the page reloads
    }
  };
  return [sample, setSample];
};

export const SampleButton = ({ onClick }) => (
  <Button size="sm" variant="ghost" icon={FlaskConical} onClick={onClick}>
    Show sample data
  </Button>
);

export const SampleBanner = ({ onOff }) => (
  <div className="rise flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3">
    <p className="flex items-center gap-2 text-sm font-medium text-warning">
      <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
      Sample data, not your firm's numbers. Nothing you click here changes real records.
    </p>
    <Button size="sm" variant="secondary" onClick={onOff}>
      Show real data
    </Button>
  </div>
);
