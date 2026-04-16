import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Rocket } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { productionReadinessChecker } from '@/lib/productionReadinessChecker';

const ProductionReadinessPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(productionReadinessChecker.check());
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Production Readiness</h1>
          <p className="text-gray-400">Final checklist before deployment to production.</p>
        </div>
        <div className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${data.decision === 'GO' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
          <Rocket className="w-5 h-5" /> {data.decision} DECISION
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {data.categories.map((cat, idx) => (
            <GlassCard key={idx} className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                {cat.status === 'pass' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                {cat.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-500/70" /> {item}
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Deployment Guide</h2>
            <div className="space-y-4">
              {data.deploymentGuide.map((step, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300">
                  {step}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProductionReadinessPage;