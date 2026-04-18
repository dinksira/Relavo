import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Send, RefreshCw, User } from 'lucide-react';
import useClientAI from '../../hooks/useClientAI';

export default function AIChat({ clientId, clientName }) {
  const { 
    messages, 
    chatLoading, 
    sendMessage, 
    clearChat 
  } = useClientAI(clientId);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, chatLoading]);

  const handleSend = () => {
    if (!inputValue.trim() || chatLoading) return;
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    "What's the biggest risk with this client?",
    "Should I be worried about churn?",
    "What should I say in my next email?",
    "Summarize this relationship in one sentence"
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5 shadow-sm">
      {/* HEADER */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-semibold text-slate-900">Ask AI about {clientName}</h2>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Powered by Groq · Llama 3.3</span>
      </div>

      {/* MESSAGES AREA */}
      <div className="h-[360px] overflow-y-auto p-5 bg-slate-50/50 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-5">
            <MessageSquare className="w-9 h-9 text-slate-300 mb-3" />
            <h3 className="text-sm text-slate-500 mb-6">Ask anything about {clientName}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(text)}
                  className="text-[13px] text-slate-700 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-left hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 sm:mt-0 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-blue-50'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-blue-600" /> : <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                </div>
                
                <div className="flex flex-col">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#3b82f6] text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                  }`} style={msg.role === 'user' ? { color: 'white' } : {}}>
                    {msg.role === 'assistant' ? (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: msg.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br/>') 
                        }} 
                      />
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.timestamp && (
                    <span className={`text-[10px] text-slate-400 mt-1.5 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {chatLoading && (
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex gap-2.5 items-end max-w-4xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={chatLoading}
            placeholder={`Ask about ${clientName}...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none min-h-[44px] max-h-[120px] leading-relaxed"
            rows="1"
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || chatLoading}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              inputValue.trim() && !chatLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                : 'bg-slate-100 text-slate-300'
            }`}
          >
            {chatLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #94a3b8;
          display: inline-block;
          margin: 0 1.5px;
          animation: bounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}} />
    </div>
  );
}
