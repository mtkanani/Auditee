/**
 * Utility to export an array of JSON objects to CSV file download
 * @param {Array<Object>} data
 * @param {string} filename
 */
export const exportToCsv = (data, filename = 'export.csv') => {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  // Extract headers
  const headers = Object.keys(data[0]);

  const csvRows = [];
  // Push headers
  csvRows.push(headers.join(','));

  // Push values
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Create Blob and trigger download
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
