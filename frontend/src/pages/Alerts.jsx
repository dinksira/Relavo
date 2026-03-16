import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle, 
  Trash2,
  AlertCircle,
  Zap,
  Info,
  Sparkles
} from 'lucide-react';

const Alerts = () => {
  const [filter, setFilter] = useState('All');

  const allAlerts = [
    { id: 1, client: 'Acme Corp', type: 'overdue_invoice', severity: 'high', message: 'Invoice #102 is 5 days overdue.', suggestion: 'Send a gentle reminder email or log a check-in call.', time: '2h ago', read: false },
    { id: 2, client: 'Globex Inc', type: 'no_contact', severity: 'medium', message: 'No contact in more than 7 days.', suggestion: 'Schedule a quick status sync or send a "thinking of you" message.', time: '5h ago', read: false },
    { id: 3, client: 'Umbrella Corp', type: 'score_drop', severity: 'medium', message: 'Score dropped 18 points in 24h.', suggestion: 'Investigation needed: check recent activity or sentiment trends.', time: '1d ago', read: true },
    { id: 4, client: 'Initech', type: 'sentiment', severity: 'low', message: 'Positive sentiment detected in recent email.', suggestion: 'Good time to ask for a referral or testimonial.', time: '2d ago', read: true },
    { id: 5, client: 'Soylent Corp', type: 'overdue_invoice', severity: 'high', message: 'Invoice #098 is 12 days overdue!', suggestion: 'Urgent: escalate to account manager for immediate follow-up.', time: '3d ago', read: false },
  ];

  const filteredAlerts = allAlerts.filter(a => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !a.read;
    return a.severity.toLowerCase() === filter.toLowerCase();
  });

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'high': return 'border-relavo-danger text-relavo-danger bg-red-50';
      case 'medium': return 'border-relavo-warning text-relavo-warning bg-yellow-50';
      case 'low': return 'border-relavo-blue text-relavo-blue bg-blue-50';
      default: return 'border-gray-200 text-gray-500 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <Zap size={18} />;
      case 'medium': return <AlertCircle size={18} />;
      case 'low': return <Info size={18} />;
      default: return <Bell size={18} />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-relavo-text-primary">Smart Alerts</h1>
            <p className="text-sm text-relavo-text-secondary">Manage and respond to AI-detected relationship signals.</p>
          </div>
          <button className="text-sm font-bold text-relavo-blue hover:underline">Mark all as read</button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex bg-white p-1 rounded-lg border border-relavo-border shadow-sm">
            {['All', 'Unread', 'High', 'Medium', 'Low'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-relavo-blue text-white shadow-md' : 'text-relavo-text-muted hover:text-relavo-text-primary'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-relavo-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              className="pl-10 pr-4 py-2 bg-white border border-relavo-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-relavo-blue/10 w-64"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((a) => (
              <div key={a.id} className={`card p-6 flex flex-col gap-6 relative transition-all hover:shadow-md ${!a.read ? 'border-l-4' : 'opacity-80 scale-[0.99]'} ${!a.read ? (a.severity === 'high' ? 'border-l-relavo-danger' : a.severity === 'medium' ? 'border-l-relavo-warning' : 'border-l-relavo-blue') : 'border-l-transparent'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getSeverityStyles(a.severity)}`}>
                      {getSeverityIcon(a.severity)}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-relavo-text-primary">
                        {a.client} <span className="text-relavo-text-muted font-normal mx-1">·</span> <span className="text-xs text-relavo-text-secondary">{a.message}</span>
                      </h3>
                      <p className="text-xs text-relavo-text-muted font-medium mt-0.5">{a.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!a.read && (
                      <button className="p-2 text-relavo-text-muted hover:text-relavo-success transition-colors" title="Mark as read">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button className="p-2 text-relavo-text-muted hover:text-relavo-danger transition-colors" title="Dismiss">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-relavo-surface rounded-lg p-4 flex items-center justify-between border border-relavo-border/50">
                  <div className="flex items-center gap-3">
                    <div className="text-relavo-blue">
                      <Sparkles size={16} />
                    </div>
                    <p className="text-sm font-medium text-relavo-text-primary italic">
                      AI Suggestion: <span className="text-relavo-text-secondary not-italic font-normal">{a.suggestion}</span>
                    </p>
                  </div>
                  <button className="text-[11px] font-bold text-relavo-blue uppercase tracking-wider hover:underline shrink-0 ml-4">
                    Take Action
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="card py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-relavo-surface rounded-full flex items-center justify-center text-relavo-text-muted mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-lg font-bold text-relavo-text-primary">All caught up!</h3>
              <p className="text-sm text-relavo-text-secondary mt-1">No {filter !== 'All' ? filter.toLowerCase() : ''} alerts found at the moment.</p>
              {filter !== 'All' && (
                <button 
                  onClick={() => setFilter('All')}
                  className="mt-4 text-sm font-bold text-relavo-blue hover:underline"
                >
                  View all alerts
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Alerts;
