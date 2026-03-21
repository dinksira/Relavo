import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, PlusCircle, DollarSign, Sparkles, Clock, Mail,
  Phone, Activity, AlertTriangle, CheckCircle, MessageSquare, Video
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import HealthGauge from '../components/ui/HealthGauge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import TouchpointModal from '../components/clients/TouchpointModal';
import InvoiceModal from '../components/clients/InvoiceModal';
import { clientsAPI } from '../services/api';
import { getRiskLabel, getRiskColors } from '../utils/scoreHelpers';
import { formatDaysAgo, formatDate, formatCurrency } from '../utils/formatters';
import useToast from '../hooks/useToast';

const typeIcons = {
  call: Phone, email: Mail, meeting: Video, message: MessageSquare
};

const outcomeColors = { positive: '#16a34a', neutral: '#94a3b8', negative: '#dc2626' };

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [touchpointModalOpen, setTouchpointModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await clientsAPI.getById(id);
        setClient(res.data?.data || res.data);
      } catch {
        toast.error('Failed to load client');
      } finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddTouchpoint = async (data) => {
    await clientsAPI.logTouchpoint(id, data);
    const res = await clientsAPI.getById(id);
    setClient(res.data?.data || res.data);
  };

  const handleAddInvoice = async (data) => {
    await clientsAPI.addInvoice(id, data);
    const res = await clientsAPI.getById(id);
    setClient(res.data?.data || res.data);
  };

  if (loading) return (
    <DashboardLayout>
      <LoadingSkeleton variant="detail" count={3} />
    </DashboardLayout>
  );

  if (!client) return (
    <DashboardLayout>
      <EmptyState icon={Activity} title="Client not found" subtitle="This client may have been deleted." />
    </DashboardLayout>
  );

  const score = client.latest_health_score || 0;
  const colors = getRiskColors(score);
  const badgeVariant = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'danger';
  const touchpoints = client.touchpoints || [];
  const invoices = client.invoices || [];
  const openInvoices = invoices.filter(i => i.status !== 'paid');
  const totalOutstanding = openInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

  // Mock trend data if none
  const trendData = client.health_scores || [
    { date: '7d ago', score: Math.max(0, score - 15) },
    { date: '6d ago', score: Math.max(0, score - 10) },
    { date: '5d ago', score: Math.max(0, score - 8) },
    { date: '4d ago', score: Math.max(0, score - 5) },
    { date: '3d ago', score: Math.max(0, score - 3) },
    { date: '2d ago', score: Math.max(0, score - 1) },
    { date: 'Today', score },
  ];

  return (
    <DashboardLayout>
      {/* Back */}
      <button
        onClick={() => navigate('/clients')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 14, color: '#64748b', fontFamily: 'inherit',
          marginBottom: 20, padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Clients
      </button>

      {/* Client header */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: 10, padding: 24, marginBottom: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Avatar name={client.name} size="xl" />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{client.name}</h1>
            {client.contact_name && (
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} /> {client.contact_name}
              </p>
            )}
            {client.email && (
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 6px' }}>{client.email}</p>
            )}
            <Badge variant={client.status === 'active' ? 'active' : 'paused'}>{client.status || 'Active'}</Badge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm" icon={PlusCircle} onClick={() => setTouchpointModalOpen(true)}>Log Touchpoint</Button>
          <Button variant="outline" size="sm" icon={DollarSign} onClick={() => setInvoiceModalOpen(true)}>Add Invoice</Button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {/* Health Score */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Score</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <HealthGauge score={score} size="lg" />
          </div>
          <Badge variant={badgeVariant}>{getRiskLabel(score)}</Badge>
        </div>

        {/* Last Contact */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Contact</p>
          <Clock size={28} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>{formatDaysAgo(client.last_contact_date)}</p>
          {touchpoints[0] && <Badge variant="neutral" size="sm">{touchpoints[0].type}</Badge>}
        </div>

        {/* Financial Health */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Health</p>
          <DollarSign size={28} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
          {openInvoices.length === 0 ? (
            <>
              <CheckCircle size={24} color="#16a34a" style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: 14, color: '#16a34a', fontWeight: 500, margin: 0 }}>All paid</p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 24, fontWeight: 600, color: '#dc2626', margin: '0 0 4px' }}>{openInvoices.length}</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px' }}>open invoices</p>
              <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 500, margin: 0 }}>{formatCurrency(totalOutstanding)} outstanding</p>
            </>
          )}
        </div>
      </div>

      {/* AI Insight */}
      {client.ai_insight && (
        <div style={{
          background: '#eff6ff', border: '1px solid #bfdbfe',
          borderLeft: '4px solid #3b82f6', borderRadius: 10,
          padding: '20px 24px', marginBottom: 24,
          display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <Sparkles size={24} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#3b82f6', margin: '0 0 6px' }}>AI Insight</p>
            <p style={{ fontSize: 15, color: '#1b2a3b', lineHeight: 1.7, margin: 0 }}>{client.ai_insight}</p>
          </div>
        </div>
      )}

      {/* Trend chart */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 20px' }}>Health score over time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
            />
            <ReferenceLine y={70} strokeDasharray="4 4" stroke="#16a34a" />
            <ReferenceLine y={40} strokeDasharray="4 4" stroke="#dc2626" />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Two columns: Touchpoints + Invoices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Touchpoints */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>Activity Timeline</p>
            <Button variant="outline" size="sm" onClick={() => setTouchpointModalOpen(true)}>Log Touchpoint</Button>
          </div>

          {touchpoints.length === 0 ? (
            <EmptyState icon={Activity} title="No activity logged yet" subtitle="Record your first interaction" />
          ) : (
            <div style={{ position: 'relative' }}>
              {touchpoints.map((tp, i) => {
                const Icon = typeIcons[tp.type] || MessageSquare;
                return (
                  <div key={tp.id || i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: outcomeColors[tp.outcome] || '#94a3b8',
                        flexShrink: 0, marginTop: 4,
                      }} />
                      {i < touchpoints.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: '#e2e8f0', marginTop: 4 }} />
                      )}
                    </div>
                    <div style={{
                      flex: 1, background: '#fff', border: '1px solid #e2e8f0',
                      borderRadius: 8, padding: '12px 16px', marginBottom: 4,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Icon size={14} color="#64748b" />
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{tp.type}</span>
                        </div>
                        <span style={{ fontSize: 12, color: '#94a3b8' }}>{formatDaysAgo(tp.created_at)}</span>
                      </div>
                      <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                        {tp.notes || <em>No notes recorded</em>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoices */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>Invoices</p>
            <Button variant="outline" size="sm" onClick={() => setInvoiceModalOpen(true)}>Add Invoice</Button>
          </div>

          {invoices.length === 0 ? (
            <EmptyState icon={DollarSign} title="No invoices" subtitle="Add an invoice to track payments" />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Total', val: formatCurrency(invoices.reduce((s, i) => s + (i.amount || 0), 0)), color: '#0f172a' },
                  { label: 'Paid', val: formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0)), color: '#16a34a' },
                  { label: 'Outstanding', val: formatCurrency(openInvoices.reduce((s, i) => s + (i.amount || 0), 0)), color: openInvoices.length > 0 ? '#dc2626' : '#94a3b8' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: stat.color, margin: 0 }}>{stat.val}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              {invoices.map((inv, i) => {
                const statusVariant = inv.status === 'paid' ? 'active' : inv.status === 'overdue' ? 'danger' : 'warning';
                return (
                  <div key={inv.id || i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#fff', border: '1px solid #e2e8f0',
                    borderRadius: 8, padding: '14px 16px', marginBottom: 8,
                  }}>
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: 0 }}>{formatCurrency(inv.amount)}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Due {formatDate(inv.due_date)}</p>
                    </div>
                    <Badge variant={statusVariant} size="sm">{inv.status}</Badge>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      <TouchpointModal
        isOpen={touchpointModalOpen}
        onClose={() => setTouchpointModalOpen(false)}
        clientId={id}
        onSuccess={handleAddTouchpoint}
      />
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        clientId={id}
        onSuccess={handleAddInvoice}
      />
    </DashboardLayout>
  );
};

export default ClientDetailPage;
