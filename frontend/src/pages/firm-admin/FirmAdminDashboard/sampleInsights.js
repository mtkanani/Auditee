// TEMPORARY: made-up chart data so the home charts can be tried before a firm has real history.
// Only used when someone turns on "Show sample data", and always shown with a "Sample data" banner.
// To remove: see sampleHome.js.

const pad = (n) => String(n).padStart(2, '0');

/** Same shape as GET /firm-admin/home/insights. Fixed numbers, so it looks the same every time. */
export const sampleInsights = (months = 6) => {
  const now = new Date();
  const billed = [212000, 248000, 196000, 318000, 284000, 265000, 301000, 276000, 334000, 297000, 352000, 158000];
  const collected = [184000, 231000, 207000, 262000, 271000, 238000, 289000, 254000, 301000, 280000, 318000, 96000];

  const revenue = Array.from({ length: months }, (_, i) => {
    const back = months - 1 - i;
    const d = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const k = 12 - months + i;
    return { month: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, billed: billed[k], collected: collected[k] };
  });

  const weekday = [11, 12, 10, 13, 12];
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - i));
    const wd = d.getDay();
    return {
      day: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      checkedIn: wd === 0 ? 0 : wd === 6 ? 4 : weekday[(i * 3) % weekday.length],
    };
  });

  return {
    revenue,
    attendance: { team: 14, days },
    compliance: { overdue: 3, upcoming: 12, inProgress: 7, filed: 46 },
    topOutstanding: [
      { clientId: 's1', name: 'Apex Technologies Pvt Ltd', balance: 118000, invoices: 2 },
      { clientId: 's2', name: 'Kumar and Sons', balance: 88500, invoices: 1 },
      { clientId: 's3', name: 'Bo Industries LLP', balance: 59000, invoices: 2 },
      { clientId: 's4', name: 'Shah Traders', balance: 35400, invoices: 1 },
      { clientId: 's5', name: 'Neha Foods', balance: 15400, invoices: 1 },
    ],
  };
};
