import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { comprehensiveAnalyzer } from '@/lib/comprehensiveAnalyzer';

const ComprehensiveAnalysisPage = () => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    setAnalysis(comprehensiveAnalyzer.analyze());
  }, []);

  if (!analysis) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Analysis</h1>
        <p className="text-gray-400">High-level system evaluation and strategic recommendations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-6 text-center">
          <Target className="w-8 h-8 text-[#00d4ff] mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Health Score</p>
          <p className="text-3xl font-bold text-white">{analysis.healthScore}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Performance</p>
          <p className="text-3xl font-bold text-white">{analysis.performanceScore}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Security</p>
          <p className="text-3xl font-bold text-white">{analysis.securityScore}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">UX Quality</p>
          <p className="text-3xl font-bold text-white">{analysis.uxScore}</p>
        </GlassCard>
      </div>

      <GlassCard className="p-8">
        <h2 className="text-xl font-bold text-white mb-6">Strategic Recommendations</h2>
        <div className="space-y-4">
          {analysis.recommendations.map((rec, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium">{rec.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400' : rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-400">Impact: {rec.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default ComprehensiveAnalysisPage;