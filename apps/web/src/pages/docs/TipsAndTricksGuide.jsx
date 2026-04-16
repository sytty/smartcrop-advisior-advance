import React from 'react';
import { Helmet } from 'react-helmet';
import { Zap, Star } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { tipsAndTricks } from '@/lib/docs/tipsAndTricks.js';

const TipsAndTricksGuide = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Tips & Tricks - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Zap className="w-10 h-10 text-yellow-400" /> Tips & Tricks
        </h1>
        <p className="text-xl text-gray-400">Work faster and smarter with these pro tips.</p>
      </div>

      <div className="space-y-12">
        {tipsAndTricks.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">
              {category.category}
            </h2>
            <div className="columns-1 md:columns-2 gap-6 space-y-6">
              {category.tips.map((tip, i) => (
                <GlassCard key={i} className="p-6 break-inside-avoid">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-white">{tip.title}</h3>
                    {tip.isPro && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 flex items-center gap-1">
                        <Star className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 leading-relaxed">{tip.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipsAndTricksGuide;