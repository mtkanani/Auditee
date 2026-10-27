import React from 'react';
import { Paperclip } from 'lucide-react';

export const AttachmentsTab = ({ handleAddDocument, docName, setDocName, docUrl, setDocUrl, task }) => (
  <div className="space-y-6">
    <form onSubmit={handleAddDocument} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Attach Task File / Working Sheet</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          required
          placeholder="File Name (e.g. GSTR-3B Computation Sheet.pdf)"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        />
        <input
          type="text"
          required
          placeholder="Document File Link / URL"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs">
          Upload File Record
        </button>
      </div>
    </form>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {task?.documents?.map((doc) => (
        <div key={doc.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-100">{doc.fileName}</p>
            <p className="text-[10px] text-slate-500">Uploaded by {doc.uploadedRole || 'User'}</p>
          </div>
          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-900 text-amber-400">
            <Paperclip size="1em" />
          </a>
        </div>
      ))}

      {(!task?.documents || task.documents.length === 0) && (
        <p className="text-xs text-slate-500 col-span-2 text-center py-4">No attachments uploaded for this task yet.</p>
      )}
    </div>
  </div>
);
