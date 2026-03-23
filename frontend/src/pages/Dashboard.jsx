import React from 'react';
import Layout from '../components/Layout';
import { 
  Users, 
  Smile, 
  AlertCircle, 
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const metrics = [
    { label: 'Total Clients', value: '24', icon: Users, color: 'text-navy', bg: 'bg-slate-50', path: '/clients' },
    { label: 'Healthy', value: '18', icon: Smile, color: 'text-relavo-success', bg: 'bg-green-50', path: '/clients' },
    { label: 'Needs Attention', value: '4', icon: AlertCircle, color: 'text-relavo-warning', bg: 'bg-amber-50', path: '/alerts' },
    { label: 'At Risk', value: '2', icon: Zap, color: 'text-relavo-danger', bg: 'bg-red-50', path: '/alerts' },
  ];

  const clients = [
    { id: 1, name: 'Acme Corp', company: 'Design Agency', score: 32, status: 'At Risk', initials: 'AC' },
    { id: 2, name: 'Globex Inc', company: 'SaaS Startup', score: 65, status: 'Needs Attention', initials: 'GI' },
    { id: 3, name: 'Soylent Corp', company: 'Tech Consulting', score: 88, status: 'Healthy', initials: 'SC' },
    { id: 4, name: 'Initech', company: 'Software Dev', score: 92, status: 'Healthy', initials: 'IN' },
    { id: 5, name: 'Umbrella Corp', company: 'Pharma', score: 45, status: 'Needs Attention', initials: 'UC' },
  ];

  const alerts = [
    { client: 'Acme Corp', message: 'Invoice #102 is 5 days overdue', time: '2h ago', severity: 'high' },
    { client: 'Globex Inc', message: 'No contact in more than 7 days', time: '5h ago', severity: 'medium' },
    { client: 'Umbrella Corp', message: 'Score dropped 18 points in 24h', time: '1d ago', severity: 'medium' },
  ];

  const getRiskBadge = (status) => {
    switch (status) {
      case 'Healthy': return 'bg-relavo-success/10 text-relavo-success';
      case 'Needs Attention': return 'bg-relavo-warning/10 text-relavo-warning';
      case 'At Risk': return 'bg-relavo-danger/10 text-relavo-danger';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-relavo-success';
    if (score >= 40) return 'bg-relavo-warning';
    return 'bg-relavo-danger';
  };

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-navy tracking-tight">Dashboard Overview</h1>
            <p className="text-text-2 font-medium">Monitoring relationship pulses across <span className="text-navy font-bold">24 active accounts.</span></p>
          </div>
          <button className="btn-primary py-2.5 px-6 text-sm">
            <Sparkles size={16} /> Generate Weekly Digest
          </button>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => (
            <Link key={m.label} to={m.path} className="card-premium p-8 relative overflow-hidden group border-transparent hover:border-blue/10">
               <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity ${m.color}`}>
                  <m.icon size={120} />
               </div>
               <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <m.icon size={24} />
               </div>
               <p className="text-xs font-bold text-text-3 uppercase tracking-widest">{m.label}</p>
               <h3 className="text-4xl font-black text-relavo-text-primary mt-2">{m.value}</h3>
            </Link>
          ))}
        </div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Client Health List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
               <h2 className="text-xl font-bold text-navy">Relationship pulse overview</h2>
               <Link to="/clients" className="text-[10px] font-black text-blue uppercase tracking-widest hover:underline">View All Directory</Link>
            </div>
            <div className="card-premium overflow-hidden divide-y divide-border-dark">
              {clients.map((c) => (
                <Link to={`/clients/${c.id}`} key={c.name} className="flex items-center gap-6 p-6 hover:bg-relavo-surface transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-blueLight text-blue flex items-center justify-center font-bold text-sm shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[17px] font-bold text-relavo-text-primary group-hover:text-blue transition-colors truncate">{c.name}</h4>
                    <p className="text-sm text-text-2 font-medium truncate">{c.company}</p>
                  </div>
                  
                  <div className="hidden sm:flex flex-col gap-2 w-40 shrink-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-text-3 uppercase tracking-tighter">
                      <span>Vitality Score</span>
                      <span className={c.score < 40 ? 'text-relavo-danger' : 'text-navy'}>{c.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                      <div 
                        className={`h-full ${getScoreColor(c.score)} rounded-full shadow-sm`} 
                        style={{ width: `${c.score}%` }} 
                      />
                    </div>
                  </div>

                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${getRiskBadge(c.status)}`}>
                    {c.status}
                  </div>
                  
                  <div className="p-2 rounded-xl text-slate-300 group-hover:bg-white group-hover:text-blue shadow-none group-hover:shadow-lg transition-all">
                    <ChevronRight size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AI Alerts Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xl font-bold text-navy">Smart signals</h2>
              <span className="bg-blue text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-blue/20">3 ACTIVE</span>
            </div>
            <div className="flex flex-col gap-6">
              {alerts.map((a, i) => (
                <Link to="/alerts" key={i} className={`card-premium border-l-[6px] ${a.severity === 'high' ? 'border-l-relavo-danger' : 'border-l-relavo-warning'} p-8 flex flex-col gap-4 group cursor-pointer`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-navy uppercase tracking-widest">{a.client}</h4>
                    <span className="text-[10px] text-text-3 font-bold group-hover:text-navy transition-colors">{a.time}</span>
                  </div>
                  <p className="text-[15px] text-text-2 font-medium leading-relaxed italic">
                    "{a.message}"
                  </p>
                  <div className="flex justify-end pt-2">
                    <button className="text-[10px] font-black text-text-3 hover:text-blue uppercase tracking-widest transition-colors flex items-center gap-1">
                      View Smart Collect <ChevronRight size={12} />
                    </button>
                  </div>
                </Link>
              ))}
              
              <div className="bg-blueLight/50 p-10 rounded-[24px] border border-dashed border-blue/30 flex flex-col items-center text-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue shadow-lg">
                    <Sparkles size={20} />
                 </div>
                 <p className="text-xs font-bold text-text-2">AI identifies patterns daily. <br /> Check back for updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
