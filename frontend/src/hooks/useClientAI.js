import { useState, useCallback } from 'react';
import { aiAPI } from '../services/api';

export const useClientAI = (clientId) => {
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const generateBriefing = useCallback(async (force = false) => {
    setBriefingLoading(true);
    setBriefingError(null);
    try {
      const res = await aiAPI.getBriefing(clientId);
      if (res.data?.status === 'success' || res.data?.past) {
        setBriefing(res.data?.data || res.data);
      } else {
        throw new Error('Malformed response');
      }
    } catch (err) {
      console.error('Briefing Hook Error:', err);
      setBriefingError(err.message || 'Failed to generate briefing');
    } finally {
      setBriefingLoading(false);
    }
  }, [clientId]);

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setChatLoading(true);
    
    try {
      const res = await aiAPI.chat(clientId, {
        message,
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });
      
      const aiMessage = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat Hook Error:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I could not process that. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  }, [clientId, messages]);

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
};
