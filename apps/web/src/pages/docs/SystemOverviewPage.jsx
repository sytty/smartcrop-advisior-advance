import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2, Zap, Shield, Smartphone } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { systemOverview } from '@/lib/docs/systemOverview.js';

const SystemOverviewPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>System Overview - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">System Overview</h1>
        <p className="text-2xl text-gray-300 leading-relaxed border-l-4 border-[#00d4ff] pl-6">
          {systemOverview.intro.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <GlassCard className="p-8 bg-gradient-to-br from-[#00d4ff]/10 to-transparent border-[#00d4ff]/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#00d4ff]" /> Getting Started
          </h2>
          <div className="space-y-6">
            {systemOverview.gettingStarted.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#00d4ff] text-black font-bold flex items-center justify-center shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500/20 text-green-400"><Shield className="w-8 h-8" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Secure & Private</h3>
              <p className="text-gray-400">Your farm data is encrypted and never shared.</p>
            </div>
          </GlassCard>
          <GlassCard className="p-6 flex items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500/20 text-purple-400"><Smartphone className="w-8 h-8" /></div>
            <div>
              <h3 className="text-xl font-bold text-white">Mobile Ready</h3>
              <p className="text-gray-400">Works offline in the field. Syncs when connected.</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-6">Core Dashboards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systemOverview.dashboards.map((dash, idx) => (
          <GlassCard key={idx} className="p-6 hover:border-white/30 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">{dash.name}</h3>
            <p className="text-gray-400">{dash.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default SystemOverviewPage;