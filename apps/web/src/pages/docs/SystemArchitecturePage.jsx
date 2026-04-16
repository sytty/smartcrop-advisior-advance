import React from 'react';
import { Helmet } from 'react-helmet';
import { Network, Database, Server, Layout, Shield } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { systemArchitecture } from '@/lib/docs/systemArchitecture.js';

const SystemArchitecturePage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>System Architecture - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Network className="w-10 h-10 text-[#b300ff]" /> System Architecture
        </h1>
        <p className="text-xl text-gray-400">Technical overview of how the platform is built.</p>
      </div>

      <GlassCard className="p-8 mb-8 border-[#b300ff]/30">
        <p className="text-xl text-white leading-relaxed">{systemArchitecture.overview}</p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-[#00d4ff]/20 text-[#00d4ff]"><Layout className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-white">Frontend</h2>
          </div>
          <p className="text-gray-400">{systemArchitecture.frontend}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-500/20 text-green-400"><Server className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-white">Backend API</h2>
          </div>
          <p className="text-gray-400">{systemArchitecture.backend}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400"><Database className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-white">Database</h2>
          </div>
          <p className="text-gray-400">{systemArchitecture.database}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-500/20 text-red-400"><Shield className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          <p className="text-gray-400">{systemArchitecture.security}</p>
        </GlassCard>
      </div>
    </div>
  );
};

export default SystemArchitecturePage;