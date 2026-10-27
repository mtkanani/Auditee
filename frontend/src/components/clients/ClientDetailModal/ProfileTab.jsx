import React from 'react';
import { Briefcase, ExternalLink, MapPin, Shield, User } from 'lucide-react';

export const ProfileTab = ({ client }) => (
  <div className="space-y-6">
    {/* Tax Registration Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          GST Number (GSTIN)
        </span>
        <p className="text-sm font-extrabold text-indigo-400 tracking-wider">
          {client.gstNumber || 'Not Registered'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          PAN Number
        </span>
        <p className="text-sm font-extrabold text-purple-400 tracking-wider">
          {client.panNumber || 'N/A'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          TAN Number (TDS)
        </span>
        <p className="text-sm font-extrabold text-emerald-400 tracking-wider">
          {client.tanNumber || 'N/A'}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          CIN Number (ROC)
        </span>
        <p className="text-sm font-extrabold text-amber-400 tracking-wider">
          {client.cinNumber || 'N/A'}
        </p>
      </div>
    </div>

    {/* Company & Primary Contact Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Company Details */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <Briefcase size="1em" className="text-indigo-400"  />
          <span>Company & Organization Details</span>
        </h4>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Client Name:</span>
            <p className="font-semibold text-slate-200">{client.clientName}</p>
          </div>
          <div>
            <span className="text-slate-400">Company Legal Name:</span>
            <p className="font-semibold text-slate-200">{client.companyName || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400">Business / Constitution:</span>
            <p className="font-semibold text-slate-200">{client.businessType || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400">Industry Category:</span>
            <p className="font-semibold text-slate-200">{client.industryCategory || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400">Phone:</span>
            <p className="font-semibold text-slate-200">{client.phone || 'N/A'}</p>
          </div>
          <div>
            <span className="text-slate-400">Alternate Phone:</span>
            <p className="font-semibold text-slate-200">{client.alternatePhone || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400">Website:</span>
            <p className="font-semibold text-indigo-400 truncate">
              {client.website ? (
                <a href={client.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                  {client.website} <ExternalLink size="1em" />
                </a>
              ) : (
                'N/A'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Primary Contact Person */}
      <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
          <User size="1em" className="text-purple-400"  />
          <span>Primary Contact Person</span>
        </h4>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400">Full Name:</span>
            <p className="font-bold text-slate-100 text-sm">{client.contactPersonName || 'Not specified'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400">Designation:</span>
              <p className="font-semibold text-slate-200">{client.contactPersonDesignation || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-400">Mobile / Phone:</span>
              <p className="font-semibold text-slate-200">{client.contactPersonPhone || 'N/A'}</p>
            </div>
          </div>
          <div>
            <span className="text-slate-400">Email Address:</span>
            <p className="font-semibold text-purple-300">{client.contactPersonEmail || 'N/A'}</p>
          </div>
        </div>

        {/* Registered Address */}
        <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <MapPin size="1em" className="text-rose-400"  />
            <span>Registered Office Address:</span>
          </span>
          <p className="font-semibold text-slate-200">
            {client.address || 'No address specified'}
            {client.city ? `, ${client.city}` : ''}
            {client.state ? `, ${client.state}` : ''}
            {client.pincode ? ` - ${client.pincode}` : ''}
          </p>
        </div>
      </div>
    </div>

    {/* Assigned Auditors Card */}
    <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
      <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <Shield size="1em" className="text-emerald-400"  />
        <span>Dedicated Staff Accountants & Auditors</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {client.assignments?.map((a) => (
          <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
              {a.user?.firstName?.[0] || 'U'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">{a.user?.firstName} {a.user?.lastName}</p>
              <span className="text-[10px] text-slate-400">{a.user?.designation || 'CA Staff'}</span>
            </div>
          </div>
        ))}

        {(!client.assignments || client.assignments.length === 0) && (
          <p className="text-xs text-slate-500 col-span-3">No staff members currently paired with this client.</p>
        )}
      </div>
    </div>
  </div>
);
