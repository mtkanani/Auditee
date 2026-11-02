import React from 'react';
import { TeamToday } from '../TeamToday';
import { BillingTarget } from './BillingTarget';
import { ComplianceCalendar } from './ComplianceCalendar';
import { InvoiceAging } from './InvoiceAging';
import { LeadPipeline } from './LeadPipeline';
import { PendingDocuments } from './PendingDocuments';
import { ReadyToBill } from './ReadyToBill';
import { RecentActivity } from './RecentActivity';
import { Slot } from './Slot';
import { TeamWorkload } from './TeamWorkload';
import { TodayAgenda } from './TodayAgenda';

// Rows of the firm admin home built from the workspace data (see useWorkspace). ws is that query.

const Row = ({ children }) => <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">{children}</div>;

/** Today's agenda next to the monthly billing target. */
export const TodayRow = ({ ws, sample }) => (
  <Row>
    <div className="xl:col-span-2">
      <Slot ws={ws} title="Today's agenda" rows={3} className="h-full">
        {(d) => <TodayAgenda agenda={d.agenda} />}
      </Slot>
    </div>
    <Slot ws={ws} title="Monthly billing target" rows={3} className="h-full">
      {(d) => <BillingTarget target={d.target} sample={sample} />}
    </Slot>
  </Row>
);

export const CalendarSection = ({ ws }) => (
  <Slot ws={ws} title="Compliance calendar" rows={2}>
    {(d) => <ComplianceCalendar items={d.calendar} />}
  </Slot>
);

/** Money still to collect, and work still to bill. */
export const MoneyRow = ({ ws, sample }) => (
  <Row>
    <div className="xl:col-span-2">
      <Slot ws={ws} title="Unpaid invoices by age" rows={4} className="h-full">
        {(d) => <InvoiceAging aging={d.aging} sample={sample} />}
      </Slot>
    </div>
    <Slot ws={ws} title="Ready to bill" rows={4} className="h-full">
      {(d) => <ReadyToBill ready={d.readyToBill} />}
    </Slot>
  </Row>
);

/** Who has room for more work, next to today's attendance and leave requests. */
export const TeamRow = ({ ws, attendance, leave, sample }) => (
  <Row>
    <div className="xl:col-span-2">
      <Slot ws={ws} title="Team workload" rows={5} className="h-full">
        {(d) => <TeamWorkload workload={d.workload} />}
      </Slot>
    </div>
    <TeamToday attendance={attendance} leave={leave} sample={sample} />
  </Row>
);

/** Documents waiting on clients, the lead pipeline and what just happened. */
export const PipelineRow = ({ ws, sample }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
    <Slot ws={ws} title="Waiting on clients" rows={4} className="h-full">
      {(d) => <PendingDocuments documents={d.documents} sample={sample} />}
    </Slot>
    <Slot ws={ws} title="Lead pipeline" rows={4} className="h-full">
      {(d) => <LeadPipeline leads={d.leads} />}
    </Slot>
    <div className="md:col-span-2 xl:col-span-1">
      <Slot ws={ws} title="Recent activity" rows={5} className="h-full">
        {(d) => <RecentActivity activity={d.activity} />}
      </Slot>
    </div>
  </div>
);
