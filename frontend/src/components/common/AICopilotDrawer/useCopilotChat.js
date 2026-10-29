import { useState } from 'react';
import { aiApi } from '../../../api/aiApi';
import { defaultModeFor, welcomeMessages } from './copilotModes';

/** One chat history per copilot mode. */
export const useCopilotChat = (user) => {
  const [activeMode, setActiveMode] = useState(defaultModeFor(user?.role));
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => welcomeMessages(user?.firstName));

  const append = (msg) =>
    setMessages((prev) => ({ ...prev, [activeMode]: [...(prev[activeMode] || []), msg] }));

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMessage.trim();
    if (!query || loading) return;

    setInputMessage('');
    append({ sender: 'user', text: query });
    setLoading(true);

    try {
      const response = await aiApi.askCopilot({ mode: activeMode, message: query });
      append({ sender: 'ai', text: response?.data?.reply || 'Thank you for your question!' });
    } catch (err) {
      append({ sender: 'ai', text: `Couldn't reach the assistant (${err.message || 'error'}). Try again in a moment.` });
    } finally {
      setLoading(false);
    }
  };

  return {
    activeMode,
    setActiveMode,
    inputMessage,
    setInputMessage,
    loading,
    currentChat: messages[activeMode] || [],
    handleSend,
  };
};
