import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Globe, Cpu, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { runDiagnostics } from '@/lib/systemDiagnostics';

const StatusIcon = ({ status }) => {
  if (status === 'healthy' || status === 'ok') return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === 'warning' || status === 'incomplete') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  return <XCircle className="w-5 h-5 text-red-500" />;
};

const DiagnosticsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDiagnostics().then(data => {
      setReport(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center text-[#00d4ff]">Running System Diagnostics...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Diagnostics</h1>
        <p className="text-gray-400">Comprehensive health check of all system components.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard className="p-6 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${report.status === 'healthy' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Overall Status</p>
            <p className="text-xl font-bold text-white capitalize">{report.status}</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00d4ff]" /> Database Integrity
              </h2>
              <StatusIcon status={report.components.database.status} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Collections Checked</span>
                <span className="text-white font-medium">{report.components.database.details?.collectionsChecked || 0}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Accessible</span>
                <span className="text-white font-medium">{report.components.database.details?.accessible || 0}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00d4ff]" /> i18n Validation
              </h2>
              <StatusIcon status={report.components.i18n.status} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Languages Checked</span>
                <span className="text-white font-medium">{report.components.i18n.details?.languagesChecked || 0}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Missing Keys</span>
                <span className="text-white font-medium">{report.components.i18n.details?.missingKeys || 0}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00d4ff]" /> Performance & Network
              </h2>
              <StatusIcon status={report.components.performance?.status || 'healthy'} />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Network Status</span>
                <span className="text-white font-medium">{report.components.network.details?.online ? 'Online' : 'Offline'}</span>
              </div>
              {report.components.performance?.details && (
                <>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Memory Used</span>
                    <span className="text-white font-medium">{report.components.performance.details.memoryUsed}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-400">Memory Limit</span>
                    <span className="text-white font-medium">{report.components.performance.details.memoryLimit}</span>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;