import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  Phone, 
  Video, 
  Sparkles,
  Calendar,
  DollarSign,
  MoreVertical,
  Plus
} from 'lucide-react';

const ClientDetail = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);

  const client = {
    name: 'Acme Corp',
    company: 'Design Agency',
    status: 'active',
    riskLevel: 'At Risk',
    score: 32,
    lastContact: '9 days ago',
    openInvoices: { count: 1, amount: '$2,450' },
    aiInsight: "Acme Corp hasn't replied in 9 days, has an overdue invoice since Jan 3rd, and their email tone has been noticeably short since last week. Their health score has dropped significantly in the last 14 days."
  };

  const touchpoints = [
    { type: 'email', title: 'Follow-up regarding Q1 project', date: 'Jan 15, 2024', notes: 'Sent follow-up on outstanding invoice. No response yet.', outcome: 'neutral' },
    { type: 'call', title: 'Check-in call', date: 'Jan 08, 2024', notes: 'Brief call with Sarah. She mentioned they are reorganization internal teams.', outcome: 'neutral' },
    { type: 'message', title: 'Slack update', date: 'Jan 03, 2024', notes: 'Quick ping about asset delivery.', outcome: 'positive' },
  ];

  const invoices = [
    { id: '#102', status: 'overdue', amount: '$2,450', dueDate: 'Jan 03, 2024' },
    { id: '#101', status: 'paid', amount: '$4,100', dueDate: 'Dec 03, 2023' },
  ];

  const getRiskStyles = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-relavo-success';
      case 'Needs Attention': return 'bg-yellow-100 text-relavo-warning';
      case 'At Risk': return 'bg-red-100 text-relavo-danger';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#16a34a';
    if (score >= 40) return '#d97706';
    return '#dc2626';
  };

  const IconType = ({ type }) => {
    switch (type) {
      case 'email': return <Mail size={16} />;
      case 'call': return <Phone size={16} />;
      case 'meeting': return <Video size={16} />;
      case 'message': return <MessageSquare size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <button className="flex items-center gap-2 text-relavo-text-muted hover:text-relavo-blue transition-colors text-sm font-medium w-fit">
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-relavo-text-primary">{client.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-blue-50 text-relavo-blue font-bold uppercase tracking-wider">
                  {client.status}
                </span>
              </div>
              <p className="text-relavo-text-secondary font-medium">{client.company}</p>
            </div>
            
            <div className="flex gap-3">
              <button className="btn-outline flex items-center gap-2">
                <Plus size={18} />
                Log Touchpoint
              </button>
              <button 
                onClick={() => setShowEmailModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Sparkles size={18} />
                Draft Email
              </button>
            </div>
          </div>
        </div>

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score Gauge */}
          <div className="card p-6 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-relavo-text-secondary">Health Score</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold text-relavo-text-primary">{client.score}%</h3>
                <span className={`text-[11px] font-bold ${getRiskStyles(client.riskLevel).split(' ')[1]}`}>
                  {client.riskLevel}
                </span>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={getScoreColor(client.score)}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${213.6 * (client.score / 100)} 213.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-relavo-text-primary">
                {client.score}
              </span>
            </div>
          </div>

          <div className="card p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-relavo-text-secondary">
              <Calendar size={18} />
              <p className="text-sm font-medium">Last Contact</p>
            </div>
            <h3 className="text-2xl font-bold text-relavo-text-primary mt-1">{client.lastContact}</h3>
            <p className="text-xs text-relavo-text-muted">Target: once every 7 days</p>
          </div>

          <div className="card p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-relavo-text-secondary">
              <DollarSign size={18} />
              <p className="text-sm font-medium">Open Invoices</p>
            </div>
            <h3 className="text-2xl font-bold text-relavo-text-primary mt-1">{client.openInvoices.count} invoice</h3>
            <p className="text-xs text-relavo-danger font-semibold">{client.openInvoices.amount} overdue</p>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-relavo-blueLight border border-relavo-blue/20 border-l-4 border-l-relavo-blue p-8 rounded-card flex flex-col gap-4">
          <div className="flex items-center gap-2 text-relavo-blue">
            <Sparkles size={20} />
            <h3 className="font-bold">AI Insight</h3>
          </div>
          <p className="text-[15px] leading-relaxed text-relavo-navy font-medium opacity-90">
            "{client.aiInsight}"
          </p>
          <button 
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 text-relavo-blue font-bold text-sm hover:underline w-fit mt-2"
          >
            Draft Re-engagement Email
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Secondary Info Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Touchpoint Timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-relavo-text-primary px-1">Touchpoint history</h2>
            <div className="card divide-y divide-relavo-border">
              {touchpoints.map((t, i) => (
                <div key={i} className="p-6 flex gap-4 hover:bg-relavo-surface transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-lg bg-white border border-relavo-border shadow-sm flex items-center justify-center text-relavo-text-secondary shrink-0 group-hover:bg-relavo-blueLight group-hover:text-relavo-blue transition-colors">
                    <IconType type={t.type} />
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-relavo-text-primary truncate">{t.title}</h4>
                      <span className="text-[11px] font-bold text-relavo-text-muted shrink-0 ml-4 uppercase tracking-wider">{t.date}</span>
                    </div>
                    <p className="text-sm text-relavo-text-secondary leading-relaxed line-clamp-2">
                      {t.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-relavo-text-primary px-1">Recent invoices</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-relavo-surface text-relavo-text-muted text-[11px] font-bold uppercase tracking-wider border-b border-relavo-border">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-relavo-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-relavo-surface transition-colors cursor-pointer">
                      <td className="px-6 py-5 text-sm font-bold text-relavo-text-primary">{inv.id}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${inv.status === 'overdue' ? 'bg-red-50 text-relavo-danger' : 'bg-green-50 text-relavo-success'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-semibold text-relavo-text-secondary">{inv.amount}</td>
                      <td className="px-6 py-5 text-sm font-medium text-relavo-text-muted text-right">{inv.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Draft Email Modal */}
      {showEmailModal && (
        <EmailDraftModal 
          client={client} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}
    </Layout>
  );
};

// ChevronRight for the AI Insight button
const ChevronRight = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const EmailDraftModal = ({ client, onClose }) => {
  const [tone, setTone] = useState('Professional');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-relavo-navy/40 backdrop-blur-sm p-6 overflow-auto">
      <div className="bg-white w-full max-w-[1000px] h-full max-h-[700px] rounded-card shadow-2xl flex overflow-hidden">
        {/* Left Context Panel */}
        <div className="w-[40%] bg-relavo-surface border-r border-relavo-border p-8 flex flex-col gap-8 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-relavo-text-primary">{client.name}</h3>
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit ${client.riskLevel === 'At Risk' ? 'bg-red-100 text-relavo-danger' : 'bg-blue-100 text-relavo-blue'}`}>
              {client.riskLevel}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 pb-6 border-b border-relavo-border">
              <h4 className="text-[11px] font-bold text-relavo-text-muted uppercase tracking-widest">Reason for risk</h4>
              <p className="text-sm font-medium text-relavo-text-primary leading-relaxed italic">
                "9 days since last contact. Overdue invoice for 2 weeks."
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-relavo-text-muted uppercase tracking-widest">Client Context</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-relavo-text-muted uppercase">Health Score</span>
                  <span className="text-xl font-bold text-relavo-danger">{client.score}%</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-relavo-text-muted uppercase">Last Contact</span>
                  <span className="text-sm font-bold text-relavo-text-primary">{client.lastContact}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-relavo-text-muted uppercase tracking-widest">AI Insight Summary</h4>
              <p className="text-xs text-relavo-text-secondary leading-relaxed bg-white border border-relavo-border p-4 rounded-lg shadow-sm">
                The client relationship has seen a significant drift in responsiveness coinciding with reorganization news.
              </p>
            </div>
          </div>
          
          <div className="mt-auto">
             <button onClick={onClose} className="text-sm font-bold text-relavo-text-muted hover:text-relavo-navy transition-colors">
              Close Preview
            </button>
          </div>
        </div>

        {/* Right Editing Panel */}
        <div className="w-[60%] flex flex-col pt-8">
          <div className="px-8 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-relavo-blue">
              <Sparkles size={20} />
              <h3 className="font-bold">AI-generated email</h3>
            </div>
            
            <div className="flex bg-relavo-surface p-1 rounded-lg border border-relavo-border">
              {['Warm', 'Professional', 'Direct'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${tone === t ? 'bg-white text-relavo-blue shadow-sm' : 'text-relavo-text-muted hover:text-relavo-text-primary'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-8 space-y-4 overflow-y-auto pb-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-relavo-text-muted uppercase tracking-widest ml-1">Subject Line</label>
              <input 
                type="text" 
                defaultValue={`Checking in — ${client.name} & Relavo team`}
                className="input-field font-semibold text-relavo-navy"
              />
            </div>
            
            <div className="flex-1 flex flex-col space-y-1.5 min-h-[300px]">
              <label className="text-[10px] font-bold text-relavo-text-muted uppercase tracking-widest ml-1">Message Body</label>
              <textarea 
                className="input-field flex-1 resize-none font-medium leading-relaxed text-sm p-4 text-relavo-navy"
                defaultValue={`Hi Sarah,\n\nI hope your week is off to a good start.\n\nI'm reaching out as I haven't heard from you in a bit and wanted to ensure everything is on track with your Q1 project. I also noticed that Invoice #102 is now slightly overdue — would you mind taking a look at that when you have a moment?\n\nIf the internal reorganization is keeping your team extra busy, please let me know how I can best support you during this transition. I'd love to hop on a quick 10-minute sync if that helps simplify things.\n\nBest regards,\n\nJohn Doe`}
              />
            </div>
          </div>

          <div className="p-8 border-t border-relavo-border bg-relavo-surface flex items-center justify-between">
            <button className="btn-outline text-sm">Regenerate</button>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="btn-primary"
              >
                Copy Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
