import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { featureTestingFramework } from '@/lib/featureTestingFramework';

const FeatureTestingPage = () => {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    const testResults = await featureTestingFramework.runAllTests();
    setResults(testResults);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Feature Validation Framework</h1>
          <p className="text-gray-400">Automated runtime checks for core system features.</p>
        </div>
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="bg-[#00d4ff] text-black hover:bg-[#00b3cc]"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      <div className="space-y-4">
        {results.length === 0 && !isRunning && (
          <GlassCard className="p-12 text-center">
            <p className="text-gray-400">Click "Run All Tests" to begin validation.</p>
          </GlassCard>
        )}

        {results.map((result, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <GlassCard className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {result.status === 'pass' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-white">{result.feature}</h3>
                  <p className="text-sm text-gray-400">{result.details || result.error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" />
                {Math.round(result.duration)}ms
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureTestingPage;