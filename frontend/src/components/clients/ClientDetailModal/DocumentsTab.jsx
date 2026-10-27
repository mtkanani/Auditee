import React from 'react';
import { ExternalLink, Folder, Plus, Trash2 } from 'lucide-react';

export const DocumentsTab = ({
  client,
  isAddingDoc,
  setIsAddingDoc,
  docForm,
  setDocForm,
  handleAddDocument,
  handleDeleteDocument,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-bold text-slate-200">Client Master Legal & Tax Documents Repository</h4>
      <button
        onClick={() => setIsAddingDoc(true)}
        className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
      >
        <Plus size="1em" />
        <span>Add Document Record</span>
      </button>
    </div>

    {/* Add Document Form */}
    {isAddingDoc && (
      <form onSubmit={handleAddDocument} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
        <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">New Master Document</h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            required
            placeholder="Document Name (e.g. GST Registration Certificate)"
            value={docForm.documentName}
            onChange={(e) => setDocForm({ ...docForm, documentName: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />

          <select
            value={docForm.documentType}
            onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="GST_CERTIFICATE">GST CERTIFICATE</option>
            <option value="PAN_CARD">PAN CARD</option>
            <option value="INCORPORATION_DEED">INCORPORATION DEED / MOA</option>
            <option value="BANK_STATEMENT">BANK STATEMENT</option>
            <option value="AUDIT_REPORT">PAST AUDIT REPORT</option>
            <option value="OTHER">OTHER</option>
          </select>

          <input
            type="text"
            required
            placeholder="File URL / Cloud Drive Link"
            value={docForm.fileUrl}
            onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsAddingDoc(false)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
          >
            Upload Metadata
          </button>
        </div>
      </form>
    )}

    {/* Documents List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {client.documents?.map((doc) => (
        <div key={doc.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Folder className="w-5 h-5"  />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-100">{doc.documentName}</h5>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">{doc.documentType}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Uploaded {new Date(doc.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-900 text-indigo-400 hover:text-indigo-300"
              title="View Document"
            >
              <ExternalLink size="1em" />
            </a>
            <button
              onClick={() => handleDeleteDocument(doc.id)}
              className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-rose-300"
              title="Delete"
            >
              <Trash2 size="1em" />
            </button>
          </div>
        </div>
      ))}

      {(!client.documents || client.documents.length === 0) && (
        <p className="text-xs text-slate-500 col-span-2">No master documents uploaded for this client yet.</p>
      )}
    </div>
  </div>
);
