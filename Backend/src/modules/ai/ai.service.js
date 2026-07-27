/**
 * Auditee AI Copilot Service
 * Supports 4 Sub-AI modes:
 * - 'trainee': Software Workflow Guide, Trainee Onboarding & CA Beginner FAQ
 * - 'admin': Firm Operations, Overdue Compliance & Task Allocation Insights
 * - 'document': Audit Paper Summaries & Document Extraction
 * - 'client': Client Portal Helpdesk & Tax Q&A
 */

const SYSTEM_PROMPTS = {
  trainee: `You are the Auditee Trainee & Student Onboarding AI Assistant.
Your job is to teach new CA article trainees, interns, and students how to use the Auditee software and answer beginner accounting/auditing questions.

Auditee Software Workflow:
1. Morning Attendance: Go to Attendance page -> Click "Check In" (uses GPS verification).
2. Daily Tasks: Open "My Tasks" -> Select high priority task -> Change status from PENDING to IN_PROGRESS.
3. Time Logging: Go to "Time Entries" -> Log hours spent on client tasks.
4. Document Vault: Upload audit working papers, GST receipts, or ITR proofs under the client folder.
5. Task Review: Change task status to UNDER_REVIEW so senior CAs / Firm Admins can inspect it.

Style: Friendly, encouraging, structured, using bullet points and clear step-by-step guidance.`,

  admin: `You are the Auditee Firm Operations & Management AI Advisor.
Your job is to assist Firm Admins and Super Admins in optimizing CA firm productivity, compliance deadlines, billing, and team task allocation.
Style: Professional, analytical, executive summary format.`,

  document: `You are the Auditee Document & Audit Paper Assistant.
Your job is to assist CA staff in reviewing tax documents, GST receipts, PAN/CIN data, and audit working papers.
Style: Precise, detail-oriented, structured audit checklist format.`,

  client: `You are the Auditee Client Portal AI Assistant.
Your job is to answer client questions about work requests, document requirements, and general tax filing deadlines in plain, easy-to-understand language.
Style: Helpful, polite, clear, non-technical financial guidance.`,
};

// Fallback intelligent response generator if Gemini API key is missing or offline
const generateOfflineFallback = (mode, userMessage) => {
  const msgLower = userMessage.toLowerCase();

  if (mode === 'trainee') {
    if (msgLower.includes('workflow') || msgLower.includes('how') || msgLower.includes('start') || msgLower.includes('begin')) {
      return `### 🗺️ Auditee Software Daily Workflow for Trainees & Students:

1. **Step 1: Check-in Attendance**
   - Go to the **Attendance** tab in your dashboard and click **Check In**.

2. **Step 2: Check Assigned Work**
   - Go to **My Tasks** to view all client tasks assigned to you by the Firm Admin.
   - Click on a task and update its status from **PENDING** to **IN_PROGRESS**.

3. **Step 3: Log Working Hours**
   - Head over to **Time Entries** to record the exact hours spent on each task.

4. **Step 4: Upload Audit Papers**
   - Store working files, GST receipts, or bank statements in the **Document Vault**.

5. **Step 5: Submit for Senior Review**
   - Once complete, change task status to **UNDER_REVIEW**. Your senior will verify and mark it **COMPLETED**!`;
    }

    if (msgLower.includes('gst') || msgLower.includes('gstr')) {
      return `### 💡 Beginner Guide: GST Returns in Auditee
- **GSTR-1**: Statement of Outward Sales (due 11th of every month).
- **GSTR-3B**: Monthly Summary Return & Tax Payment (due 20th of every month).
- **How to manage in Auditee**: Upload sales & purchase registers in **Document Vault**, then update the task status under **Compliance**!`;
    }

    return `### 🎓 Auditee Trainee Onboarding Assistant
I'm here to help you master Auditee and answer beginner CA/Audit questions!

**Quick Actions You Can Ask Me:**
- *"Explain the Auditee daily workflow"*
- *"How do I submit my tasks for senior review?"*
- *"What is the difference between GSTR-1 and GSTR-3B?"*
- *"How do I log my time entries?"*`;
  }

  if (mode === 'admin') {
    return `### 📊 Firm Operations & Compliance Advisor
All firm modules are active. You can monitor overdue compliance under **Compliance Management**, review firm invoices in **Billing**, and reassign employee workloads under **Client Assignments**.`;
  }

  if (mode === 'document') {
    return `### 📑 Document & Audit Assistant
Upload working papers or invoices to the **Document Vault**. Auditee supports categorizing files under **GST Filings**, **Income Tax**, **KYC Legal**, or **Audit Reports**.`;
  }

  return `### 💬 Client Helpdesk
Welcome to Auditee Client Portal! You can track active work requests, download filed tax documents from your **Document Vault**, and inspect invoice billing status.`;
};

/**
 * Executes Copilot AI response using Gemini API with intelligent offline fallback.
 */
const getCopilotResponse = async ({ mode = 'trainee', message, history = [] }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.trainee;

  if (!apiKey) {
    console.log(`[AI Copilot] Operating in fallback mode for mode: ${mode}`);
    return {
      reply: generateOfflineFallback(mode, message),
      mode,
      source: 'offline_engine',
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.warn('Gemini API call returned non-200 or empty response. Using fallback engine.');
      return {
        reply: generateOfflineFallback(mode, message),
        mode,
        source: 'offline_engine',
      };
    }

    const replyText = data.candidates[0].content.parts[0].text;
    return {
      reply: replyText,
      mode,
      source: 'gemini_api',
    };
  } catch (error) {
    console.warn('Gemini API request failed:', error.message);
    return {
      reply: generateOfflineFallback(mode, message),
      mode,
      source: 'offline_engine',
    };
  }
};

module.exports = { getCopilotResponse };
