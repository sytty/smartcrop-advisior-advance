import React, { useEffect, useState } from 'react';
import { Zap, Server, Globe, ArrowRight , Monitor } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { performanceOptimizationEngine } from '@/lib/performanceOptimizationEngine';

const PerformanceOptimizationPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(performanceOptimizationEngine.analyze());
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Performance Optimization</h1>
        <p className="text-gray-400">Analysis of frontend, backend, and network optimizations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Monitor className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-white">Frontend</h2>
          </div>
          <ul className="space-y-4">
            {Object.entries(data.frontend).map(([k, v]) => (
              <li key={k} className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-[#00d4ff] font-medium">{v.savings || v.potentialSavings}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><Server className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-white">Backend</h2>
          </div>
          <ul className="space-y-4">
            {Object.entries(data.backend).map(([k, v]) => (
              <li key={k} className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-[#00d4ff] font-medium text-right">{v.improvement}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400"><Globe className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-white">Network</h2>
          </div>
          <ul className="space-y-4">
            {Object.entries(data.network).map(([k, v]) => (
              <li key={k} className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-gray-400 capitalize">{k}</span>
                <span className="text-[#00d4ff] font-medium">{v.savings || v.hitRate || v.type}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Future Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{rec.title}</h3>
                <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">{rec.impact} Impact</span>
              </div>
              <p className="text-sm text-gray-400">{rec.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default PerformanceOptimizationPage;