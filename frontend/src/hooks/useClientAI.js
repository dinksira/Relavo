import { useState, useCallback, useEffect } from 'react';
import { aiAPI } from '../services/api';

/**
 * All AI state management for client detail page.
 * Briefing + chat in one hook.
 */
export default function useClientAI(clientId) {
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const generateBriefing = useCallback(async () => {
    if (!clientId) return;
    
    setBriefingLoading(true);
    setBriefingError(null);
    
    try {
      const res = await aiAPI.getBriefing(clientId);
      // The backend returns { data: result }
      setBriefing(res.data.data);
    } catch (err) {
      console.error('Error generating briefing:', err);
      setBriefingError(err.message || 'Could not generate briefing');
    } finally {
      setBriefingLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    generateBriefing();
  }, [generateBriefing]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || chatLoading) return;

    const userMessage = { 
      role: 'user', 
      content: message, 
      timestamp: new Date().toISOString() 
    };

    // Optimistically add to messages
    setMessages(prev => [...prev, userMessage]);
    setChatLoading(true);

    try {
      const res = await aiAPI.chat(
        clientId, 
        message, 
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      const aiMessage = {
        role: 'assistant',
        content: res.data.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Try again.',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  }, [clientId, messages, chatLoading]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    briefing,
    briefingLoading,
    briefingError,
    generateBriefing,
    messages,
    chatLoading,
    sendMessage,
    clearChat
  };
}
