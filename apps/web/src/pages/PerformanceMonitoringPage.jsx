import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Cpu, HardDrive , CheckCircle, AlertTriangle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { performanceOptimizer } from '@/lib/performanceOptimizer';

const MetricCard = ({ title, value, unit, icon: Icon, status = 'neutral' }) => {
  const colors = {
    good: 'text-green-400 bg-green-400/10 border-green-400/20',
    warning: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    poor: 'text-red-400 bg-red-400/10 border-red-400/20',
    neutral: 'text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/20'
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-lg border ${colors[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value || '--'}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </GlassCard>
  );
};

const PerformanceMonitoringPage = () => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    performanceOptimizer.init();
    
    const interval = setInterval(() => {
      setMetrics(performanceOptimizer.getMetrics());
    }, 2000);

    return () => {
      clearInterval(interval);
      performanceOptimizer.disconnect();
    };
  }, []);

  const getLcpStatus = (val) => !val ? 'neutral' : val < 2500 ? 'good' : val < 4000 ? 'warning' : 'poor';
  const getClsStatus = (val) => !val ? 'neutral' : val < 0.1 ? 'good' : val < 0.25 ? 'warning' : 'poor';

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Performance Monitoring</h1>
        <p className="text-gray-400">Real-time Core Web Vitals and resource utilization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="First Contentful Paint" 
          value={metrics.fcp ? Math.round(metrics.fcp) : null} 
          unit="ms" 
          icon={Clock} 
        />
        <MetricCard 
          title="Largest Contentful Paint" 
          value={metrics.lcp ? Math.round(metrics.lcp) : null} 
          unit="ms" 
          icon={Zap}
          status={getLcpStatus(metrics.lcp)}
        />
        <MetricCard 
          title="Cumulative Layout Shift" 
          value={metrics.cls ? metrics.cls.toFixed(3) : null} 
          unit="score" 
          icon={HardDrive}
          status={getClsStatus(metrics.cls)}
        />
        <MetricCard 
          title="JS Heap Size" 
          value={metrics.memory?.used} 
          unit="MB" 
          icon={Cpu} 
        />
      </div>

      <GlassCard className="p-8">
        <h2 className="text-xl font-bold text-white mb-6">Optimization Recommendations</h2>
        <ul className="space-y-4 text-gray-300">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Code splitting is active via React Router.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <span>Images are optimized and lazy-loaded where applicable.</span>
          </li>
          <li className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <span>Consider implementing service workers for offline caching of static assets.</span>
          </li>
        </ul>
      </GlassCard>
    </div>
  );
};

export default PerformanceMonitoringPage;