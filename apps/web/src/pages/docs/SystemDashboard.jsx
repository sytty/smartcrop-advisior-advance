import React from 'react';
import { Helmet } from 'react-helmet';
import { Activity, Server, Users, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { systemStatus } from '@/lib/docs/systemStatus.js';

const SystemDashboard = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>System Status - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10 text-green-400" /> System Status
          </h1>
          <p className="text-xl text-gray-400">Real-time overview of platform health.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500 mb-1">Last Updated</p>
          <p className="text-white font-mono">{new Date(systemStatus.lastUpdated).toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="p-6 border-green-500/30 bg-green-500/5">
          <h3 className="text-gray-400 mb-2">Overall Status</h3>
          <p className="text-3xl font-bold text-green-400 flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8" /> {systemStatus.overall}
          </p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-gray-400 mb-2">System Uptime</h3>
          <p className="text-3xl font-bold text-white">{systemStatus.uptime}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h3 className="text-gray-400 mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-[#00d4ff]">{systemStatus.metrics.activeUsers.toLocaleString()}</p>
        </GlassCard>
      </div>

      <h2 className="text-2xl font-bold text-white mb-6">Service Health</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemStatus.services.map((service, idx) => (
          <GlassCard key={idx} className="p-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white font-medium">{service.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500 block">Latency</span>
              <span className="text-gray-300 font-mono">{service.latency}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default SystemDashboard;