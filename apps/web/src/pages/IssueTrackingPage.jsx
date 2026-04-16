import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { issueAnalyzer } from '@/lib/issueAnalyzer';

const IssueTrackingPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(issueAnalyzer.analyze());
  }, []);

  if (!data) return null;

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Issue Registry & Tracking</h1>
        <p className="text-gray-400">Identification, prioritization, and tracking of system issues.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(data.summary).map(([severity, count]) => (
          <GlassCard key={severity} className="p-4 text-center">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">{severity}</p>
            <p className="text-3xl font-bold text-white">{count}</p>
          </GlassCard>
        ))}
      </div>

      <div className="space-y-4">
        {data.issues.map((issue, idx) => (
          <motion.div key={issue.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
            <GlassCard className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(issue.severity)}
                  <h3 className="text-lg font-bold text-white">{issue.title}</h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-gray-300">{issue.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${issue.status === 'fixed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500 block">Component</span><span className="text-gray-300">{issue.component}</span></div>
                <div><span className="text-gray-500 block">Root Cause</span><span className="text-gray-300">{issue.rootCause}</span></div>
                <div><span className="text-gray-500 block">Impact</span><span className="text-gray-300">{issue.impact}</span></div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IssueTrackingPage;