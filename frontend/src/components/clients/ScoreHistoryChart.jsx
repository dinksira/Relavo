import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { formatDate } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', margin: '0 0 4px', textTransform: 'uppercase' }}>
          {label ? formatDate(label) : ''}
        </p>
        <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Score: <span style={{ color: '#3b82f6' }}>{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ScoreHistoryChart = ({ scores = [] }) => {
  // Ensure we have at least some data points or placeholders
  const chartData = scores.length > 0 ? scores : [
    { score: 70, calculated_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { score: 70, calculated_at: new Date().toISOString() }
  ];

  return (
    <div style={{ width: '100%', height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <XAxis 
            dataKey="calculated_at" 
            tickFormatter={(str) => {
              try { return formatDate(str).split(',')[0]; } catch { return str; }
            }}
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={[0, 100]} 
            ticks={[0, 40, 70, 100]}
            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={70} stroke="#16a34a" strokeDasharray="4 4" label={{ position: 'right', value: 'Healthy', fill: '#16a34a', fontSize: 10, fontWeight: 700 }} />
          <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="4 4" label={{ position: 'right', value: 'At Risk', fill: '#dc2626', fontSize: 10, fontWeight: 700 }} />
          
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={2.5}
            dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0, fill: '#1d4ed8' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistoryChart;
