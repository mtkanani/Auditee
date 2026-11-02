import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { Button } from '../../../components/ui';

// TEMPORARY sample data switch for the firm admin home: lasts for this browser tab only, so real data
// always comes back. See sampleHome.js for how to remove it.
const SAMPLE_KEY = 'auditee-sample-charts';
const readSample = () => {
  try {
    const v = sessionStorage.getItem(SAMPLE_KEY);
    return v === '1' ? true : v === '0' ? false : null;
  } catch {
    return null;
  }
};

/**
 * [choice, setChoice]: true or false once someone has clicked the switch in this tab, null before
 * that (the page then shows sample data only while the firm has no data of its own).
 */
export const useSampleMode = () => {
  const [choice, setChoiceState] = useState(readSample);
  const setChoice = (on) => {
    setChoiceState(on);
    try {
      sessionStorage.setItem(SAMPLE_KEY, on ? '1' : '0');
    } catch {
      // storage blocked: the switch still applies until the page reloads
    }
  };
  return [choice, setChoice];
};

export const SampleButton = ({ onClick }) => (
  <Button size="sm" variant="ghost" icon={FlaskConical} onClick={onClick}>
    Show sample data
  </Button>
);

export const SampleBanner = ({ onOff, auto = false }) => (
  <div className="rise flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning-soft px-4 py-3">
    <p className="flex items-center gap-2 text-sm font-medium text-warning">
      <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
      {auto
        ? "Your firm has no clients, tasks or invoices yet, so this is sample data to show how the home page works. Your real numbers replace it as soon as you add some."
        : "Sample data, not your firm's numbers. Nothing you click here changes real records."}
    </p>
    <Button size="sm" variant="secondary" onClick={onOff}>
      Show real data
    </Button>
  </div>
);
