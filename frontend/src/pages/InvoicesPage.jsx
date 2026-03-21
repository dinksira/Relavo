import React, { useState } from 'react';
import { FileText, Plus } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import useClients from '../hooks/useClients';
import { formatCurrency, formatDate } from '../utils/formatters';

const InvoicesPage = () => {
  const { clients, loading } = useClients();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Flatten all invoices across clients
  const allInvoices = clients.flatMap(c =>
    (c.invoices || []).map(inv => ({ ...inv, client: c }))
  );

  const filtered = allInvoices.filter(inv => {
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchSearch = !search || inv.client?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPaid = allInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const totalOutstanding = allInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.amount || 0), 0);
  const totalOverdue = allInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.amount || 0), 0);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: 0 }}>Invoices</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>{allInvoices.length} invoices total</p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Revenue', value: formatCurrency(totalPaid), color: '#16a34a', bg: '#dcfce7' },
          { label: 'Outstanding', value: formatCurrency(totalOutstanding), color: '#d97706', bg: '#fef9c3' },
          { label: 'Overdue', value: formatCurrency(totalOverdue), color: '#dc2626', bg: '#fee2e2' },
        ].map(card => (
          <div key={card.label} style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 10, padding: 20,
          }}>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 8px' }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: card.color, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'paid', 'pending', 'overdue'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: 'none', fontFamily: 'inherit',
              background: statusFilter === s ? '#3b82f6' : '#f1f5f9',
              color: statusFilter === s ? '#fff' : '#64748b',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices" subtitle="Invoices added to clients will appear here" />
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Client', 'Amount', 'Status', 'Due Date', 'Paid Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a, b) => {
                if (a.status === 'overdue' && b.status !== 'overdue') return -1;
                if (b.status === 'overdue' && a.status !== 'overdue') return 1;
                return new Date(a.due_date) - new Date(b.due_date);
              }).map((inv, i) => {
                const statusVariant = inv.status === 'paid' ? 'active' : inv.status === 'overdue' ? 'danger' : 'warning';
                return (
                  <tr
                    key={inv.id || i}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={inv.client?.name} size="sm" />
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{inv.client?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{formatCurrency(inv.amount)}</td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={statusVariant} size="sm">{inv.status}</Badge></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: inv.status === 'overdue' ? '#dc2626' : '#64748b' }}>{formatDate(inv.due_date)}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>{formatDate(inv.paid_date) || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
