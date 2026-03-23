import React from 'react';
import Layout from '../components/Layout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Mail,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Clients = () => {
  const clients = [
    { id: 1, name: 'Acme Corp', company: 'Design Agency', score: 32, status: 'At Risk', trend: -12, rev: '$4.2k/mo', initials: 'AC' },
    { id: 2, name: 'Globex Inc', company: 'SaaS Startup', score: 65, status: 'Needs Attention', trend: -5, rev: '$2.8k/mo', initials: 'GI' },
    { id: 3, name: 'Soylent Corp', company: 'Tech Consulting', score: 88, status: 'Healthy', trend: +8, rev: '$12k/mo', initials: 'SC' },
    { id: 4, name: 'Initech', company: 'Software Dev', score: 92, status: 'Healthy', trend: +2, rev: '$5.5k/mo', initials: 'IN' },
    { id: 5, name: 'Umbrella Corp', company: 'Pharma', score: 45, status: 'Needs Attention', trend: -18, rev: '$22k/mo', initials: 'UC' },
    { id: 6, name: 'Stark Ind', company: 'Defense', score: 95, status: 'Healthy', trend: +4, rev: '$150k/mo', initials: 'SI' },
    { id: 7, name: 'Wayne Ent', company: 'Private Equity', score: 71, status: 'Healthy', trend: -2, rev: '$85k/mo', initials: 'WE' },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-navy tracking-tight">Clients</h1>
            <p className="text-text-2 font-medium">Managing <span className="text-navy font-bold">24 primary accounts</span> with AI scoring.</p>
          </div>
          <button className="btn-primary py-2.5 px-8 text-sm">
            <Plus size={18} /> Add New Client
          </button>
        </header>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-[400px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-blue transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search clients by name, company, or status..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-border-dark rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue font-medium text-sm transition-all"
              />
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-border-dark rounded-2xl text-sm font-bold text-navy flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                 <Filter size={18} /> Filters
              </button>
              <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-border-dark rounded-2xl text-sm font-bold text-navy flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                 <TrendingUp size={18} /> Export CSV
              </button>
           </div>
        </div>

        {/* Client Table/Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
           <div className="card-premium overflow-hidden divide-y divide-border-dark">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 gap-6 px-10 py-5 bg-slate-50 border-b border-border-dark text-[10px] font-black text-text-3 uppercase tracking-widest">
                 <div className="col-span-4">Account Details</div>
                 <div className="col-span-3">Health Vitality</div>
                 <div className="col-span-2">Revenue</div>
                 <div className="col-span-2 text-center">Risk Level</div>
                 <div className="col-span-1"></div>
              </div>

              {/* Client Rows */}
              {clients.map((client) => (
                <Link to={`/clients/${client.id}`} key={client.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center px-10 py-8 hover:bg-slate-50/50 transition-all group relative">
                   {/* Client Info */}
                   <div className="col-span-1 lg:col-span-4 flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-blueLight text-blue flex items-center justify-center font-black text-sm shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                         {client.initials}
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-lg font-bold text-navy group-hover:text-blue transition-colors truncate">{client.name}</h4>
                         <p className="text-sm text-text-2 font-medium truncate">{client.company}</p>
                      </div>
                   </div>

                   {/* Health Score */}
                   <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest leading-none">
                         <span className="text-text-3">Pulse Index</span>
                         <span className="flex items-center gap-1">
                            {client.score}% 
                            {client.trend > 0 ? (
                               <TrendingUp size={10} className="text-relavo-success" />
                            ) : (
                               <TrendingDown size={10} className="text-relavo-danger" />
                            )}
                         </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                         <div 
                           className={`h-full rounded-full ${client.score < 40 ? 'bg-relavo-danger' : client.score < 70 ? 'bg-relavo-warning' : 'bg-relavo-success'}`} 
                           style={{ width: `${client.score}%` }} 
                         />
                      </div>
                   </div>

                   {/* Revenue */}
                   <div className="col-span-1 lg:col-span-2">
                      <p className="text-sm font-black text-navy">{client.rev}</p>
                      <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider">billed monthly</p>
                   </div>

                   {/* Status */}
                   <div className="col-span-1 lg:col-span-2 flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         client.status === 'Healthy' ? 'bg-green-100 text-green-600' : 
                         client.status === 'Needs Attention' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                         {client.status}
                      </span>
                   </div>

                   {/* Actions */}
                   <div className="col-span-1 lg:col-span-1 flex justify-end">
                      <button className="p-2 rounded-xl text-slate-300 hover:bg-white hover:text-navy shadow-none hover:shadow-lg transition-all">
                         <MoreVertical size={20} />
                      </button>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Clients;
