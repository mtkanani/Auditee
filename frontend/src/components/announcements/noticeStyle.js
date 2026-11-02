import { Bell, Info, TriangleAlert } from 'lucide-react';

// Look of a notice by priority: badge tone, icon, icon tile and icon colour.
export const PRIORITY = {
  URGENT: { tone: 'danger', label: 'Urgent', icon: TriangleAlert, tile: 'bg-danger-soft text-danger', text: 'text-danger' },
  WARNING: { tone: 'warning', label: 'Important', icon: Bell, tile: 'bg-warning-soft text-warning', text: 'text-warning' },
  INFO: { tone: 'accent', label: 'Info', icon: Info, tile: 'bg-accent-soft text-accent-fg', text: 'text-accent-fg' },
};

export const priorityStyle = (p) => PRIORITY[p] || PRIORITY.INFO;

export const categoryLabel = (c = 'GENERAL') => c.charAt(0) + c.slice(1).toLowerCase();

export const shortDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
