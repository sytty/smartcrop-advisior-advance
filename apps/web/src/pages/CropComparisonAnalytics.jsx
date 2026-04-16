import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sprout, Download, Loader2, Filter } from 'lucide-react';
import { generateCropComparisonData } from '@/lib/mockData.js';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const CropComparisonAnalyticsContent = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState('Kharif');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (!mounted) return;
        
        const mockData = generateCropComparisonData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to load crop data");
        
        setData(mockData);
      } catch (err) {
        console.error("CropComparison Error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [season]);

  const handleExport = () => {
    toast.success(t('analytics.cropComparison.exportSuccess'));
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Sprout className="w-8 h-8 mr-3 text-yellow-500" />
            {t('analytics.cropComparison.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.cropComparison.subtitle')}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 w-full md:w-auto">
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('analytics.cropComparison.season')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              <SelectItem value="Kharif" className="text-white hover:bg-white/10">{t('analytics.cropComparison.kharif')}</SelectItem>
              <SelectItem value="Rabi" className="text-white hover:bg-white/10">{t('analytics.cropComparison.rabi')}</SelectItem>
              <SelectItem value="Zaid" className="text-white hover:bg-white/10">{t('analytics.cropComparison.zaid')}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> {t('common.export')}
          </Button>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.cropComparison.chartTitle')}</h3>
          <div className="h-[500px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="profitability" name={t('analytics.cropComparison.profitability')} fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="waterUsage" name={t('analytics.cropComparison.waterUsage')} fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

const CropComparisonAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.cropComparison.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="CropComparisonAnalytics">
        <CropComparisonAnalyticsContent />
      </ErrorBoundary>
    </div>
  );
};

export default CropComparisonAnalytics;