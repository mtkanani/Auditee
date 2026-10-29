import React, { useState, useRef, useEffect } from 'react';
import { Bot, ChevronRight, Info, Send, Sparkles, User, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cn } from '../../../lib/cn';
import { SUB_AI_MODES } from './copilotModes';
import { FormattedText } from './FormattedText';
import { useCopilotChat } from './useCopilotChat';

export const AICopilotDrawer = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { activeMode, setActiveMode, inputMessage, setInputMessage, loading, currentChat, handleSend } = useCopilotChat(user);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat, activeMode, isOpen]);

  // Focus the message box on open; Escape closes.
  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const currentSubAi = SUB_AI_MODES.find((m) => m.id === activeMode) || SUB_AI_MODES[0];

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-6 z-50 inline-flex items-center gap-2 h-11 px-4 rounded-full bg-accent text-on-accent text-sm font-medium shadow-raised hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Ask AI
        </button>
      )}

      <aside
        role="dialog"
        aria-label="AI assistant"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-surface border-l border-line shadow-raised transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <header className="px-4 py-3 border-b border-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-accent-soft text-accent-fg shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-fg">AI assistant</h2>
              <p className="text-xs text-muted truncate">Answers about Auditee, tax and audit work</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close assistant"
            className="grid place-items-center w-8 h-8 rounded-lg text-subtle hover:text-fg hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <div className="p-2 border-b border-line flex gap-1 overflow-x-auto [scrollbar-width:none]" role="tablist" aria-label="Assistant mode">
          {SUB_AI_MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveMode(mode.id)}
                className={cn(
                  'flex-1 h-8 px-2.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors',
                  isActive ? 'bg-accent-soft text-fg' : 'text-muted hover:text-fg hover:bg-hover'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive && 'text-accent-fg')} aria-hidden="true" />
                {mode.shortLabel}
              </button>
            );
          })}
        </div>

        <p className="px-4 py-2 border-b border-line flex items-center gap-2 text-xs text-muted">
          <Info className="w-3.5 h-3.5 text-subtle shrink-0" aria-hidden="true" />
          {currentSubAi.description}
        </p>

        <div className="flex-1 p-4 overflow-y-auto space-y-4" aria-live="polite">
          {currentChat.map((msg, index) => (
            <div key={index} className={cn('flex gap-2.5', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.sender === 'ai' && (
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-soft text-accent-fg shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" aria-hidden="true" />
                </span>
              )}
              <div
                className={cn(
                  'max-w-[85%] px-3 py-2.5 rounded-2xl text-sm',
                  msg.sender === 'user' ? 'bg-accent text-on-accent rounded-tr-sm' : 'bg-sunken/60 border border-line text-muted rounded-tl-sm'
                )}
              >
                {msg.sender === 'user' ? msg.text : <FormattedText text={msg.text} />}
              </div>
              {msg.sender === 'user' && (
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-hover text-muted shrink-0 mt-0.5">
                  <User className="w-4 h-4" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-sm text-muted" role="status">
              <span className="grid place-items-center w-7 h-7 rounded-lg bg-accent-soft text-accent-fg animate-pulse">
                <Bot className="w-4 h-4" aria-hidden="true" />
              </span>
              Thinking…
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-2 border-t border-line">
          <p className="text-xs font-medium text-subtle mb-1.5">Try asking</p>
          <div className="flex flex-wrap gap-1.5">
            {currentSubAi.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={loading}
                onClick={() => handleSend(suggestion)}
                className="text-xs px-2.5 py-1 rounded-lg border border-line text-muted hover:text-fg hover:border-accent/40 hover:bg-accent-soft transition-colors inline-flex items-center gap-1 text-left disabled:opacity-60"
              >
                {suggestion}
                <ChevronRight className="w-3 h-3 text-subtle shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-line flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask the ${currentSubAi.shortLabel.toLowerCase()} assistant`}
            aria-label="Message"
            disabled={loading}
            className="flex-1 h-10 px-3 rounded-xl bg-sunken border border-line text-sm text-fg placeholder:text-subtle focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            aria-label="Send"
            className="grid place-items-center w-10 h-10 rounded-xl bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </aside>
    </>
  );
};

export default AICopilotDrawer;
