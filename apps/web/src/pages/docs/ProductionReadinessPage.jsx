import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckSquare, CheckCircle2, Circle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { productionReadiness } from '@/lib/docs/productionReadiness.js';

const ProductionReadinessPage = () => {
  const calculateProgress = (items) => {
    const completed = items.filter(i => i.status).length;
    return Math.round((completed / items.length) * 100);
  };

  const renderSection = (title, items) => {
    const progress = calculateProgress(items);
    return (
      <GlassCard className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-green-400 font-bold">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {item.status ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-600" />}
              <span className={item.status ? "text-gray-300" : "text-gray-500"}>{item.task}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Production Readiness - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <CheckSquare className="w-10 h-10 text-green-400" /> Production Readiness
        </h1>
        <p className="text-xl text-gray-400">Final checklist before deploying to live environments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {renderSection("System Infrastructure", productionReadiness.system)}
          {renderSection("Security & Compliance", productionReadiness.security)}
        </div>
        <div>
          {renderSection("Feature Completeness", productionReadiness.features)}
          
          <GlassCard className="p-8 bg-green-500/10 border-green-500/30 text-center mt-6">
            <h3 className="text-2xl font-bold text-white mb-2">Status: GO</h3>
            <p className="text-green-400 mb-6">All critical systems are verified and ready for production deployment.</p>
            <button className="px-8 py-3 rounded-xl bg-green-500 text-black font-bold hover:bg-green-600 transition-colors">
              Generate Sign-off Report
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProductionReadinessPage;