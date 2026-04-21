import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Plus, Users, Bell, Command, ArrowRight, CornerDownLeft, Sparkles, AlertTriangle, FileText, Settings } from 'lucide-react';
import useCommandStore from '../../store/useCommandStore';
import useClients from '../../hooks/useClients';
import { getNumericScore } from '../../utils/scoreHelpers';

const CommandHub = () => {
  const navigate = useNavigate();
  const { isOpen, setOpen, query, setQuery } = useCommandStore();
  const { clients, loading } = useClients();
  const [selectedIndex, setSelectedIndex] = useState(0);
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
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      
      if (!isOpen) return;

      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      }
      if (e.key === 'Enter' && flatItems[selectedIndex]) {
        e.preventDefault();
        const item = flatItems[selectedIndex];
        if (item.action) item.action();
        else if (item.id && !item.action) {
          setOpen(false);
          navigate(`/clients/${item.id}`);
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
          <Command size={20} className="text-blue-500 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search intelligence, commands, or clients..."
            className="flex-1 bg-transparent border-none outline-none text-[18px] font-medium text-white placeholder-white/20"
          />
          <div className="flex gap-1">
             <kbd className="h-6 px-2 rounded-lg bg-white/10 border border-white/5 text-[10px] font-black text-white/40 flex items-center justify-center uppercase tracking-widest">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[480px] overflow-y-auto p-3 no-scrollbar">
           {sections.map((section, sIdx) => {
             const prevItemsCount = sections.slice(0, sIdx).reduce((acc, s) => acc + s.items.length, 0);
             
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
                           isSelected 
                             ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                             : 'bg-transparent text-white/60 hover:bg-white/5'
                         }`}
                       >
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-white/5'}`}>
                            <Icon size={18} className={isSelected ? 'text-white' : 'text-blue-500'} />
                         </div>
                         
                         <div className="flex-1">
                            <p className={`text-[15px] font-black m-0 tracking-tight italic ${isSelected ? 'text-white' : 'text-white/90'}`}>
                              {item.label || item.name}
                            </p>
                            {item.id && (
                              <div className="flex items-center gap-2 mt-0.5">
                                 <div className={`w-1.5 h-1.5 rounded-full ${score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                                 <p className={`text-[11px] font-bold m-0 uppercase tracking-widest ${isSelected ? 'text-white/60' : 'text-white/30'}`}>
                                    Score: {score} • Relationship Insight Ready
                                 </p>
                              </div>
                            )}
                         </div>

                         {item.shortcut && !isSelected && (
                           <kbd className="h-6 px-2 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-white/20 flex items-center justify-center uppercase">
                              {item.shortcut}
                           </kbd>
                         )}
                         
                         {isSelected && (
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
