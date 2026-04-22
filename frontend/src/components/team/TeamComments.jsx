import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Loader2, Clock } from 'lucide-react';
import { teamAPI } from '../../services/api';
import useTeamStore from '../../store/teamStore';
import useAuthStore from '../../store/authStore';
import { formatDaysAgo } from '../../utils/formatters';

const TeamComments = ({ clientId }) => {
  const { isTeamMode, members } = useTeamStore();
  const user = useAuthStore(s => s.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isTeamMode || !clientId) return;
    loadComments();
  }, [clientId, isTeamMode]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data } = await teamAPI.getComments(clientId);
      setComments(data?.data || []);
      // Scroll to bottom
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await teamAPI.addComment(clientId, newComment.trim());
      if (data?.success) {
        setComments(prev => [...prev, data.data]);
        setNewComment('');
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }, 50);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isTeamMode) return null;

  const getGradient = (name) => {
    const char = (name || 'U').charAt(0).toUpperCase();
    if (char <= 'F') return 'from-blue-500 to-blue-700';
    if (char <= 'M') return 'from-violet-500 to-violet-700';
    if (char <= 'S') return 'from-emerald-500 to-emerald-700';
    return 'from-amber-500 to-amber-700';
  };

  return (
    <div className="premium-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
            <MessageSquare size={16} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-[14px] font-black text-slate-900 m-0 tracking-tight">Team Discussion</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider m-0">{comments.length} messages</p>
          </div>
        </div>
      </div>

      {/* Comments Thread */}
      <div 
        ref={scrollRef}
        className="max-h-[360px] overflow-y-auto p-5 space-y-5"
      >
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-slate-300" />
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <MessageSquare size={28} className="text-slate-200 mx-auto" />
            <p className="text-[13px] text-slate-400 font-medium m-0">No comments yet.</p>
            <p className="text-[11px] text-slate-300 font-medium m-0">Start the conversation about this client.</p>
          </div>
        )}

        {comments.map(comment => {
          const author = comment.profiles || {};
          const isOwn = author.id === user?.id;
          const name = author.full_name || author.email || 'Team Member';
          const initial = name.charAt(0).toUpperCase();

          return (
            <div key={comment.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`
                w-8 h-8 rounded-xl bg-gradient-to-br ${getGradient(name)} 
                flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-sm
              `}>
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt={name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  initial
                )}
              </div>

              {/* Bubble */}
              <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold ${isOwn ? 'text-blue-600' : 'text-slate-700'}`}>
                    {isOwn ? 'You' : name}
                  </span>
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock size={8} /> {formatDaysAgo(comment.created_at)}
                  </span>
                </div>
                <div className={`
                  px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium
                  ${isOwn 
                    ? 'bg-blue-600 text-white rounded-tr-md shadow-lg shadow-blue-500/10' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-md'
                  }
                `}>
                  {comment.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a team note..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newComment.trim()}
          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-blue-500/20"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
};

export default TeamComments;
