import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import HealthGauge from '../components/ui/HealthGauge';
import ScoreBar from '../components/ui/ScoreBar';
import EmptyState from '../components/ui/EmptyState';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import AddClientModal from '../components/clients/AddClientModal';
import useClients from '../hooks/useClients';
import { getRiskLabel } from '../utils/scoreHelpers';
import { formatDaysAgo } from '../utils/formatters';

const ClientCard = ({ client, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const score = client.latest_health_score || 0;
  const badgeVariant = score >= 70 ? 'healthy' : score >= 40 ? 'warning' : 'danger';
  const statusVariant = client.status === 'active' ? 'active' : client.status === 'paused' ? 'paused' : 'churned';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#d1d5db' : '#e2e8f0'}`,
        borderRadius: 10, padding: 20, cursor: 'pointer',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 150ms',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
        <Avatar name={client.name} size="lg" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</p>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>{client.contact_name || '—'}</p>
          <Badge variant={statusVariant} size="sm">{client.status || 'Active'}</Badge>
        </div>
      </div>

      {/* Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
        <HealthGauge score={score} size="md" />
        <div style={{ marginTop: 8 }}>
          <Badge variant={badgeVariant}>{getRiskLabel(score)}</Badge>
        </div>
      </div>

      {/* Score bar */}
      <div style={{ marginBottom: 16 }}>
        <ScoreBar score={score} showScore />
      </div>

      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginBottom: 12 }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, textAlign: 'center' }}>
        {[
          { label: 'Touchpoints', value: client.touchpoints_count || 0 },
          { label: 'Invoices', value: client.invoices_count || 0 },
          { label: 'Last Contact', value: formatDaysAgo(client.last_contact_date) },
        ].map(stat => (
          <div key={stat.label}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{stat.value}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientsPage = () => {
  const navigate = useNavigate();
  const { clients, loading, addClient, healthyCount, warningCount, atRiskCount } = useClients();
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = clients.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.contact_name?.toLowerCase().includes(search.toLowerCase());
    const score = c.latest_health_score || 0;
    const matchFilter = filter === 'all' || (filter === 'healthy' && score >= 70) || (filter === 'warning' && score >= 40 && score < 70) || (filter === 'risk' && score < 40);
    return matchSearch && matchFilter;
  });

  const filterTabs = [
    { key: 'all', label: 'All', count: clients.length },
    { key: 'healthy', label: 'Healthy', count: healthyCount },
    { key: 'warning', label: 'Needs Attention', count: warningCount },
    { key: 'risk', label: 'At Risk', count: atRiskCount },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#0f172a', margin: 0 }}>Clients</h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>{clients.length} clients total</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setShowAddModal(true)}>Add Client</Button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{
              width: '100%', height: 38, paddingLeft: 36, paddingRight: 12,
              border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
              fontFamily: 'inherit', color: '#0f172a', boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                background: filter === tab.key ? '#3b82f6' : '#f1f5f9',
                color: filter === tab.key ? '#fff' : '#64748b',
                transition: 'all 150ms',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          <LoadingSkeleton variant="card" count={3} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No clients match your search' : 'No clients yet'}
          subtitle="Add your first client to start monitoring their relationship health"
          actionLabel="Add your first client"
          action={() => setShowAddModal(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map(client => (
            <ClientCard key={client.id} client={client} onClick={() => navigate(`/clients/${client.id}`)} />
          ))}
        </div>
      )}

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={addClient}
      />
    </DashboardLayout>
  );
};

export default ClientsPage;
