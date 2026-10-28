import React from 'react';
import { StatusTag } from '../../ui';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'C';
const typeLabel = { INDIVIDUAL: 'Individual', PRIVATE_LIMITED: 'Private limited', PARTNERSHIP: 'Partnership', LLP: 'LLP', PROPRIETORSHIP: 'Proprietorship', TRUST: 'Trust or NGO' };

/** Modal title: initials, name, type, status and contact line. */
export const ClientHeader = ({ client }) => (
  <div className="flex items-center gap-4 min-w-0">
    <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-on-accent text-base font-semibold shadow-glow shrink-0">
      {initials(client?.companyName || client?.clientName)}
    </span>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-semibold text-fg truncate">{client?.companyName || client?.clientName || 'Client'}</span>
        {client && <StatusTag status={client.status || 'ACTIVE'} />}
      </div>
      <p className="text-sm text-muted truncate">
        {[typeLabel[client?.clientType] || client?.clientType, client?.email, client?.phone].filter(Boolean).join(' · ')}
      </p>
    </div>
  </div>
);
