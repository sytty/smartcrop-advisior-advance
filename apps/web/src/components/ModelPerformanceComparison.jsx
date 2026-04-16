import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GlassCard from './GlassCard.jsx';

const ModelPerformanceComparison = ({ currentMetrics, baselineMetrics }) => {
  if (!currentMetrics || !baselineMetrics) return null;

  const data = [
    {
      name: 'Accuracy',
      Current: currentMetrics.accuracy,
      Baseline: baselineMetrics.accuracy,
    },
    {
      name: 'Precision',
      Current: currentMetrics.precision,
      Baseline: baselineMetrics.precision,
    },
    {
      name: 'Recall',
      Current: currentMetrics.recall,
      Baseline: baselineMetrics.recall,
    },
    {
      name: 'F1 Score',
      Current: currentMetrics.f1_score,
      Baseline: baselineMetrics.f1_score,
    }
  ];

  const renderDiff = (current, baseline) => {
    const diff = current - baseline;
    const isPositive = diff >= 0;
    return (
      <span className={`text-xs font-medium ml-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{diff.toFixed(1)}%
      </span>
    );
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-bold text-white mb-6">Current vs Baseline Performance</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} domain={[60, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Baseline" fill="#1a4d2e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Metric</th>
                <th className="px-4 py-3 font-medium">Baseline (v1.1)</th>
                <th className="px-4 py-3 font-medium">Current (v2.0)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-gray-300">Accuracy</td>
                <td className="px-4 py-3 text-white">{baselineMetrics.accuracy}%</td>
                <td className="px-4 py-3 text-white flex items-center">
                  {currentMetrics.accuracy}% {renderDiff(currentMetrics.accuracy, baselineMetrics.accuracy)}
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-gray-300">Precision</td>
                <td className="px-4 py-3 text-white">{baselineMetrics.precision}%</td>
                <td className="px-4 py-3 text-white flex items-center">
                  {currentMetrics.precision}% {renderDiff(currentMetrics.precision, baselineMetrics.precision)}
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-gray-300">Recall</td>
                <td className="px-4 py-3 text-white">{baselineMetrics.recall}%</td>
                <td className="px-4 py-3 text-white flex items-center">
                  {currentMetrics.recall}% {renderDiff(currentMetrics.recall, baselineMetrics.recall)}
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-4 py-3 text-gray-300">F1 Score</td>
                <td className="px-4 py-3 text-white">{baselineMetrics.f1_score}%</td>
                <td className="px-4 py-3 text-white flex items-center">
                  {currentMetrics.f1_score}% {renderDiff(currentMetrics.f1_score, baselineMetrics.f1_score)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </GlassCard>
  );
};

export default ModelPerformanceComparison;