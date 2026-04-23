import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, BrainCircuit, AlertCircle, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import GlassCard from '@/components/GlassCard.jsx';
import { toast } from 'sonner';
import DriftAlertBanner from '@/components/DriftAlertBanner.jsx';
import ModelPerformanceComparison from '@/components/ModelPerformanceComparison.jsx';
import ConfidenceScoreDistribution from '@/components/ConfidenceScoreDistribution.jsx';
import { useModelDriftDetection } from '@/hooks/useModelDriftDetection.js';
import { useTranslation } from 'react-i18next';

const ModelDriftDetection = () => {
  const { t } = useTranslation();
  const { getModelMetrics, calculateDriftStatus, loading } = useModelDriftDetection();
  const [metrics, setMetrics] = useState([]);
  const [currentMetric, setCurrentMetric] = useState(null);
  const [baselineMetric, setBaselineMetric] = useState(null);
  const [driftStatus, setDriftStatus] = useState({ status: 'healthy', triggered: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const data = await getModelMetrics(
          thirtyDaysAgo.toISOString().split('T')[0],
          today.toISOString().split('T')[0]
        );
        
        if (data && data.length > 0) {
          setMetrics(data);
          const latest = data[data.length - 1];
          const baseline = data[0];
          
          setCurrentMetric(latest);
          setBaselineMetric(baseline);
          
          const status = calculateDriftStatus(latest, baseline);
          setDriftStatus(status);
        }
      } catch (error) {
        console.error('[ModelDrift] Failed to fetch metrics:', error);
        toast.error('Unable to load model drift data');
      }
    };
    
    fetchData();
  }, [getModelMetrics, calculateDriftStatus]);

  const renderTrendIcon = (current, baseline) => {
    if (!current || !baseline) return null;
    const diff = current - baseline;
    if (diff > 0) return <TrendingUp className="w-4 h-4 text-green-400 ml-2" />;
    if (diff < 0) return <TrendingDown className="w-4 h-4 text-red-400 ml-2" />;
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('admin.model_drift.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <BrainCircuit className="w-8 h-8 mr-3 text-[#00d4ff]" />
              {t('admin.model_drift.title')}
            </h1>
            <p className="text-gray-400">{t('admin.model_drift.subtitle')}</p>
          </motion.div>
        </div>

        <DriftAlertBanner 
          status={driftStatus.status} 
          metrics={driftStatus.triggered} 
          onDismiss={() => setDriftStatus({ ...driftStatus, status: 'healthy' })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-400 mb-1">{t('admin.model_drift.currentAccuracy')}</p>
            <div className="flex items-end">
              <p className={`text-4xl font-bold font-variant-tabular ${getScoreColor(currentMetric?.accuracy || 0)}`}>
                {currentMetric?.accuracy || 0}%
              </p>
              {renderTrendIcon(currentMetric?.accuracy, baselineMetric?.accuracy)}
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-400 mb-1">{t('admin.model_drift.precision')}</p>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-white font-variant-tabular">
                {currentMetric?.precision || 0}%
              </p>
              {renderTrendIcon(currentMetric?.precision, baselineMetric?.precision)}
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-400 mb-1">{t('admin.model_drift.recall')}</p>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-white font-variant-tabular">
                {currentMetric?.recall || 0}%
              </p>
              {renderTrendIcon(currentMetric?.recall, baselineMetric?.recall)}
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-400 mb-1">{t('admin.model_drift.avgConfidence')}</p>
            <div className="flex items-end">
              <p className="text-3xl font-bold text-white font-variant-tabular">
                {currentMetric?.avg_confidence || 0}%
              </p>
              {renderTrendIcon(currentMetric?.avg_confidence, baselineMetric?.avg_confidence)}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <GlassCard className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">{t('admin.model_drift.trendChart')}</h3>
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{t('admin.model_drift.baseline')}: 92%</span>
            </div>
            <div className="h-[300px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-500">{t('common.loading')}</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="metric_date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickFormatter={(val) => val.substring(5)} />
                    <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[70, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#00d4ff' }}
                    />
                    <ReferenceLine y={92} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                    <ReferenceLine y={87} stroke="rgba(239,68,68,0.5)" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="accuracy" stroke="#00d4ff" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#00d4ff' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          <div className="lg:col-span-1">
            <ConfidenceScoreDistribution metrics={metrics} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ModelPerformanceComparison currentMetrics={currentMetric} baselineMetrics={baselineMetric} />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-[#00d4ff]" />
                {t('admin.model_drift.recommendations')}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">{t('admin.model_drift.status')}</p>
                  <p className={`font-medium ${driftStatus.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {driftStatus.status === 'healthy' ? t('admin.model_drift.healthy') : t('admin.model_drift.retrain')}
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">{t('admin.model_drift.dataQuality')}</p>
                  <p className="text-white font-medium">Sufficient new samples collected (1,240)</p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">{t('admin.model_drift.augmentation')}</p>
                  <p className="text-white font-medium text-sm">Focus on low-confidence classes (Stem Rust, Root Rot)</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelDriftDetection;