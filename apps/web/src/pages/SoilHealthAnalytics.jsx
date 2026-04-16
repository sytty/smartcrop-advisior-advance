import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Activity, Download, Droplets, FlaskConical, Leaf } from 'lucide-react';
import { generateSoilHealthData } from '@/lib/mockData.js';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="h-[400px] bg-white/5 rounded-2xl lg:col-span-2"></div>
      <div className="h-[400px] bg-white/5 rounded-2xl"></div>
    </div>
  </div>
);

const SoilHealthAnalyticsContent = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (!mounted) return;
        
        const mockData = generateSoilHealthData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to load soil data");
        
        setData(mockData);
      } catch (err) {
        console.error("SoilHealth Error:", err);
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

  if (isLoading) return <DashboardSkeleton />;
  if (error) throw new Error(error);

  const latestData = data[data.length - 1] || { score: 0, ph: 0, nitrogen: 0, moisture: 0 };
  
  const gaugeData = [
    { name: 'Score', value: latestData.score },
    { name: 'Remaining', value: 100 - latestData.score }
  ];
  const COLORS = [latestData.score > 80 ? '#22c55e' : latestData.score > 60 ? '#eab308' : '#ef4444', 'rgba(255,255,255,0.05)'];

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Activity className="w-8 h-8 mr-3 text-[#22c55e]" />
            {t('analytics.soil.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.soil.subtitle')}</p>
        </motion.div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.soil.score')}</p>
              <Activity className="w-5 h-5 text-[#22c55e]" />
            </div>
            <p className="text-3xl font-bold text-[#22c55e]">{latestData.score}<span className="text-lg text-gray-400 font-normal">/100</span></p>
          </GlassCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.soil.ph')}</p>
              <FlaskConical className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white">{latestData.ph}</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.soil.nitrogen')}</p>
              <Leaf className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{latestData.nitrogen} <span className="text-sm text-gray-400">mg/kg</span></p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.soil.moisture')}</p>
              <Droplets className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <p className="text-3xl font-bold text-[#00d4ff]">{latestData.moisture || 42}%</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
          <GlassCard className="p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.soil.trends')}</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="nitrogen" name="Nitrogen (N)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="phosphorus" name="Phosphorus (P)" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="potassium" name="Potassium (K)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          <GlassCard className="p-6 rounded-2xl h-full flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-white mb-2 w-full text-left">{t('analytics.soil.index')}</h3>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-16">
                <span className="text-5xl font-bold text-white">{latestData.score}</span>
                <span className="text-sm text-gray-400">/ 100</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

const SoilHealthAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.soil.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="SoilHealthAnalytics">
        <SoilHealthAnalyticsContent />
      </ErrorBoundary>
    </div>
  );
};

export default SoilHealthAnalytics;