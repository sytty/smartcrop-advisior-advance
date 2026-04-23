import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Award, Download, Users, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import farmManagementApi from '@/lib/farmManagementApi.js';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
    </div>
    <div className="h-[500px] bg-white/5 rounded-2xl"></div>
  </div>
);

const FarmerPerformanceMetricsContent = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    score: 86,
    rank: 'Top 15%',
    strongest: 'Disease Control',
    metrics: {
      fields: 0,
      crops: 0,
      cropDiversity: 0,
      averageFieldHealth: 0,
      averageYield: 0,
      averageProfitability: 0,
      averageWaterUsage: 0,
      averageDiseaseRisk: 0,
      averagePestRisk: 0,
      recentFieldUpdates: 0,
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!mounted) return;
        const performance = await farmManagementApi.getPerformance({
          farmerId: currentUser.id,
          scope: 'all',
        });

        if (!performance?.radar || performance.radar.length === 0) throw new Error('Failed to load performance data');

        setData(performance.radar);
        setSummary({
          score: performance.score,
          rank: performance.rank,
          strongest: performance.strongest,
          metrics: performance.metrics,
        });
      } catch (err) {
        console.error("FarmerPerformance Error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleExport = () => {
    toast.success(t('analytics.common.export') + ' successful');
  };

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) return <DashboardSkeleton />;
  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Award className="w-8 h-8 mr-3 text-purple-500" />
            {t('analytics.performance.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.performance.subtitle')}</p>
        </motion.div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.performance.score')}</p>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{summary.score}<span className="text-lg text-gray-400 font-normal">/100</span></p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.performance.rank')}</p>
              <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#00d4ff]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#00d4ff]">{summary.rank}</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.performance.strongest')}</p>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-400">{summary.strongest}</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Fields', value: summary.metrics.fields },
          { label: 'Crops', value: summary.metrics.crops },
          { label: 'Crop Diversity', value: summary.metrics.cropDiversity },
          { label: 'Avg Field Health', value: `${summary.metrics.averageFieldHealth}%` },
          { label: 'Avg Profitability', value: `${summary.metrics.averageProfitability}%` },
          { label: 'Recent Updates', value: summary.metrics.recentFieldUpdates },
        ].map((item) => (
          <GlassCard key={item.label} className="p-4 rounded-2xl">
            <p className="text-xs uppercase tracking-[0.12em] text-gray-400 mb-1">{item.label}</p>
            <p className="text-xl font-bold text-white">{item.value}</p>
          </GlassCard>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <GlassCard className="p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.performance.radar')}</h3>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 14 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Radar name="Farmer Score" dataKey="A" stroke="#a855f7" strokeWidth={2} fill="#a855f7" fillOpacity={0.5} />
                <Radar name="Regional Avg" dataKey="B" stroke="#00d4ff" strokeWidth={2} fill="#00d4ff" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

const FarmerPerformanceMetrics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.performance.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="FarmerPerformanceMetrics">
        <FarmerPerformanceMetricsContent />
      </ErrorBoundary>
    </div>
  );
};

export default FarmerPerformanceMetrics;