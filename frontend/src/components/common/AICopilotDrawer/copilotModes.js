import { BookOpen, FileText, MessageSquare, Shield } from 'lucide-react';

export const SUB_AI_MODES = [
  {
    id: 'trainee',
    shortLabel: 'Trainee',
    icon: BookOpen,
    description: 'Onboarding walkthrough, daily workflow & beginner CA FAQ',
    suggestions: [
      'How does the Auditee daily workflow work?',
      'What are my daily tasks as an article trainee?',
      'What is the difference between GSTR-1 and GSTR-3B?',
      'How do I log working hours in Time Entries?',
    ],
  },
  {
    id: 'admin',
    shortLabel: 'Admin',
    icon: Shield,
    description: 'Firm compliance overview, billing & team task allocation',
    suggestions: ['Explain firm compliance tracking', 'How to manage overdue tasks', 'How do I reassign client tasks?'],
  },
  {
    id: 'document',
    shortLabel: 'Audit',
    icon: FileText,
    description: 'Working paper checklists, OCR parsing & audit vault rules',
    suggestions: ['What documents are required for Private Ltd MCA filing?', 'How to categorize files in Document Vault?'],
  },
  {
    id: 'client',
    shortLabel: 'Client',
    icon: MessageSquare,
    description: 'Client portal guidance & tax filing requirements',
    suggestions: ['How do clients submit work requests?', 'What files are needed for Income Tax return filing?'],
  },
];

export const defaultModeFor = (role) =>
  role === 'CLIENT' ? 'client' : role === 'FIRM_ADMIN' || role === 'SUPER_ADMIN' ? 'admin' : 'trainee';

export const welcomeMessages = (firstName) => ({
  trainee: [
    {
      sender: 'ai',
      text: `### Welcome to Auditee
Hello ${firstName || 'there'}! I'm your trainee assistant.

Pick a quick question below or ask me anything about the **daily workflow** or **beginner audit and tax** topics.`,
    },
  ],
  admin: [
    {
      sender: 'ai',
      text: `### Firm operations
Ask me about compliance tracking, team workload or invoices.`,
    },
  ],
  document: [
    {
      sender: 'ai',
      text: `### Audit and documents
I can help you organise working papers, file GST/ITR documents and check client paperwork.`,
    },
  ],
  client: [
    {
      sender: 'ai',
      text: `### Client help
I can help you find your way around the portal, check your requests and see which documents you need.`,
    },
  ],
});
