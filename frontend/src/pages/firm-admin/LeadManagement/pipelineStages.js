// Pipeline columns in order. dot is the column's colour; label is also used in the stage pickers.
export const pipelineStages = [
  { key: 'NEW_LEAD', title: 'New inquiry', dot: 'bg-subtle' },
  { key: 'DISCUSSION', title: 'In discussion', dot: 'bg-accent' },
  { key: 'PROPOSAL_SENT', title: 'Proposal sent', dot: 'bg-warning' },
  { key: 'WON', title: 'Won', dot: 'bg-success' },
  { key: 'LOST', title: 'Lost', dot: 'bg-danger' },
];

export const stageOptions = pipelineStages.map((s) => ({ value: s.key, label: s.title }));

export const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
