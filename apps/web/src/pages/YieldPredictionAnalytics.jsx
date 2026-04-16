import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download, Sprout, AlertTriangle, Filter } from 'lucide-react';
import { generateYieldPredictionData } from '@/lib/mockData.js';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="flex justify-between items-center">
      <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
      <div className="h-10 bg-white/5 rounded-xl w-32"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-[400px] bg-white/5 rounded-2xl"></div>
      <div className="h-[400px] bg-white/5 rounded-2xl"></div>
    </div>
  </div>
);

const YieldPredictionAnalyticsContent = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('All Crops');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (!mounted) return;
        
        const mockData = generateYieldPredictionData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to generate yield data");
        
        setData(mockData);
        setError(null);
      } catch (err) {
        console.error("YieldPrediction Error:", err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [selectedCrop]);

  const handleExport = () => {
    toast.success(t('analytics.common.export') + ' successful');
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error) throw new Error(error);

  const latestPrediction = data[data.length - 1]?.predicted || 0;
  const previousPrediction = data[data.length - 2]?.predicted || 0;
  const trend = ((latestPrediction - previousPrediction) / previousPrediction * 100).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('analytics.yield.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.yield.subtitle')}</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 w-full md:w-auto">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('analytics.common.filter')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              <SelectItem value="All Crops" className="text-white hover:bg-white/10">All Crops</SelectItem>
              <SelectItem value="Wheat" className="text-white hover:bg-white/10">Wheat</SelectItem>
              <SelectItem value="Rice" className="text-white hover:bg-white/10">Rice</SelectItem>
              <SelectItem value="Cotton" className="text-white hover:bg-white/10">Cotton</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.yield.predicted')}</h3>
              <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-[#00d4ff]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{latestPrediction.toLocaleString()} <span className="text-lg text-gray-400 font-normal">kg/ha</span></p>
              <p className={`text-sm mt-2 ${Number(trend) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Number(trend) >= 0 ? '+' : ''}{trend}%
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.yield.confidence')}</h3>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">89%</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 rounded-2xl border-orange-500/30 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.yield.risk')}</h3>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-white">Low Soil Moisture</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.yield.chart1')}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="predicted" name="Predicted (kg)" stroke="#00d4ff" strokeWidth={3} dot={{ r: 4, fill: '#00d4ff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="actual" name="Actual (kg)" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.yield.chart2')}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="actual" name="Actual Yield (kg)" fill="#00d4ff" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

const YieldPredictionAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.yield.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="YieldPredictionAnalytics">
        <YieldPredictionAnalyticsContent />
      </ErrorBoundary>
    </div>
  );
};

export default YieldPredictionAnalytics;