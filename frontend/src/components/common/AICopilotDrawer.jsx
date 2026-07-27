import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, BookOpen, Shield, FileText, MessageSquare, ChevronRight, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { aiApi } from '../../api/aiApi';

const SUB_AI_MODES = [
  {
    id: 'trainee',
    label: '🎓 Student / Trainee AI',
    shortLabel: 'Trainee',
    icon: BookOpen,
    description: 'Onboarding walkthrough, daily workflow & beginner CA FAQ',
    suggestions: [
      '🗺️ How Auditee Daily Workflow Works',
      '📋 What are my daily tasks as an article trainee?',
      '❓ What is the difference between GSTR-1 and GSTR-3B?',
      '📝 How do I log working hours in Time Entries?',
    ],
  },
  {
    id: 'admin',
    label: '📊 Admin Operations AI',
    shortLabel: 'Admin',
    icon: Shield,
    description: 'Firm compliance overview, billing & team task allocation',
    suggestions: [
      '📊 Explain firm compliance tracking',
      '⌛ How to manage overdue tasks',
      '💼 How do I reassign client tasks?',
    ],
  },
  {
    id: 'document',
    label: '📑 Audit & Document AI',
    shortLabel: 'Audit',
    icon: FileText,
    description: 'Working paper checklists, OCR parsing & audit vault rules',
    suggestions: [
      '📑 What documents are required for Private Ltd MCA filing?',
      '🔍 How to categorize files in Document Vault?',
    ],
  },
  {
    id: 'client',
    label: '💬 Client Helpdesk AI',
    shortLabel: 'Client',
    icon: MessageSquare,
    description: '24/7 Client portal guidance & tax filing requirements',
    suggestions: [
      '💬 How do clients submit work requests?',
      '📁 What files are needed for Income Tax return filing?',
    ],
  },
];

export const AICopilotDrawer = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState(user?.role === 'CLIENT' ? 'client' : user?.role === 'FIRM_ADMIN' || user?.role === 'SUPER_ADMIN' ? 'admin' : 'trainee');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState({
    trainee: [
      {
        sender: 'ai',
        text: `### 🎓 Welcome to Auditee Trainee Onboarding!
Hello ${user?.firstName || 'Student'}! I am your AI Trainee Assistant. 

I'm here to help you get onboarded smoothly. Click any quick action below or ask me anything about **Auditee Daily Workflow** or **Beginner Audit & Tax FAQs**!`,
      },
    ],
    admin: [
      {
        sender: 'ai',
        text: `### 📊 Auditee Firm Operations AI
Welcome Admin! Ask me about firm compliance tracking, team workload allocation, or invoice management.`,
      },
    ],
    document: [
      {
        sender: 'ai',
        text: `### 📑 Audit & Document Assistant
I can guide you through organizing audit working papers, categorizing GST/ITR files, and verifying client legal documents.`,
      },
    ],
    client: [
      {
        sender: 'ai',
        text: `### 💬 Client Helpdesk Assistant
Welcome! I am here to help you navigate the client portal, check work request statuses, and find required tax documents.`,
      },
    ],
  });

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, activeMode, isOpen]);

  const currentSubAi = SUB_AI_MODES.find((m) => m.id === activeMode) || SUB_AI_MODES[0];
  const currentChat = messages[activeMode] || [];

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage.trim();
    if (!query || loading) return;

    setInputMessage('');
    const userMsg = { sender: 'user', text: query };

    setMessages((prev) => ({
      ...prev,
      [activeMode]: [...(prev[activeMode] || []), userMsg],
    }));

    setLoading(true);

    try {
      const response = await aiApi.askCopilot({
        mode: activeMode,
        message: query,
      });

      const aiReply = response?.data?.reply || 'Thank you for your question!';

      setMessages((prev) => ({
        ...prev,
        [activeMode]: [
          ...(prev[activeMode] || []),
          { sender: 'ai', text: aiReply },
        ],
      }));
    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [activeMode]: [
          ...(prev[activeMode] || []),
          {
            sender: 'ai',
            text: `⚠️ Unable to connect to AI server. (${err.message || 'Error'}). Try again in a moment.`,
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-indigo-300 my-2 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-300 my-1 leading-relaxed">
            {line.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return (
          <div key={idx} className="text-xs text-slate-200 font-medium my-1.5 pl-2 border-l-2 border-indigo-500/50 bg-slate-900/40 py-1 rounded-r">
            {line}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-300 leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Launcher Pinned on Right Side */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-6 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-indigo-400/40 group cursor-pointer"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
          <span>Auditee AI Copilot</span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">Right Side</span>
        </button>
      )}

      {/* Fixed Right-Side Collapsible Drawer Container */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-950/95 border-l border-slate-800 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Auditee AI Copilot
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Fixed Right
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">4-in-1 Multi-Agent CA Platform Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-AI Mode Tabs Selector */}
        <div className="p-2 border-b border-slate-800/60 bg-slate-950 flex gap-1 overflow-x-auto no-scrollbar">
          {SUB_AI_MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-AI Description Banner */}
        <div className="px-4 py-2 bg-indigo-950/30 border-b border-indigo-900/30 flex items-center gap-2 text-[11px] text-indigo-300">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{currentSubAi.description}</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {currentChat.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>Auditee AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Action Suggestion Pills */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/60">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">
            Suggested Quick Actions ({currentSubAi.shortLabel}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {currentSubAi.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSend(suggestion)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300 transition-all flex items-center gap-1 text-left"
              >
                <span>{suggestion}</span>
                <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask ${currentSubAi.shortLabel} AI anything...`}
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AICopilotDrawer;
