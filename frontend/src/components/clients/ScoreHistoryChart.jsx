import { 
  AreaChart, 
  Area, 
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
      <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label ? formatDate(label) : ''}
        </p>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-blue-500" />
           <p className="text-[16px] font-black text-slate-900 leading-none">
             {payload[0].value} <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pts</span>
           </p>
        </div>
      </div>
    );
  }
  return null;
};

const ScoreHistoryChart = ({ scores = [], height = 160 }) => {
  const chartData = scores.length > 0 ? scores : [
    { score: 70, calculated_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    { score: 75, calculated_at: new Date(Date.now() - 86400000 * 4).toISOString() },
    { score: 65, calculated_at: new Date(Date.now() - 86400000 * 2).toISOString() },
    { score: 72, calculated_at: new Date().toISOString() }
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="calculated_at" 
            tickFormatter={(str) => {
              try { return formatDate(str).split(',')[0]; } catch { return ''; }
            }}
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={[0, 100]} 
            ticks={[0, 50, 100]}
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)"
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistoryChart;
