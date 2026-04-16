import React, { useEffect, useState } from 'react';
import { Activity, Server, Users, ShieldCheck } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { systemHealthDashboard } from '@/lib/systemHealthDashboard';

const SystemHealthDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    setMetrics(systemHealthDashboard.getMetrics());
  }, []);

  if (!metrics) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Health & Analytics</h1>
        <p className="text-gray-400">Real-time monitoring of system performance and stability.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-6 text-center">
          <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Overall Health</p>
          <p className="text-3xl font-bold text-white">{metrics.overallHealth}%</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <Server className="w-8 h-8 text-[#00d4ff] mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Avg API Response</p>
          <p className="text-3xl font-bold text-white">{metrics.performance.apiResponseAvg}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <ShieldCheck className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Security Score</p>
          <p className="text-3xl font-bold text-white">{metrics.security.score}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <Users className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-white">{metrics.users.active}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Component Health</h2>
          <div className="space-y-4">
            {Object.entries(metrics.components).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400 capitalize">{k}</span>
                  <span className="text-white">{v}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${v}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-gray-400">Page Load (Avg)</span>
              <span className="text-white font-medium">{metrics.performance.pageLoadAvg}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-gray-400">DB Query (Avg)</span>
              <span className="text-white font-medium">{metrics.performance.dbQueryAvg}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-gray-400">CPU Usage</span>
              <span className="text-white font-medium">{metrics.performance.cpuUsage}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-gray-400">Memory Usage</span>
              <span className="text-white font-medium">{metrics.performance.memoryUsage}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SystemHealthDashboardPage;