import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Map, AlertTriangle, Activity, ShieldCheck, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { systemMetrics } from '@/lib/mockData.js';
import GlassCard from '@/components/GlassCard.jsx';
import { useModelMetricsSeeding } from '@/hooks/useModelMetricsSeeding.js';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { seedMetricsIfEmpty } = useModelMetricsSeeding();

  useEffect(() => {
    seedMetricsIfEmpty();
  }, [seedMetricsIfEmpty]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('admin.admin_dashboard.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.admin_dashboard.title')}</h1>
          <p className="text-gray-400">{t('admin.admin_dashboard.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.totalFarmers')}</p>
              <p className="text-2xl font-bold text-white">{systemMetrics.totalFarmers}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-[#1a4d2e]/40 flex items-center justify-center mr-4">
              <Map className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.monitoredFields')}</p>
              <p className="text-2xl font-bold text-white">{systemMetrics.totalFields}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.activeAlerts')}</p>
              <p className="text-2xl font-bold text-white">{systemMetrics.activeAlerts}</p>
            </div>
          </GlassCard>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">{t('admin.admin_dashboard.modulesTitle')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/regional-monitoring">
            <GlassCard hover className="h-full p-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#00d4ff]/20 transition-colors">
                <Map className="w-8 h-8 text-gray-400 group-hover:text-[#00d4ff] transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('admin.admin_dashboard.regionalMonitoring')}</h3>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.regionalMonitoringDesc')}</p>
            </GlassCard>
          </Link>

          <Link to="/digital-twin">
            <GlassCard hover className="h-full p-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#1a4d2e]/40 transition-colors">
                <Activity className="w-8 h-8 text-gray-400 group-hover:text-[#22c55e] transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('admin.admin_dashboard.digitalTwin')}</h3>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.digitalTwinDesc')}</p>
            </GlassCard>
          </Link>

          <Link to="/audit-dashboard">
            <GlassCard hover className="h-full p-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <ShieldCheck className="w-8 h-8 text-gray-400 group-hover:text-yellow-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('admin.admin_dashboard.auditDashboard')}</h3>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.auditDashboardDesc')}</p>
            </GlassCard>
          </Link>

          <Link to="/model-drift-detection">
            <GlassCard hover className="h-full p-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                <BrainCircuit className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('admin.admin_dashboard.modelDrift')}</h3>
              <p className="text-sm text-gray-400">{t('admin.admin_dashboard.modelDriftDesc')}</p>
            </GlassCard>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;