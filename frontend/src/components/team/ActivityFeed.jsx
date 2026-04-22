import React, { useEffect } from 'react';
import { 
  UserPlus, MessageSquare, Phone, FileText, AlertTriangle, 
  TrendingDown, Mail, Zap, Clock, Users
} from 'lucide-react';
import useTeam from '../../hooks/useTeam';
import { formatDaysAgo } from '../../utils/formatters';

const actionConfig = {
  client_added:      { icon: UserPlus,       color: 'bg-blue-100 text-blue-600',    verb: 'added a new client' },
  touchpoint_logged: { icon: Phone,          color: 'bg-emerald-100 text-emerald-600', verb: 'logged a touchpoint for' },
  comment_added:     { icon: MessageSquare,  color: 'bg-violet-100 text-violet-600',  verb: 'commented on' },
  invoice_created:   { icon: FileText,       color: 'bg-amber-100 text-amber-600',   verb: 'created an invoice for' },
  score_drop:        { icon: TrendingDown,   color: 'bg-rose-100 text-rose-600',     verb: 'flagged a score drop for' },
  member_invited:    { icon: Users,          color: 'bg-indigo-100 text-indigo-600', verb: 'invited' },
  email_sent:        { icon: Mail,           color: 'bg-sky-100 text-sky-600',       verb: 'sent an email to' },
};

const defaultConfig = { icon: Zap, color: 'bg-slate-100 text-slate-600', verb: 'performed an action on' };

const ActivityItem = ({ activity }) => {
  const config = actionConfig[activity.action] || defaultConfig;
  const Icon = config.icon;
  const user = activity.profiles || {};
  const meta = activity.metadata || {};
  const name = user.full_name || user.email || 'Someone';
  const initial = name.charAt(0).toUpperCase();

  const getTarget = () => {
    if (activity.action === 'member_invited') {
      return meta.invited_name || meta.invited_email || '';
    }
    return meta.client_name || '';
  };

  const getDetail = () => {
    if (activity.action === 'touchpoint_logged') {
      return meta.touchpoint_type ? ` (${meta.touchpoint_type})` : '';
    }
    if (activity.action === 'comment_added' && meta.preview) {
      return `: "${meta.preview}${meta.preview.length >= 80 ? '...' : ''}"`;
    }
    return '';
  };

  return (
    <div className="flex gap-4 py-4 group hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors">
      {/* User Avatar */}
      <div className="shrink-0 relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-[11px] font-black shadow-sm">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={name} className="w-full h-full rounded-xl object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-lg ${config.color.split(' ')[0]} flex items-center justify-center`}>
          <Icon size={10} className={config.color.split(' ')[1]} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-slate-700 m-0 leading-relaxed">
          <span className="font-bold text-slate-900">{name}</span>
          {' '}{config.verb}{' '}
          {getTarget() && <span className="font-bold text-blue-600">{getTarget()}</span>}
          <span className="text-slate-400 italic">{getDetail()}</span>
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <Clock size={10} className="text-slate-300" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {formatDaysAgo(activity.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

const ActivityFeed = ({ limit = 10 }) => {
  const { activities, isTeamMode, fetchActivity } = useTeam();

  useEffect(() => {
    if (isTeamMode) {
      fetchActivity();
    }
  }, [isTeamMode]);

  if (!isTeamMode) return null;

  const displayActivities = (activities || []).slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <div className="premium-card p-12 text-center space-y-3">
        <div className="w-14 h-14 bg-slate-50 rounded-[20px] flex items-center justify-center mx-auto">
          <Zap size={24} className="text-slate-300" />
        </div>
        <h4 className="text-[15px] font-black text-slate-900 m-0">No team activity yet</h4>
        <p className="text-[13px] text-slate-400 m-0 font-medium">
          Actions from your team will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 overflow-hidden">
      <div className="divide-y divide-slate-50">
        {displayActivities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
