import React, { useState } from 'react';
import { X, Mail, Shield, UserPlus, Loader2, ChevronDown } from 'lucide-react';

const roles = [
  { value: 'member', label: 'Member', desc: 'Can view all clients, log touchpoints, and add comments' },
  { value: 'admin', label: 'Admin', desc: 'Full access plus member management and settings' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access to the dashboard and client data' },
];

const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [showRoles, setShowRoles] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await onInvite(email.trim(), role);
      setEmail('');
      setRole('member');
      onClose();
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[28px] w-full max-w-[480px] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 pb-10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute -left-4 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-lg" />
          
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all border-none cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10">
              <UserPlus size={22} className="text-white" />
            </div>
            <h2 className="text-[22px] font-black text-white m-0 tracking-tight">Invite Teammate</h2>
            <p className="text-[13px] text-white/60 mt-1 m-0 font-medium">Add a new member to your workspace</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="input-base !pl-12"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 px-1 font-medium">
              They must have a Relavo account. If not, they'll need to sign up first.
            </p>
          </div>

          {/* Role Selector */}
          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5 block">
              Access Level
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoles(!showRoles)}
                className="w-full input-base flex items-center justify-between cursor-pointer !bg-white border border-slate-200 hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-blue-500" />
                  <span className="font-bold text-slate-900">{selectedRole?.label}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${showRoles ? 'rotate-180' : ''}`} />
              </button>

              {showRoles && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-10">
                  {roles.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => { setRole(r.value); setShowRoles(false); }}
                      className={`w-full text-left px-5 py-3.5 flex flex-col gap-0.5 transition-colors border-none cursor-pointer ${
                        role === r.value ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-[13px] font-bold ${role === r.value ? 'text-blue-600' : 'text-slate-900'}`}>
                        {r.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{r.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full btn-primary !h-12 !rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={16} />
                Send Invitation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;
