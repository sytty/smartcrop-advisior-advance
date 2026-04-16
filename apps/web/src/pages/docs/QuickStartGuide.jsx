import React from 'react';
import { Helmet } from 'react-helmet';
import { Rocket, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { quickStart } from '@/lib/docs/quickStart.js';
import { Link } from 'react-router-dom';

const QuickStartGuide = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Quick Start - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00d4ff]/20 mb-6 glow-electric">
          <Rocket className="w-10 h-10 text-[#00d4ff]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Quick Start Guide</h1>
        <p className="text-xl text-gray-400">Get your farm set up in under 5 minutes.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Initial Setup</h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#00d4ff] before:to-transparent">
            {quickStart.setup.map((step, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0a0a0a] bg-[#00d4ff] text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_10px_rgba(0,212,255,0.5)] z-10">
                  {idx + 1}
                </div>
                <GlassCard className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6">
                  <p className="text-lg text-white">{step}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Your First Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickStart.firstActions.map((action, idx) => (
              <GlassCard key={idx} className="p-6 flex items-center gap-4 hover:border-[#00d4ff]/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <p className="text-lg text-gray-300">{action}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <div className="text-center pt-8">
          <Link to="/dashboard" className="inline-flex items-center px-8 py-4 rounded-xl bg-[#00d4ff] text-black font-bold text-lg hover:bg-[#00b3cc] transition-colors">
            Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickStartGuide;