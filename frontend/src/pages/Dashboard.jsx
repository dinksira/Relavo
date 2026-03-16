import React from 'react';
import Layout from '../components/Layout';
import { 
  Users, 
  Smile, 
  AlertCircle, 
  Zap,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    { label: 'Total Clients', value: '24', icon: Users, color: 'text-relavo-navy' },
    { label: 'Healthy', value: '18', icon: Smile, color: 'text-relavo-success' },
    { label: 'Needs Attention', value: '4', icon: AlertCircle, color: 'text-relavo-warning' },
    { label: 'At Risk', value: '2', icon: Zap, color: 'text-relavo-danger' },
  ];

  const clients = [
    { name: 'Acme Corp', company: 'Design Agency', score: 32, status: 'At Risk' },
    { name: 'Globex Inc', company: 'SaaS Startup', score: 65, status: 'Needs Attention' },
    { name: 'Soylent Corp', company: 'Tech Consulting', score: 88, status: 'Healthy' },
    { name: 'Initech', company: 'Software Dev', score: 92, status: 'Healthy' },
    { name: 'Umbrella Corp', company: 'Pharma', score: 45, status: 'Needs Attention' },
  ];

  const alerts = [
    { client: 'Acme Corp', message: 'Invoice #102 is 5 days overdue', time: '2h ago', severity: 'high' },
    { client: 'Globex Inc', message: 'No contact in more than 7 days', time: '5h ago', severity: 'medium' },
    { client: 'Umbrella Corp', message: 'Score dropped 18 points in 24h', time: '1d ago', severity: 'medium' },
    { client: 'Initech', message: 'Positive sentiment detected in recent email', time: '2d ago', severity: 'low' },
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
    if (score >= 70) return 'bg-relavo-success';
    if (score >= 40) return 'bg-relavo-warning';
    return 'bg-relavo-danger';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-relavo-danger';
      case 'medium': return 'border-relavo-warning';
      case 'low': return 'border-relavo-blue';
      default: return 'border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-bold text-relavo-text-primary">Dashboard</h1>
          <p className="text-relavo-text-secondary mt-1">Welcome back, John. Here's what needs your attention today.</p>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <div key={m.label} className="card p-6 relative">
              <span className={`absolute top-4 right-4 ${m.color}`}>
                <m.icon size={20} />
              </span>
              <p className="text-sm font-medium text-relavo-text-secondary">{m.label}</p>
              <h3 className="text-3xl font-bold text-relavo-text-primary mt-2">{m.value}</h3>
            </div>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client Health List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-relavo-text-primary px-1">Client health overview</h2>
            <div className="card divide-y divide-relavo-border">
              {clients.map((c) => (
                <div key={c.name} className="flex items-center gap-4 p-5 hover:bg-relavo-surface transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-relavo-blue flex items-center justify-center font-bold text-sm shrink-0">
                    {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0) || ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-relavo-text-primary truncate">{c.name}</h4>
                    <p className="text-xs text-relavo-text-secondary truncate">{c.company}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 w-32 shrink-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-relavo-text-muted uppercase">
                      <span>Health</span>
                      <span>{c.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-relavo-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreColor(c.score)} rounded-full`} 
                        style={{ width: `${c.score}%` }} 
                      />
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase shrink-0 ${getRiskStyles(c.status)}`}>
                    {c.status}
                  </div>
                  <button className="text-relavo-text-muted group-hover:text-relavo-blue transition-colors ml-2">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Alerts Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-relavo-text-primary">Smart alerts</h2>
              <span className="bg-relavo-blue text-white text-[11px] font-bold px-2 py-0.5 rounded-full">4</span>
            </div>
            <div className="flex flex-col gap-4">
              {alerts.map((a, i) => (
                <div key={i} className={`card border-l-4 ${getSeverityColor(a.severity)} p-5 flex flex-col gap-3 transition-transform hover:translate-x-1 cursor-pointer`}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-relavo-text-primary">{a.client}</h4>
                    <span className="text-[10px] text-relavo-text-muted font-medium">{a.time}</span>
                  </div>
                  <p className="text-sm text-relavo-text-secondary leading-relaxed">{a.message}</p>
                  <div className="flex justify-end pt-1">
                    <button className="text-[11px] font-bold text-relavo-text-muted hover:text-relavo-blue uppercase tracking-wider transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
