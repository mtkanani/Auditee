// Sample rows for the UI kit preview only.
export const sampleTasks = [
  { id: 101, title: 'GSTR-3B for March', client: 'Apex Technologies Pvt Ltd', assignee: 'Ravi Kumar', due: '20 Apr', status: 'IN_PROGRESS', fee: 4500 },
  { id: 102, title: 'TDS return Q4', client: 'Shah Traders', assignee: 'Sita Mehta', due: '15 Apr', status: 'OVERDUE', fee: 3200 },
  { id: 103, title: 'Statutory audit FY 25-26', client: 'Bo Industries LLP', assignee: 'Amit Joshi', due: '30 Sep', status: 'PENDING', fee: 85000 },
  { id: 104, title: 'ROC annual filing', client: 'Neha Foods', assignee: 'Ravi Kumar', due: '29 Oct', status: 'COMPLETED', fee: 12000 },
];

export const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
