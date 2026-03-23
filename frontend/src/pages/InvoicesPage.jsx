import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MoreHorizontal, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import useClients from '../hooks/useClients';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoicesPage = () => {
  const { clients, loading } = useClients();
  const [statusFilter, setStatusFilter] = useState('all');

  // Flatten all invoices across clients
  const allInvoices = clients.flatMap(c =>
    (c.invoices || []).map(inv => ({ ...inv, client: c }))
  );

  const filtered = allInvoices.filter(inv => {
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchStatus;
  });

  const totalPaid = allInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const totalOutstanding = allInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const totalOverdue = allInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0);

  const statusBadgeStyles = {
    paid: "bg-[#f0fdf4] text-[#16a34a]",
    pending: "bg-[#fffbeb] text-[#d97706]",
    overdue: "bg-[#fef2f2] text-[#dc2626]",
  };

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#0f172a] m-0">Invoices</h1>
          <p className="text-[14px] text-[#64748b] mt-1 m-0">{allInvoices.length} total invoices across all clients</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <p className="text-[12px] font-medium uppercase text-[#94a3b8] tracking-[0.05em] m-0">Total Paid</p>
            <div className="w-8 h-8 rounded-[8px] bg-[#f0fdf4] flex items-center justify-center">
              <ArrowUpRight size={16} className="text-[#16a34a]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-[#16a34a] mt-2 mb-0 leading-none">{formatCurrency(totalPaid)}</p>
          <p className="text-[12px] text-[#94a3b8] mt-2 m-0">Settled payments</p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <p className="text-[12px] font-medium uppercase text-[#94a3b8] tracking-[0.05em] m-0">Outstanding</p>
            <div className="w-8 h-8 rounded-[8px] bg-[#fffbeb] flex items-center justify-center">
              <ArrowDownRight size={16} className="text-[#d97706]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-[#d97706] mt-2 mb-0 leading-none">{formatCurrency(totalOutstanding)}</p>
          <p className="text-[12px] text-[#94a3b8] mt-2 m-0">Awaiting payment</p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <p className="text-[12px] font-medium uppercase text-[#94a3b8] tracking-[0.05em] m-0">Overdue</p>
            <div className="w-8 h-8 rounded-[8px] bg-[#fef2f2] flex items-center justify-center">
              <AlertCircle size={16} className="text-[#dc2626]" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-[#dc2626] mt-2 mb-0 leading-none">{formatCurrency(totalOverdue)}</p>
          <p className="text-[12px] text-[#94a3b8] mt-2 m-0">Past due date</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#f1f5f9] p-1 rounded-[10px] gap-1 self-start mb-6 w-fit">
        {['all', 'paid', 'pending', 'overdue'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-[14px] py-[6px] rounded-[7px] text-[13px] font-medium transition-all duration-150 border-none cursor-pointer capitalize ${
              statusFilter === s 
                ? 'bg-white text-[#0f172a] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.1)]' 
                : 'bg-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-[#e2e8f0] rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-[60px] h-[60px] bg-[#f1f5f9] rounded-[16px] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[#94a3b8]" />
            </div>
            <p className="text-[16px] font-semibold text-[#374151] m-0">No invoices found</p>
            <p className="text-[14px] text-[#94a3b8] mt-1.5 m-0">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="p-[14px_20px] text-left text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Client</th>
                <th className="p-[14px_20px] text-left text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Amount</th>
                <th className="p-[14px_20px] text-left text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Status</th>
                <th className="p-[14px_20px] text-left text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Due Date</th>
                <th className="p-[14px_20px] text-left text-[12px] font-bold text-[#64748b] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => new Date(b.due_date) - new Date(a.due_date)).map((inv, i) => (
                <tr 
                  key={inv.id || i}
                  className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] transition-colors"
                >
                  <td className="p-[14px_20px]">
                    <Link to={`/clients/${inv.client?.id}`} className="flex items-center gap-3 no-underline group">
                      <div className="w-8 h-8 rounded-[8px] bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center text-[13px] font-bold uppercase shrink-0">
                        {inv.client?.name?.charAt(0)}
                      </div>
                      <span className="text-[14px] font-semibold text-[#0f172a] group-hover:text-[#3b82f6] transition-colors">
                        {inv.client?.name}
                      </span>
                    </Link>
                  </td>
                  <td className="p-[14px_20px]">
                    <span className="text-[14px] font-bold text-[#0f172a]">{formatCurrency(inv.amount)}</span>
                  </td>
                  <td className="p-[14px_20px]">
                    <span className={`px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-wider ${statusBadgeStyles[inv.status] || statusBadgeStyles.pending}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-[14px_20px]">
                    <span className={`text-[13px] font-medium ${inv.status === 'overdue' ? 'text-[#dc2626]' : 'text-[#64748b]'}`}>
                      {formatDate(inv.due_date)}
                    </span>
                  </td>
                  <td className="p-[14px_20px]">
                    <button className="p-1.5 text-[#94a3b8] hover:text-[#0f172a] bg-transparent border-none cursor-pointer transition-colors rounded-lg hover:bg-[#eff6ff]">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
