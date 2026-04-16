import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, Play } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { autoFixEngine } from '@/lib/autoFixEngine';

const FixVerificationPage = () => {
  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runFixes = async () => {
    setIsRunning(true);
    const result = await autoFixEngine.runFixes();
    setData(result);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Automated Fix Engine</h1>
          <p className="text-gray-400">Auto-resolution and verification of common system issues.</p>
        </div>
        <Button onClick={runFixes} disabled={isRunning} className="bg-[#00d4ff] text-black hover:bg-[#00b3cc]">
          {isRunning ? <Wrench className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Applying Fixes...' : 'Run Auto-Fix Engine'}
        </Button>
      </div>

      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.impact).map(([key, val], idx) => (
              <motion.div key={key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                <GlassCard className="p-6 text-center">
                  <p className="text-sm text-gray-400 capitalize mb-2">{key} Impact</p>
                  <p className="text-xl font-bold text-[#00d4ff]">{val}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Fixes Applied & Verified</h2>
            <div className="space-y-4">
              {data.fixesApplied.map((fix, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{fix.issueId}</span>
                      <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-gray-300">{fix.type}</span>
                    </div>
                    <p className="text-sm text-gray-400">{fix.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default FixVerificationPage;