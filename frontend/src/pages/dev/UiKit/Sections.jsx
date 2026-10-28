import React, { useState } from 'react';
import { Briefcase, CalendarClock, Download, IndianRupee, LayoutGrid, List, ListChecks, Mail, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, Field, FilterBar, Input, SearchInput, Select, StatCard, StatusTag, Table, Tabs, Textarea } from '../../../components/ui';
import { sampleTasks, inr } from './sampleData';

export const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-semibold text-muted">{title}</h2>
    {children}
  </section>
);

export const ButtonsSection = () => (
  <Section title="Buttons">
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" icon={Plus}>New task</Button>
        <Button icon={Download}>Export</Button>
        <Button variant="soft">Use template</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger" icon={Trash2}>Delete</Button>
        <Button variant="primary" loading>Saving</Button>
        <Button size="sm">Small</Button>
        <Button size="icon" variant="ghost" aria-label="Edit"><Pencil className="w-4 h-4" /></Button>
      </div>
    </Card>
  </Section>
);

export const StatsSection = () => (
  <Section title="Stat cards">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Open tasks" value="38" icon={ListChecks} delta="+6" hint="this week" onClick={() => {}} />
      <StatCard label="Overdue" value="5" icon={CalendarClock} tone="danger" delta="+2" trend="down" hint="vs last week" />
      <StatCard label="Outstanding" value="₹4,21,500" icon={IndianRupee} tone="warning" hint="18 invoices" />
      <StatCard label="Active clients" value="126" icon={Briefcase} tone="success" delta="+4%" />
    </div>
  </Section>
);

export const FormSection = () => {
  const [email, setEmail] = useState('ravi@shah');
  return (
    <Section title="Form controls">
      <Card title="New client" description="Fields show a label, a hint or an error, and a focus glow.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Client name" required hint="As it appears on the GST certificate">
            {(p) => <Input {...p} placeholder="Apex Technologies Pvt Ltd" />}
          </Field>
          <Field label="Email" required error={email.includes('.') ? undefined : 'Enter a valid email address'}>
            {(p) => <Input {...p} icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <Field label="Constitution">
            {(p) => (
              <Select {...p} defaultValue="LLP" options={[{ value: 'INDIVIDUAL', label: 'Individual' }, { value: 'LLP', label: 'LLP' }, { value: 'PRIVATE_LIMITED', label: 'Private limited' }]} />
            )}
          </Field>
          <Field label="PAN" hint="10 characters">
            {(p) => <Input {...p} placeholder="ABCDE1234F" />}
          </Field>
          <Field label="Notes" className="md:col-span-2">
            {(p) => <Textarea {...p} placeholder="Anything the team should know" />}
          </Field>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Create client</Button>
        </div>
      </Card>
    </Section>
  );
};

export const BadgesSection = () => (
  <Section title="Badges">
    <Card>
      <div className="flex flex-wrap gap-2">
        <Badge>Neutral</Badge>
        <Badge tone="accent">GST</Badge>
        <Badge tone="success" dot>Paid</Badge>
        <Badge tone="warning" dot>Due in 2 days</Badge>
        <Badge tone="danger" dot>Overdue</Badge>
        {['PENDING', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'INACTIVE'].map((s) => <StatusTag key={s} status={s} />)}
      </div>
    </Card>
  </Section>
);

const columns = [
  { key: 'title', header: 'Task', render: (r) => (<div><p className="font-medium">{r.title}</p><p className="text-xs text-subtle">{r.client}</p></div>) },
  { key: 'assignee', header: 'Assignee', hideOnMobile: true },
  { key: 'due', header: 'Due', sortable: true },
  { key: 'fee', header: 'Fee', align: 'right', render: (r) => <span className="tabular-nums">{inr(r.fee)}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusTag status={r.status} /> },
];

export const TableSection = () => {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const rows = sampleTasks.filter((t) => `${t.title} ${t.client}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <Section title="Tabs, filter bar and table">
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks or clients" />
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button size="sm" variant="ghost" onClick={() => setLoading((v) => !v)}>{loading ? 'Show rows' : 'Show loading'}</Button>
          <Tabs aria-label="View" value={view} onChange={setView} items={[{ value: 'board', label: 'Board', icon: LayoutGrid }, { value: 'table', label: 'Table', icon: List, count: rows.length }]} />
        </div>
      </FilterBar>
      <Table columns={columns} data={rows} isLoading={loading} sortBy="due" sortOrder="asc" onSort={() => {}} onRowClick={() => {}} />
    </Section>
  );
};
