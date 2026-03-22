import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Brain, User, Loader2 } from 'lucide-react';
import { useClientAI } from '../../hooks/useClientAI';

const Message = ({ msg }) => {
  const isAI = msg.role === 'assistant';
  
  // Format response: **bold** and newlines
  const formattedContent = msg.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split('\n')
    .map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isAI ? 'row' : 'row-reverse',
      gap: 12, marginBottom: 16,
      maxWidth: '100%'
    }}>
      {isAI && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: '#eff6ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Sparkles size={14} color="#3b82f6" />
        </div>
      )}
      
      <div style={{ maxWidth: isAI ? '80%' : '75%' }}>
        <div style={{
          background: isAI ? '#ffffff' : '#3b82f6',
          color: isAI ? '#0f172a' : '#ffffff',
          border: isAI ? '1px solid #e2e8f0' : 'none',
          padding: '12px 16px',
          borderRadius: isAI ? '2px 12px 12px 12px' : '12px 12px 2px 12px',
          fontSize: 14, lineHeight: 1.7,
        }}>
          <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
        </div>
        <p style={{ 
          fontSize: 10, color: '#94a3b8', marginTop: 4, 
          textAlign: isAI ? 'left' : 'right', margin: '4px 0 0' 
        }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

const SuggestionChip = ({ text, onClick }) => (
  <button
    onClick={() => onClick(text)}
    style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 100,
      padding: '8px 16px', fontSize: 13, color: '#374151', cursor: 'pointer',
      textAlign: 'left', transition: 'all 150ms', fontFamily: 'inherit'
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
  >
    {text}
  </button>
);

const AIChat = ({ clientId, clientName }) => {
  const { messages, chatLoading, sendMessage } = useClientAI(clientId);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  // Initial focus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || chatLoading) return;
    sendMessage(input);
    setInput('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "What's the biggest risk with this client?",
    "Should I be worried about churn?",
    "What should I say in my next email?",
    "Summarize our relationship in one sentence"
  ];

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 24, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} color="#3b82f6" />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>Ask AI about {clientName}</h3>
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8' }}>Powered by Groq · Llama 3.3</span>
      </div>

      {/* Messages */}
      <div style={{ height: 380, overflowY: 'auto', padding: 20, background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Brain size={40} color="#cbd5e1" />
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Ask me anything about {clientName}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 500, marginTop: 12 }}>
              {suggestions.map(s => <SuggestionChip key={s} text={s} onClick={sendMessage} />)}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => <Message key={i} msg={m} />)}
            {chatLoading && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} color="#3b82f6" />
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '2px 12px 12px 12px', minWidth: 60 }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Ask anything about ${clientName}...`}
          style={{
            flex: 1, border: '1px solid #e2e8f0', borderRadius: 24, padding: '10px 18px',
            fontSize: 14, fontFamily: 'inherit', color: '#0f172a', outline: 'none',
            resize: 'none', maxHeight: 120, lineHeight: 1.5, background: '#fff'
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || chatLoading}
          style={{
            width: 40, height: 40, borderRadius: '50%', background: (!input.trim() || chatLoading) ? '#94a3b8' : '#3b82f6',
            color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms'
          }}
          onMouseEnter={e => { if (input.trim() && !chatLoading) e.currentTarget.style.backgroundColor = '#2563eb' } }
          onMouseLeave={e => { if (input.trim() && !chatLoading) e.currentTarget.style.backgroundColor = '#3b82f6' } }
        >
          {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};

export default AIChat;
