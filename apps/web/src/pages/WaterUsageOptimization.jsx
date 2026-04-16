import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Droplets, Download, Loader2, Info } from 'lucide-react';
import { generateWaterUsageData } from '@/lib/mockData.js';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
    <div className="h-[500px] bg-white/5 rounded-2xl"></div>
  </div>
);

const WaterUsageOptimizationContent = () => {
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
        
        const mockData = generateWaterUsageData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to load water usage data");
        
        setData(mockData);
      } catch (err) {
        console.error("WaterUsage Error:", err);
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

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Droplets className="w-8 h-8 mr-3 text-blue-400" />
            {t('analytics.water.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.water.subtitle')}</p>
        </motion.div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">{t('analytics.water.chart')}</h3>
            <div className="flex items-center text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Info className="w-4 h-4 mr-2 text-[#00d4ff]" />
              {t('analytics.water.efficiency')}: <span className="text-white font-bold ml-1">82/100</span>
            </div>
          </div>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="usage" name="Actual Usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                <Area type="monotone" dataKey="requirement" name="Requirement" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

const WaterUsageOptimization = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.water.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="WaterUsageOptimization">
        <WaterUsageOptimizationContent />
      </ErrorBoundary>
    </div>
  );
};

export default WaterUsageOptimization;