export const CATEGORIES = [
  { value: 'GST', label: 'GST' },
  { value: 'INCOME_TAX', label: 'Income tax and audit' },
  { value: 'TDS', label: 'TDS' },
  { value: 'ROC_MCA', label: 'ROC / MCA' },
  { value: 'PF_ESI', label: 'PF and ESI' },
  { value: 'AUDIT', label: 'Audit' },
];

export const STATUSES = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'FILED', label: 'Filed' },
  { value: 'OVERDUE', label: 'Overdue' },
];

export const categoryLabel = (v) => CATEGORIES.find((c) => c.value === v)?.label || v;

export const shortDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
