import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { diagnosticExecutor } from '@/lib/diagnosticExecutor';

const DiagnosticDashboard = () => {
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const data = await diagnosticExecutor.runAll();
    setResults(data);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Diagnostic Execution Engine</h1>
          <p className="text-gray-400">Real-time orchestration of all system diagnostic tests.</p>
        </div>
        <Button onClick={runDiagnostics} disabled={isRunning} className="bg-[#00d4ff] text-black hover:bg-[#00b3cc]">
          <Play className="w-4 h-4 mr-2" /> {isRunning ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </div>

      {isRunning ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Activity className="w-12 h-12 text-[#00d4ff] animate-pulse mb-4" />
          <p className="text-xl text-white">Executing comprehensive system diagnostics...</p>
        </div>
      ) : results ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(results.categories).map(([key, data], idx) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  {data.status === 'pass' ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                </div>
                <div className="text-3xl font-bold text-white mb-2">{data.score}<span className="text-sm text-gray-500 font-normal">/100</span></div>
                <p className="text-sm text-gray-400 mt-auto">{data.details}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DiagnosticDashboard;