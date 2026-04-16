import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, Trash2, Terminal } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { errorService } from '@/lib/errorDetectionService';

const ErrorReportingPage = () => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Initialize if not already
    errorService.init();
    setErrors(errorService.getErrors());

    const unsubscribe = errorService.subscribe((newErrors) => {
      setErrors([...newErrors]);
    });

    return () => unsubscribe();
  }, []);

  const clearErrors = () => {
    errorService.clearErrors();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Error Detection Center</h1>
          <p className="text-gray-400">Real-time monitoring of runtime, promise, and console errors.</p>
        </div>
        <Button onClick={clearErrors} variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Clear Logs
        </Button>
      </div>

      {errors.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <AlertOctagon className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Errors Detected</h2>
          <p className="text-gray-400">The system is running smoothly.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {errors.map((err, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard className="p-6 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-red-500/20 text-red-400">
                      {err.type}
                    </span>
                    <span className="text-sm text-gray-400">{new Date(err.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{err.message}</h3>
                {err.error && (
                  <div className="bg-black/50 p-4 rounded-lg overflow-x-auto mt-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                      <Terminal className="w-4 h-4" /> Stack Trace
                    </div>
                    <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                      {err.error}
                    </pre>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorReportingPage;