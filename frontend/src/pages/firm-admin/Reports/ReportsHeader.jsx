import React from 'react';
import { Download, Printer } from 'lucide-react';
import { Button, PageHeader } from '../../../components/ui';

export const ReportsHeader = ({ onPrint, onExportCSV }) => (
  <PageHeader
    title="Reports"
    description="Workload, staff performance, billing, collections and compliance across your firm."
    actions={
      <>
        <Button icon={Printer} onClick={onPrint}>Print</Button>
        <Button variant="primary" icon={Download} onClick={onExportCSV}>Download CSV</Button>
      </>
    }
  />
);
