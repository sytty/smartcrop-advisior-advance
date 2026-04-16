import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Award, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';

const FinalSummaryPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Final Summary - Smart Crop Advisor</title></Helmet>
      
      <div className="text-center mb-16 pt-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#b300ff] mb-8 glow-purple">
          <Award className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
          You're Ready to Grow.
        </h1>
        <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          You've explored the documentation, understood the architecture, and seen the power of Smart Crop Advisor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <GlassCard className="p-8 text-center border-[#00d4ff]/30">
          <h3 className="text-5xl font-bold text-[#00d4ff] mb-4">15</h3>
          <p className="text-xl text-white font-medium">Powerful Dashboards</p>
        </GlassCard>
        <GlassCard className="p-8 text-center border-green-500/30">
          <h3 className="text-5xl font-bold text-green-400 mb-4">100%</h3>
          <p className="text-xl text-white font-medium">Production Ready</p>
        </GlassCard>
        <GlassCard className="p-8 text-center border-[#b300ff]/30">
          <h3 className="text-5xl font-bold text-[#b300ff] mb-4">24/7</h3>
          <p className="text-xl text-white font-medium">AI Monitoring</p>
        </GlassCard>
      </div>

      <GlassCard className="p-12 bg-gradient-to-br from-white/5 to-transparent text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">What's Next?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/dashboard" className="px-8 py-4 rounded-xl bg-[#00d4ff] text-black font-bold text-lg hover:bg-[#00b3cc] transition-colors flex items-center justify-center">
            Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link to="/docs/downloads" className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-colors flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" /> Download Full Guide
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default FinalSummaryPage;