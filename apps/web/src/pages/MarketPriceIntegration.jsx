import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download, Loader2, DollarSign, BellRing } from 'lucide-react';
import { generateMarketPriceData } from '@/lib/mockData.js';
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

const MarketPriceIntegrationContent = () => {
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
        
        const mockData = generateMarketPriceData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to load market prices");
        
        setData(mockData);
      } catch (err) {
        console.error("MarketPrice Error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, []);

  const handleExport = () => {
    toast.success(t('analytics.marketPrices.exportSuccess'));
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-green-400" />
            {t('analytics.marketPrices.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.marketPrices.subtitle')}</p>
        </motion.div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <BellRing className="w-4 h-4 mr-2" /> {t('analytics.marketPrices.setAlerts')}
          </Button>
          <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> {t('analytics.marketPrices.exportPrices')}
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.marketPrices.chartTitle')}</h3>
          <div className="h-[500px] w-full">
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
                <Line type="monotone" dataKey="Wheat" name={t('analytics.marketPrices.wheat')} stroke="#eab308" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Rice" name={t('analytics.marketPrices.rice')} stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Cotton" name={t('analytics.marketPrices.cotton')} stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

const MarketPriceIntegration = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.marketPrices.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="MarketPriceIntegration">
        <MarketPriceIntegrationContent />
      </ErrorBoundary>
    </div>
  );
};

export default MarketPriceIntegration;