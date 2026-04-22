import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Crown, Shield, Eye, Trash2, Building2, Loader2, Check, Copy } from 'lucide-react';
import useTeam from '../../hooks/useTeam';
import useAuthStore from '../../store/authStore';
import InviteMemberModal from './InviteMemberModal';
import Button from '../ui/Button';

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
};

const roleColors = {
  owner:  'bg-amber-50 text-amber-700 border-amber-100',
  admin:  'bg-blue-50 text-blue-700 border-blue-100',
  member: 'bg-slate-50 text-slate-600 border-slate-100',
  viewer: 'bg-slate-50 text-slate-400 border-slate-100',
};

const TeamSettingsPanel = () => {
  const user = useAuthStore(s => s.user);
  const { agency, members, userRole, isTeamMode, loading, fetchTeam, createTeam, inviteMember, updateRole, removeMember } = useTeam();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    setCreating(true);
    try {
      await createTeam(teamName.trim());
    } catch (err) {
      // handled by hook
    } finally {
      setCreating(false);
    }
  };

  const isAdmin = ['owner', 'admin'].includes(userRole);

  // ─── No Team Yet ───────────────────────────────
  if (!isTeamMode) {
    return (
      <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="mb-10">
          <h3 className="text-[20px] font-bold text-slate-900 m-0">Team Workspace</h3>
          <p className="text-slate-500 text-[14px] mt-1">
            Create a shared workspace to collaborate with your team on client relationships
          </p>
        </div>

        {/* Create Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[28px] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <Building2 size={26} className="text-blue-400" />
              </div>
              <h4 className="text-[22px] font-black m-0 tracking-tight">Launch Your Workspace</h4>
              <p className="text-white/50 text-[14px] m-0 font-medium max-w-[400px] leading-relaxed">
                Create a team workspace to share clients, activity, and AI insights with your colleagues. All your existing clients will be automatically shared.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Relavo Agency"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50 transition-all font-medium"
              />
              <button
                onClick={handleCreate}
                disabled={creating || !teamName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
              >
                {creating ? <Loader2 size={16} className="animate-spin" /> : <><Building2 size={16} /> Create Workspace</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Team Exists ───────────────────────────────
  return (
    <div className="max-w-[600px] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[20px] font-bold text-slate-900 m-0">Team Workspace</h3>
          <p className="text-slate-500 text-[14px] mt-1">Manage your {agency?.name} workspace</p>
        </div>
        {isAdmin && (
          <Button 
            variant="primary" 
            icon={UserPlus} 
            onClick={() => setShowInviteModal(true)}
            className="!h-10 !px-5 !text-[10px]"
          >
            Invite
          </Button>
        )}
      </div>

      {/* Workspace Info Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[20px] font-black shadow-lg shadow-blue-500/20">
          {agency?.name?.charAt(0)?.toUpperCase() || 'T'}
        </div>
        <div className="flex-1">
          <h4 className="text-[16px] font-black text-slate-900 m-0">{agency?.name}</h4>
          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider m-0 mt-0.5">
            {members.length} {members.length === 1 ? 'member' : 'members'} • Your role: <span className="text-blue-600 capitalize">{userRole}</span>
          </p>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1 mb-3">
          Team Members
        </p>

        {members.map(member => {
          const u = member.user || {};
          const name = u.full_name || u.email || 'Unknown';
          const initial = name.charAt(0).toUpperCase();
          const RoleIcon = roleIcons[member.role] || Users;
          const isCurrentUser = u.id === user?.id;

          return (
            <div key={member.id} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl group hover:border-slate-200 hover:shadow-sm transition-all">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[12px] font-black shadow-sm shrink-0">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={name} className="w-full h-full rounded-xl object-cover" />
                ) : initial}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-slate-900 truncate">{name}</span>
                  {isCurrentUser && (
                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">You</span>
                  )}
                </div>
                <span className="text-[12px] text-slate-400 font-medium truncate block">{u.email}</span>
              </div>

              {/* Role Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${roleColors[member.role]}`}>
                <RoleIcon size={12} />
                {member.role}
              </div>

              {/* Actions */}
              {isAdmin && !isCurrentUser && member.role !== 'owner' && (
                <button
                  onClick={() => removeMember(member.id)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 border-none cursor-pointer bg-transparent"
                  title="Remove member"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={inviteMember}
      />
    </div>
  );
};

export default TeamSettingsPanel;
