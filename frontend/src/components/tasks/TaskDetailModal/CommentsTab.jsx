import React from 'react';
import { Paperclip, Send } from 'lucide-react';

export const CommentsTab = ({ task, handleAddComment, commentText, setCommentText, commentFileUrl, setCommentFileUrl }) => (
  <div className="space-y-6">
    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
      {task?.comments?.map((c) => (
        <div key={c.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-400">{c.commenterName} ({c.commenterRole})</span>
            <span className="text-[10px] text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-200">{c.comment}</p>
          {c.fileUrl && (
            <a href={c.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 mt-1">
              <Paperclip size="1em" /> View Attached File
            </a>
          )}
        </div>
      ))}

      {(!task?.comments || task.comments.length === 0) && (
        <p className="text-xs text-slate-500 py-6 text-center">No comments yet. Post a question or note below.</p>
      )}
    </div>

    <form onSubmit={handleAddComment} className="space-y-3 pt-3 border-t border-slate-800">
      <textarea
        required
        rows={2}
        placeholder="Write a comment or discussion note..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
      />
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Optional File URL attachment..."
          value={commentFileUrl}
          onChange={(e) => setCommentFileUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
        />
        <button
          type="submit"
          className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
        >
          <Send size="1em" />
          <span>Post Comment</span>
        </button>
      </div>
    </form>
  </div>
);
