import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CornerDownLeft, Moon, Plus, Search, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getCreateActions, getNavGroups } from '../../layouts/navigation';
import { cn } from '../../lib/cn';

// Every word of the query must appear in the label or its section.
const matches = (query, text) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = text.toLowerCase();
  return words.every((w) => hay.includes(w));
};

/** Ctrl/Cmd K palette: jump to pages, start a create flow, switch theme. */
export const CommandPalette = ({ open, onClose }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocusRef = useRef(null);

  const commands = useMemo(() => {
    const pages = getNavGroups(user?.role).flatMap((g) =>
      g.items.map((item) => ({ id: item.path, section: g.label, label: item.label, icon: item.icon, run: () => navigate(item.path) }))
    );
    const creates = getCreateActions(user?.role).map((a) => ({
      id: `new-${a.label}`,
      section: 'Create',
      label: `New ${a.label.toLowerCase()}`,
      icon: Plus,
      run: () => navigate(a.path, { state: a.state || { openCreate: true } }),
    }));
    const theme = {
      id: 'theme',
      section: 'Settings',
      label: isDark ? 'Switch to light theme' : 'Switch to dark theme',
      icon: isDark ? Sun : Moon,
      run: toggleTheme,
    };
    return [...creates, ...pages, theme];
  }, [user?.role, isDark, navigate, toggleTheme]);

  const results = useMemo(
    () => (query ? commands.filter((c) => matches(query, `${c.label} ${c.section}`)) : commands),
    [commands, query]
  );

  // Focus the input on open; give focus back to whatever had it on close.
  useEffect(() => {
    if (!open) return undefined;
    returnFocusRef.current = document.activeElement;
    setQuery('');
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const runAt = (i) => {
    const cmd = results[i];
    if (!cmd) return;
    onClose();
    cmd.run();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  let lastSection = null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search and jump"
        className="relative w-full max-w-xl rounded-2xl bg-surface border border-line shadow-raised overflow-hidden animate-slide-up"
      >
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search className="w-5 h-5 text-subtle shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search pages and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
            className="flex-1 h-14 bg-transparent text-[15px] text-fg placeholder:text-subtle focus:outline-none"
          />
          <kbd className="text-[11px] font-medium text-muted border border-line rounded-md px-1.5 h-5 inline-flex items-center">Esc</kbd>
        </div>

        <ul id="command-results" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-10 text-center text-sm text-muted">No pages or actions match “{query}”.</li>
          )}
          {results.map((cmd, i) => {
            const Icon = cmd.icon;
            const header = cmd.section !== lastSection ? cmd.section : null;
            lastSection = cmd.section;
            return (
              <React.Fragment key={cmd.id}>
                {header && <li role="presentation" className="px-3 pt-3 pb-1 text-xs font-medium text-subtle">{header}</li>}
                <li
                  id={`cmd-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => runAt(i)}
                  className={cn(
                    'flex items-center gap-3 h-10 px-3 rounded-xl text-sm cursor-pointer',
                    i === active ? 'bg-accent-soft text-fg' : 'text-muted'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0', i === active ? 'text-accent-fg' : 'text-subtle')} aria-hidden="true" />
                  <span className="flex-1 truncate">{cmd.label}</span>
                  {i === active && (cmd.section === 'Create' || cmd.section === 'Settings'
                    ? <CornerDownLeft className="w-4 h-4 text-accent-fg" aria-hidden="true" />
                    : <ArrowRight className="w-4 h-4 text-accent-fg" aria-hidden="true" />)}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
