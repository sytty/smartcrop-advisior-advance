import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Download, TrendingUp, Calculator } from 'lucide-react';
import { generateTreatmentCostData } from '@/lib/mockData.js';
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

const CostBenefitAnalysisContent = () => {
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
        
        const mockData = generateTreatmentCostData();
        if (!mockData || mockData.length === 0) throw new Error("Failed to load financial data");
        
        setData(mockData);
      } catch (err) {
        console.error("CostBenefit Error:", err);
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

  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  const totalBenefit = data.reduce((acc, curr) => acc + curr.benefit, 0);
  const roi = totalCost > 0 ? (((totalBenefit - totalCost) / totalCost) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-green-500" />
            {t('analytics.cost.title')}
          </h1>
          <p className="text-gray-400">{t('analytics.cost.subtitle')}</p>
        </motion.div>
        <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          <Download className="w-4 h-4 mr-2" /> {t('analytics.common.export')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.cost.totalCost')}</p>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-400">${totalCost.toLocaleString()}</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-6 rounded-2xl h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.cost.totalBenefit')}</p>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">${totalBenefit.toLocaleString()}</p>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 rounded-2xl border-green-500/30 h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{t('analytics.cost.roi')}</p>
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">+{roi}%</p>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <GlassCard className="p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white">{t('analytics.cost.chart')}</h3>
            <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-white hover:bg-white/5">
              <Calculator className="w-4 h-4 mr-2" /> {t('analytics.cost.planner')}
            </Button>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="cost" name="Cost ($)" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="benefit" name="Benefit ($)" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

const CostBenefitAnalysis = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>{t('analytics.cost.title')} - Smart Crop Advisor</title></Helmet>
      <ErrorBoundary componentName="CostBenefitAnalysis">
        <CostBenefitAnalysisContent />
      </ErrorBoundary>
    </div>
  );
};

export default CostBenefitAnalysis;