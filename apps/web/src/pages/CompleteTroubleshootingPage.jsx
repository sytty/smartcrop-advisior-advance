import React, { useEffect, useState } from 'react';
import { AlertCircle, Wrench, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { completeTroubleshootingGuide } from '@/lib/completeTroubleshootingGuide';

const CompleteTroubleshootingPage = () => {
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    setGuide(completeTroubleshootingGuide.generate());
  }, []);

  if (!guide) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Complete Troubleshooting Guide</h1>
        <p className="text-gray-400">Knowledge base for resolving common issues and errors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-yellow-500" /> Common Issues & Solutions
            </h2>
            <div className="space-y-4">
              {guide.commonIssues.map((item, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-white font-medium mb-2">{item.issue}</h3>
                  <p className="text-sm text-gray-400"><strong>Solution:</strong> {item.solution}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Wrench className="w-5 h-5 text-red-500" /> Error Messages Reference
            </h2>
            <div className="space-y-4">
              {guide.errorMessages.map((err, i) => (
                <div key={i} className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h3 className="text-red-400 font-bold font-mono mb-1">{err.code}</h3>
                  <p className="text-sm text-gray-300 mb-2">{err.meaning}</p>
                  <p className="text-sm text-gray-400"><strong>Action:</strong> {err.action}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <RefreshCw className="w-5 h-5 text-[#00d4ff]" /> Recovery Procedures
            </h2>
            <div className="space-y-6">
              {guide.recoveryProcedures.map((proc, i) => (
                <div key={i}>
                  <h3 className="text-white font-medium mb-2">{proc.name}</h3>
                  <p className="text-sm text-gray-400 bg-black/30 p-3 rounded-lg leading-relaxed">
                    {proc.steps}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CompleteTroubleshootingPage;