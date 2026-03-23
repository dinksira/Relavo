import React from 'react';
import Layout from '../components/Layout';
import { 
  FileText, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Invoices = () => {
  const invoices = [
    { id: '#102', client: 'Acme Corp', amount: '$4,200', date: 'Due Mar 05', status: 'Overdue', severity: 'high' },
    { id: '#101', client: 'Globex Inc', amount: '$2,800', date: 'Due Mar 14', status: 'Pending', severity: 'low' },
    { id: '#100', client: 'Soylent Corp', amount: '$12,000', date: 'Paid Mar 01', status: 'Paid', severity: 'none' },
    { id: '#099', client: 'Initech', amount: '$5,500', date: 'Paid Feb 15', status: 'Paid', severity: 'none' },
    { id: '#098', client: 'Umbrella Corp', amount: '$22,000', date: 'Due Feb 28', status: 'Overdue', severity: 'medium' },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <header className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-navy tracking-tight">Invoices</h1>
            <p className="text-text-2 font-medium">Tracking <span className="text-navy font-bold">$46,500</span> in monthly recurring revenue.</p>
          </div>
          <button className="btn-primary py-2.5 px-8 text-sm">
            <FileText size={18} /> Create New Invoice
          </button>
        </header>

        {/* Revenue Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="card-premium p-10 flex flex-col gap-6 group hover:border-blue/30 transition-all">
              <div className="w-14 h-14 bg-blueLight text-blue rounded-2xl flex items-center justify-center shadow-sm">
                 <TrendingUp size={28} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">Revenue at Risk</p>
                 <h3 className="text-3xl font-black text-relavo-danger tracking-tighter">$26,200</h3>
                 <p className="text-xs text-text-2 font-medium">Linked to "At Risk" health scores.</p>
              </div>
           </div>
           <div className="card-premium p-10 flex flex-col gap-6 bg-navy text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <DollarSign size={150} />
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 backdrop-blur-md">
                 <DollarSign size={28} />
              </div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Outstanding Balance</p>
                 <h3 className="text-3xl font-black text-white tracking-tighter animate-float">$30,200</h3>
                 <p className="text-xs text-white/50 font-medium">5 overdue, 2 pending collection.</p>
              </div>
           </div>
           <div className="card-premium p-10 flex flex-col gap-6 group">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                 <TrendingUp size={28} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-text-3 uppercase tracking-widest">Collected (Last 30d)</p>
                 <h3 className="text-3xl font-black text-relavo-success tracking-tighter">$16,300</h3>
                 <p className="text-xs text-text-2 font-medium">Average 4.2 days to payment.</p>
              </div>
           </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-[400px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-3 group-focus-within:text-blue transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search invoices by id, client, or status..." 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-border-dark rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue/10 focus:border-blue font-medium text-sm transition-all"
              />
           </div>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-border-dark rounded-2xl text-sm font-bold text-navy flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                 <Filter size={18} /> Filters
              </button>
              <button className="flex-1 md:flex-none px-8 py-4 bg-white border border-border-dark rounded-2xl text-sm font-bold text-navy flex items-center justify-center gap-2 hover:border-blue/30 active:scale-95 transition-all shadow-sm">
                 <Sparkles size={18} className="text-blue" /> Smart Collection
              </button>
           </div>
        </div>

        {/* Invoices List */}
        <div className="card-premium overflow-hidden">
           <div className="hidden lg:grid grid-cols-12 gap-6 px-10 py-5 bg-slate-50 border-b border-border-dark text-[10px] font-black text-text-3 uppercase tracking-widest leading-none">
              <div className="col-span-1">ID</div>
              <div className="col-span-4">Client / Account</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-1"></div>
           </div>

           <div className="divide-y divide-border-dark">
              {invoices.map((inv) => (
                <div key={inv.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center px-10 py-8 hover:bg-slate-50/50 transition-all cursor-pointer group">
                   <div className="col-span-1 text-sm font-black text-navy group-hover:text-blue">{inv.id}</div>
                   
                   <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-navy font-bold text-[10px] shrink-0 border border-slate-200">
                         {inv.client.split(' ')[0][0]}{inv.client.split(' ')[1] ? inv.client.split(' ')[1][0] : ''}
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-sm font-bold text-navy truncate">{inv.client}</h4>
                         <p className="text-[10px] text-text-2 font-medium tracking-tight uppercase">Monthly Retainer</p>
                      </div>
                   </div>

                   <div className="col-span-1 lg:col-span-2">
                       <p className="text-sm font-bold text-navy">{inv.date}</p>
                       <p className="text-[10px] text-text-3 font-bold uppercase tracking-widest">issued Feb 25</p>
                   </div>

                   <div className="col-span-1 lg:col-span-2 text-right">
                      <p className="text-[17px] font-black text-navy">{inv.amount}</p>
                   </div>

                   <div className="col-span-1 lg:col-span-2 flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         inv.status === 'Paid' ? 'bg-green-100 text-green-600' : 
                         inv.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                      }`}>
                         {inv.status}
                      </span>
                   </div>

                   <div className="col-span-1 lg:col-span-1 flex justify-end">
                      <button className="p-2 rounded-xl text-slate-300 hover:bg-white hover:text-navy shadow-none hover:shadow-lg transition-all">
                         <MoreVertical size={20} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Invoices;
