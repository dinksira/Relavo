import React, { useEffect } from 'react';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { useClientAI } from '../../hooks/useClientAI';
import { formatDaysAgo } from '../../utils/formatters';

const Pill = ({ color, label }) => {
  const colors = {
    blue: { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
    amber: { bg: '#fffbeb', text: '#d97706', border: '#fef3c7' },
    purple: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' }
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 100,
      backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}`,
      textTransform: 'uppercase', letterSpacing: '0.05em'
    }}>
      {label}
    </span>
  );
};

const Section = ({ title, content, color, label }) => {
  const borderColors = { blue: '#3b82f6', amber: '#d97706', purple: '#7c3aed' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Pill color={color} label={label} />
        <h4 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0 }}>{title}</h4>
      </div>
      <p style={{
        fontSize: 15, color: '#374151', lineHeight: 1.8, margin: 0,
        paddingLeft: 16, borderLeft: `3px solid ${borderColors[color]}`
      }}>
        {content}
      </p>
    </div>
  );
};

const Skeleton = () => (
  <div className="animate-pulse" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    {[85, 92, 78].map((w, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 20, width: 150, background: '#f1f5f9', borderRadius: 4 }} />
        <div style={{ height: 80, width: `${w}%`, background: '#f8fafc', borderRadius: 8 }} />
      </div>
    ))}
    <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 12 }}>AI is analyzing client data...</p>
  </div>
);

const AIBriefing = ({ clientId, clientName }) => {
  const { briefing, briefingLoading, briefingError, generateBriefing } = useClientAI(clientId);

  useEffect(() => {
    generateBriefing();
  }, [generateBriefing]);

  if (briefingLoading) return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px', marginBottom: 24 }}>
      <Skeleton />
    </div>
  );

  if (briefingError) return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px', marginBottom: 24, textAlign: 'center' }}>
      <AlertCircle size={40} color="#dc2626" style={{ marginBottom: 12 }} />
      <p style={{ color: '#0f172a', fontWeight: 500 }}>Could not generate briefing</p>
      <button 
        onClick={() => generateBriefing()}
        style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
      >
        Try again
      </button>
    </div>
  );

  if (!briefing) return null;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 32px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Brain size={20} color="#3b82f6" />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>AI Client Intelligence</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Generated {briefing.generated_at ? formatDaysAgo(briefing.generated_at) : 'recently'}
          </span>
          <button 
            onClick={() => generateBriefing()}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#64748b', fontWeight: 500,
              padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0',
              background: '#fff', cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            Regenerate
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <Section 
          color="blue" label="Past Analysis" title="Relationship History"
          content={briefing.past}
        />
        <Section 
          color="amber" label="Present Status" title="Where Things Stand Today"
          content={briefing.present}
        />
        <Section 
          color="purple" label="Future Prediction" title="What Happens Next"
          content={briefing.future}
        />
      </div>
    </div>
  );
};

export default AIBriefing;
