import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import useTeamStore from '../../store/teamStore';

const TeamPresence = ({ compact = false }) => {
  const { members, isTeamMode, agency } = useTeamStore();

  if (!isTeamMode) {
    return (
      <Link 
        to="/settings" 
        state={{ tab: 'Team' }}
        className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all group no-underline"
      >
        <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <Users size={12} className="text-slate-500 group-hover:text-white transition-colors" />
        </div>
        <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest transition-colors">Setup Team</span>
      </Link>
    );
  }

  if (!members.length) return null;

  const visibleMembers = compact ? members.slice(0, 4) : members.slice(0, 6);
  const extraCount = members.length - visibleMembers.length;

  const getGradient = (name) => {
    const char = (name || 'U').charAt(0).toUpperCase();
    if (char <= 'F') return 'from-blue-500 to-blue-700';
    if (char <= 'M') return 'from-violet-500 to-violet-700';
    if (char <= 'S') return 'from-emerald-500 to-emerald-700';
    return 'from-amber-500 to-amber-700';
  };

  return (
    <div className="flex items-center gap-3">
      {!compact && (
        <div className="flex items-center gap-2 mr-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none pt-0.5">
            Team
          </span>
        </div>
      )}
      
      <div className="flex -space-x-2.5">
        {visibleMembers.map((member, i) => {
          const user = member.user || {};
          const name = user.full_name || user.email || 'U';
          const initial = name.charAt(0).toUpperCase();

          return (
            <div
              key={member.id || i}
              className={`
                relative group
                ${compact ? 'w-8 h-8' : 'w-9 h-9'}
                rounded-xl bg-gradient-to-br ${getGradient(name)}
                flex items-center justify-center text-white
                ${compact ? 'text-[10px]' : 'text-[11px]'} font-black
                ring-2 ring-white shadow-md
                cursor-default
                hover:scale-110 hover:z-10 hover:-translate-y-0.5
                transition-all duration-200
              `}
              style={{ zIndex: visibleMembers.length - i }}
            >
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={name} 
                  className="w-full h-full rounded-xl object-cover" 
                />
              ) : (
                initial
              )}

              {/* Online indicator dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />

              {/* Hover tooltip */}
              <div className="
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5
                bg-slate-900 text-white text-[10px] font-bold
                px-3 py-1.5 rounded-lg whitespace-nowrap
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-200
                shadow-xl
              ">
                {name}
                <span className="text-slate-400 ml-1.5 capitalize">• {member.role}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          );
        })}

        {extraCount > 0 && (
          <div className={`
            ${compact ? 'w-8 h-8' : 'w-9 h-9'}
            rounded-xl bg-slate-100 border-2 border-white
            flex items-center justify-center
            ${compact ? 'text-[9px]' : 'text-[10px]'} font-black text-slate-500
            shadow-sm
          `}>
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPresence;
