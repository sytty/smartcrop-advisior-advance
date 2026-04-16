import React, { useEffect, useState } from 'react';
import { Map, Clock, Calendar, Zap } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { continuousImprovementRoadmap } from '@/lib/continuousImprovementRoadmap';

const ContinuousImprovementPage = () => {
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    setRoadmap(continuousImprovementRoadmap.getRoadmap());
  }, []);

  if (!roadmap) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Continuous Improvement Roadmap</h1>
        <p className="text-gray-400">Strategic plan for future enhancements and scalability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <GlassCard className="p-6 border-t-4 border-t-[#00d4ff]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-[#00d4ff]" /> Short Term (1-3 Mo)
          </h2>
          <div className="space-y-4">
            {roadmap.shortTerm.map((item, i) => (
              <div key={i}>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-t-4 border-t-purple-500">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-purple-400" /> Medium Term (3-6 Mo)
          </h2>
          <div className="space-y-4">
            {roadmap.mediumTerm.map((item, i) => (
              <div key={i}>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-t-4 border-t-green-500">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Map className="w-5 h-5 text-green-400" /> Long Term (6-12 Mo)
          </h2>
          <div className="space-y-4">
            {roadmap.longTerm.map((item, i) => (
              <div key={i}>
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-400" /> Technology Upgrades
        </h2>
        <div className="flex flex-wrap gap-4">
          {roadmap.techUpgrades.map((tech, i) => (
            <span key={i} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default ContinuousImprovementPage;