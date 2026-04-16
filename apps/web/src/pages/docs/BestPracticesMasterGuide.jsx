import React from 'react';
import { Helmet } from 'react-helmet';
import { Star, CheckCircle2, XCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { bestPracticesMaster } from '@/lib/docs/bestPracticesMaster.js';

const BestPracticesMasterGuide = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Best Practices - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Star className="w-10 h-10 text-yellow-400" /> Best Practices
        </h1>
        <p className="text-xl text-gray-400">Proven strategies from our most successful farmers.</p>
      </div>

      <div className="space-y-12">
        {bestPracticesMaster.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
              {category.category}
            </h2>
            <div className="space-y-6">
              {category.practices.map((practice, i) => (
                <GlassCard key={i} className="p-0 overflow-hidden">
                  <div className="p-6 border-b border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold text-white">{practice.title}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-6 bg-green-500/5">
                      <h4 className="text-green-400 font-bold flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5" /> DO
                      </h4>
                      <p className="text-gray-300">{practice.do}</p>
                    </div>
                    <div className="p-6 bg-red-500/5">
                      <h4 className="text-red-400 font-bold flex items-center gap-2 mb-3">
                        <XCircle className="w-5 h-5" /> DON'T
                      </h4>
                      <p className="text-gray-300">{practice.dont}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 text-center text-sm text-gray-400">
                    <strong className="text-white">Benefit:</strong> {practice.benefit}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestPracticesMasterGuide;