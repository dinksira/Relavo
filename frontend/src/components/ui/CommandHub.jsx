import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Plus, Users, Bell, Command, ArrowRight, CornerDownLeft, Sparkles, AlertTriangle, FileText, Settings } from 'lucide-react';
import useCommandStore from '../../store/useCommandStore';
import { clientsAPI, aiAPI } from '../../services/api';
import { getNumericScore } from '../../utils/scoreHelpers';
import useClients from '../../hooks/useClients';
import useToast from '../../hooks/useToast';

const CommandHub = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, setOpen, query, setQuery } = useCommandStore();
  const { clients, loading: clientsLoading } = useClients();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const inputRef = useRef(null);

  const staticActions = [
    { id: 'add-client', label: 'Onboard New Client', icon: Plus, shortcut: 'A', action: () => { setOpen(false); /* trigger modal */ } },
    { id: 'view-alerts', label: 'View Intelligence Stream', icon: Bell, shortcut: 'I', action: () => { setOpen(false); navigate('/alerts'); } },
    { id: 'view-clients', label: 'Open Client Directory', icon: Users, shortcut: 'D', action: () => { setOpen(false); navigate('/clients'); } },
    { id: 'settings', label: 'System Configuration', icon: Settings, shortcut: 'S', action: () => { setOpen(false); navigate('/settings'); } },
  ];

  const filteredClients = query.trim() 
    ? (clients || []).filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const sections = [
    ...(filteredClients.length > 0 ? [{ title: 'Suggested Clients', type: 'clients', items: filteredClients }] : []),
    { title: 'System Protocols', type: 'actions', items: staticActions },
  ];

  const flatItems = sections.flatMap(s => s.items);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setQuery('');
      setAiResponse(null);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleInterpretation = async (currentQuery) => {
      if (!currentQuery.trim() || isThinking) return;
      
      setIsThinking(true);
      setAiResponse(null);
      try {
        const res = await aiAPI.interpretCommand(currentQuery, (clients || []).map(c => ({ id: c.id, name: c.name })));
        const { action, params, response } = res.data?.data || res.data || {};
        
        console.log('AI Logic Decoupled:', action, params);

        if (response) {
          setAiResponse(response);
        }

        if (action === 'navigate_to') {
          navigate(`/${params.target}`);
          setOpen(false);
        } else if (action === 'open_client' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
        } else if (action === 'draft_email' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
          // Wait for navigation then trigger drafing event/state
          setTimeout(() => window.dispatchEvent(new CustomEvent('relavo:draft:open')), 500);
        } else if (action === 'get_briefing' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
          setTimeout(() => window.dispatchEvent(new CustomEvent('relavo:briefing:open')), 500);
        } else if (action === 'log_touchpoint' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
          setTimeout(() => window.dispatchEvent(new CustomEvent('relavo:touchpoint:open')), 500);
        } else if (action === 'show_invoices' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
          // Potential event to scroll to invoices
          setTimeout(() => {
             const el = document.getElementById('billing-section');
             if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        } else if (action === 'recalculate_score' && params.client_id) {
          navigate(`/clients/${params.client_id}`);
          setOpen(false);
          // Trigger recalculation event
          setTimeout(() => window.dispatchEvent(new CustomEvent('relavo:score:recalculate')), 500);
        } else {
          // Fallback to searching if AI isn't sure
          console.warn('AI Brain returned ambiguous action:', action);
          if (!response) toast.info('AI is refining your request based on current intelligence.');
        }
      } catch (err) {
        console.error('AI Command Interpretation Error:', err);
        toast.error('Intelligence Engine timed out. Please try again.');
      } finally {
        setIsThinking(false);
      }
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      
      if (!isOpen) return;

      if (e.key === 'Escape') setOpen(false);
      
      const itemCount = flatItems.length + (query.trim() ? 1 : 0);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % itemCount);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + itemCount) % itemCount);
      }
      
      if (e.key === 'Enter') {
        e.preventDefault();
        
        // If "Ask AI Brain" is selected (it's the first item when typing)
        if (query.trim() && selectedIndex === 0) {
          handleInterpretation(query);
          return;
        }

        const effectiveIndex = query.trim() ? selectedIndex - 1 : selectedIndex;
        const item = flatItems[effectiveIndex];
        
        if (item) {
          if (item.action) item.action();
          else if (item.id && !item.action) {
            setOpen(false);
            navigate(`/clients/${item.id}`);
          }
        } else if (query.trim()) {
           handleInterpretation(query);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flatItems, navigate, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setOpen(false)}
      />
      
      {/* Search Modal */}
      <div className="relative w-full max-w-[720px] bg-[#0f172a] rounded-[32px] shadow-[0_48px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="bg-white/5 p-6 border-b border-white/5 flex items-center gap-4">
          {isThinking ? (
            <Sparkles size={20} className="text-blue-500 animate-spin" />
          ) : (
            <Command size={20} className="text-blue-400" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={isThinking ? "Intelligence Engine processing..." : "Search intelligence, commands, or clients..."}
            className={`flex-1 bg-transparent border-none outline-none text-[18px] font-medium text-white placeholder-white/20 ${isThinking ? 'opacity-50' : ''}`}
            disabled={isThinking}
          />
          <div className="flex gap-1">
             <kbd className="h-6 px-2 rounded-lg bg-white/10 border border-white/5 text-[10px] font-black text-white/40 flex items-center justify-center uppercase tracking-widest italic">{isThinking ? 'THINKING' : 'READY'}</kbd>
          </div>
        </div>

        <div className="max-h-[480px] overflow-y-auto p-3 no-scrollbar relative">
           {/* AI RESPONSE BUBBLE */}
           {aiResponse && (
             <div className="mb-4 px-4 py-6 bg-blue-600/10 border border-blue-500/20 rounded-[24px] animate-in slide-in-from-top-2 duration-300">
                <div className="flex gap-4 items-start">
                   <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                      <Sparkles size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">AI Intelligence Insight</p>
                      <p className="text-[16px] font-medium text-white leading-relaxed italic m-0">"{aiResponse}"</p>
                   </div>
                </div>
             </div>
           )}

           {/* AI BRAIN SUGGESTION BOX */}
           {query.trim() && (
             <div className="mb-4">
                <p className="px-4 py-2 text-[10px] font-black text-blue-500/40 uppercase tracking-[0.2em] mb-1">
                   Autonomous Action
                </p>
                <button
                  onClick={() => handleInterpretation(query)}
                  onMouseEnter={() => setSelectedIndex(0)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all border-none text-left cursor-pointer group ${
                    selectedIndex === 0 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedIndex === 0 ? 'bg-white/20' : 'bg-blue-500/10'}`}>
                     <Sparkles size={18} className={selectedIndex === 0 ? 'text-white' : 'text-blue-500'} />
                  </div>
                  <div className="flex-1">
                     <p className={`text-[15px] font-black m-0 tracking-tight italic ${selectedIndex === 0 ? 'text-white' : 'text-white/90'}`}>
                        Ask Relavo AI: <span className={selectedIndex === 0 ? 'text-blue-100' : 'text-blue-400'}>"{query}"</span>
                     </p>
                     <p className={`text-[11px] font-bold m-0 uppercase tracking-widest mt-0.5 ${selectedIndex === 0 ? 'text-white/60' : 'text-white/20'}`}>
                        Executes natural language commands via AI Brain
                     </p>
                  </div>
                  {selectedIndex === 0 && <CornerDownLeft size={16} className="text-white/40" />}
                </button>
             </div>
           )}

           {sections.map((section, sIdx) => {
             const baseIdx = query.trim() ? 1 : 0;
             const prevItemsCount = baseIdx + sections.slice(0, sIdx).reduce((acc, s) => acc + s.items.length, 0);
             
             return (
               <div key={section.title} className="mb-4 last:mb-2">
                 <p className="px-4 py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                   {section.title}
                 </p>
                 
                 <div className="space-y-1">
                   {section.items.map((item, iIdx) => {
                     const isSelected = selectedIndex === prevItemsCount + iIdx;
                     const Icon = item.icon || Users;
                     const score = item.id ? getNumericScore(item) : null;
                     
                     return (
                       <button
                         key={item.id}
                         onClick={() => {
                           if (item.action) item.action();
                           else { setOpen(false); navigate(`/clients/${item.id}`); }
                         }}
                         onMouseEnter={() => setSelectedIndex(prevItemsCount + iIdx)}
                         className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all border-none text-left cursor-pointer ${
                           selectedIndex === prevItemsCount + iIdx 
                             ? 'bg-white/10 text-white shadow-xl' 
                             : 'bg-transparent text-white/60 hover:bg-white/5'
                         }`}
                       >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedIndex === prevItemsCount + iIdx ? 'bg-blue-600' : 'bg-white/5'}`}>
                            <Icon size={18} className={selectedIndex === prevItemsCount + iIdx ? 'text-white' : 'text-blue-500'} />
                         </div>
                         
                         <div className="flex-1">
                            <p className={`text-[15px] font-black m-0 tracking-tight italic ${selectedIndex === prevItemsCount + iIdx ? 'text-white' : 'text-white/90'}`}>
                              {item.label || item.name}
                            </p>
                            {item.id && (
                              <div className="flex items-center gap-2 mt-0.5">
                                 <div className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                                 <p className={`text-[11px] font-bold m-0 uppercase tracking-widest ${selectedIndex === prevItemsCount + iIdx ? 'text-white/60' : 'text-white/20'}`}>
                                    Score: {score} • Relationship Insight Ready
                                 </p>
                              </div>
                            )}
                         </div>

                         {item.shortcut && selectedIndex !== prevItemsCount + iIdx && (
                           <kbd className="h-6 px-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-white/20 flex items-center justify-center uppercase">
                              {item.shortcut}
                           </kbd>
                         )}
                         
                         {selectedIndex === prevItemsCount + iIdx && (
                           <CornerDownLeft size={16} className="text-white/40" />
                         )}
                       </button>
                     );
                   })}
                 </div>
               </div>
             );
           })}

           {flatItems.length === 0 && (
             <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/5">
                   <Sparkles size={24} className="text-blue-500" />
                </div>
                <div>
                   <p className="text-[16px] font-black text-white m-0 tracking-tight italic">No direct matches found.</p>
                   <p className="text-[13px] text-white/30 font-medium mt-1">Try searching for a client name or system protocol.</p>
                </div>
             </div>
           )}
        </div>

        <div className="bg-white/5 p-4 border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <kbd className="h-5 px-1.5 rounded-md bg-white/10 text-[9px] font-black text-white/40 flex items-center justify-center border border-white/5">↑↓</kbd>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                 <kbd className="h-5 px-1.5 rounded-md bg-white/10 text-[9px] font-black text-white/40 flex items-center justify-center border border-white/5">ENTER</kbd>
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Zap size={12} className="text-blue-500" />
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Relavo Intelligence Core</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommandHub;
