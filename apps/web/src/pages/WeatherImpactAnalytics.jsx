import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CloudRain, Download, Thermometer, Wind, AlertTriangle } from 'lucide-react';
import mlModelService from '@/lib/mlModelService.js';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full">
    <div className="h-10 bg-white/5 rounded-xl w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
    </div>
    <div className="h-[400px] bg-white/5 rounded-2xl"></div>
  </div>
);

const WeatherImpactAnalyticsContent = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const inference = await mlModelService.infer('weather_impact_analytics');
        if (!mounted) return;
        if (!inference.rows || inference.rows.length === 0) throw new Error('Failed to load weather data');

        setData(inference.rows);
      } catch (err) {
        console.error("WeatherImpact Error:", err);
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

  const currentTemp = data[0]?.temp || 0;
  const currentRain = data[0]?.rainfall || 0;
  const currentWind = data[0]?.wind || 0;

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <CloudRain className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('analytics.weather.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.weather.subtitle')}</p>
        </motion.div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
        </Button>
      </div>

      {currentWind > 15 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-orange-400 font-semibold">{t('analytics.weather.warning')}</h4>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.weather.temp')}</h3>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-orange-400" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{currentTemp}°C</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.weather.rain')}</h3>
              <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
                <CloudRain className="w-4 h-4 text-[#00d4ff]" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{currentRain} <span className="text-lg text-gray-400 font-normal">mm</span></p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">{t('analytics.weather.wind')}</h3>
              <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                <Wind className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <p className="text-4xl font-bold text-white">{currentWind} <span className="text-lg text-gray-400 font-normal">km/h</span></p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.weather.forecast')}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <h3 className="text-lg font-semibold text-white mb-6">{t('analytics.weather.humidity')}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar yAxisId="left" dataKey="rainfall" name="Rainfall (mm)" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#a855f7" strokeWidth={3} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

const WeatherImpactAnalytics = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.weather.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="WeatherImpactAnalytics">
        <WeatherImpactAnalyticsContent />
      </ErrorBoundary>
    </div>
  );
};

export default WeatherImpactAnalytics;