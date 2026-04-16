import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle, Play } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { testingOrchestrator } from '@/lib/testingOrchestrator';

const TestingResultsPage = () => {
  const [data, setData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const result = await testingOrchestrator.executeSuite();
    setData(result);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Testing Suite</h1>
          <p className="text-gray-400">Smoke, Regression, UAT, Load, and E2E test orchestration.</p>
        </div>
        <Button onClick={runTests} disabled={isRunning} className="bg-[#00d4ff] text-black hover:bg-[#00b3cc]">
          {isRunning ? <TestTube className="w-4 h-4 mr-2 animate-pulse" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Executing Suite...' : 'Run Full Suite'}
        </Button>
      </div>

      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassCard className="p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Total Tests</p>
              <p className="text-3xl font-bold text-white">{data.summary.total}</p>
            </GlassCard>
            <GlassCard className="p-4 text-center border-green-500/30">
              <p className="text-sm text-gray-400 mb-1">Passed</p>
              <p className="text-3xl font-bold text-green-400">{data.summary.passed}</p>
            </GlassCard>
            <GlassCard className="p-4 text-center border-red-500/30">
              <p className="text-sm text-gray-400 mb-1">Failed</p>
              <p className="text-3xl font-bold text-red-400">{data.summary.failed}</p>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Duration</p>
              <p className="text-3xl font-bold text-[#00d4ff]">{data.summary.duration}</p>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Results by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(data.categories).map(([cat, stats], idx) => (
                <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-white font-medium capitalize">{cat}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm">{stats.passed} pass</span>
                      {stats.failed > 0 && <span className="text-red-400 text-sm">{stats.failed} fail</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default TestingResultsPage;