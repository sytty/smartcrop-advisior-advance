import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from './GlassCard.jsx';

const ConfidenceScoreDistribution = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  // Aggregate confidence counts from the metrics array
  const totalHigh = metrics.reduce((sum, m) => sum + (m.high_confidence_count || 0), 0);
  const totalLow = metrics.reduce((sum, m) => sum + (m.low_confidence_count || 0), 0);
  const totalPredictions = metrics.reduce((sum, m) => sum + (m.predictions_count || 0), 0);
  const totalMid = totalPredictions - totalHigh - totalLow;

  const data = [
    { name: '<70% (Low)', count: totalLow, color: '#ef4444' },
    { name: '70-90% (Mid)', count: totalMid, color: '#eab308' },
    { name: '>90% (High)', count: totalHigh, color: '#22c55e' }
  ];

  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-2">Confidence Distribution</h3>
      <p className="text-sm text-gray-400 mb-6">Aggregated over selected period</p>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-gray-400">High (&gt;90%)</p>
          <p className="text-lg font-bold text-[#22c55e]">{totalHigh}</p>
        </div>
        <div className="text-center border-l border-r border-white/10">
          <p className="text-xs text-gray-400">Mid (70-90%)</p>
          <p className="text-lg font-bold text-yellow-500">{totalMid}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Low (&lt;70%)</p>
          <p className="text-lg font-bold text-red-500">{totalLow}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default ConfidenceScoreDistribution;