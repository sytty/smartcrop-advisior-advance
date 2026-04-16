import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Leaf, DollarSign, PlayCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/hooks/useTutorial.jsx';
import SmartSuggestions from '@/components/SmartSuggestions.jsx';
import SmartAlerts from '@/components/SmartAlerts.jsx';
import Gamification from '@/components/Gamification.jsx';
import ExportShare from '@/components/ExportShare.jsx';

const CarbonFootprintTracker = () => {
  const { startTutorial } = useTutorial();

  useEffect(() => {
    if (!localStorage.getItem('tutorial_completed_carbon')) startTutorial('carbon');
  }, [startTutorial]);

  const alerts = [];
  const suggestions = [{ id: 1, text: 'Switching to a solar water pump will earn you 15 extra carbon credits per year.', impact: '+$450/year in credits' }];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet><title>Carbon Tracker - Smart Crop Advisor</title></Helmet>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Leaf className="w-10 h-10 mr-3 text-green-400" /> Carbon Tracker & Rewards
            </h1>
            <p className="text-xl text-gray-400">See how eco-friendly your farm is and earn money for good practices.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => startTutorial('carbon')} className="bg-white/5 border-white/10 text-white"><PlayCircle className="w-4 h-4 mr-2" /> Tutorial</Button>
            <ExportShare />
          </div>
        </div>

        <Gamification />
        <SmartAlerts alerts={alerts} />
        <SmartSuggestions suggestions={suggestions} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-12 text-center border-green-500/30 glass-card-neon flex flex-col justify-center">
            <h2 className="text-3xl text-gray-400 mb-6">Carbon Credits Earned</h2>
            <p className="text-8xl font-bold text-[#00d4ff] mb-6">45</p>
            <p className="text-2xl text-white mb-10">You earned these by using less tractor fuel and planting cover crops.</p>
            <Button className="bg-green-500 text-black hover:bg-green-600 text-2xl h-16 rounded-xl font-bold w-full">
              <DollarSign className="w-8 h-8 mr-2" /> Sell Credits for $1,350
            </Button>
          </GlassCard>

          <GlassCard className="p-10">
            <h2 className="text-3xl font-bold text-white mb-8">How to earn more money</h2>
            <div className="space-y-6">
              <div className="bg-white/5 p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-3">Plant Trees on Edges</h3>
                <p className="text-gray-400 text-xl mb-4 leading-relaxed">Planting trees around your field borders captures a lot of carbon.</p>
                <p className="text-green-400 font-bold text-xl">Earns ~10 extra credits per year</p>
              </div>
              <div className="bg-white/5 p-8 rounded-xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-3">Use Solar Water Pumps</h3>
                <p className="text-gray-400 text-xl mb-4 leading-relaxed">Switching from diesel to solar pumps stops pollution completely.</p>
                <p className="text-green-400 font-bold text-xl">Earns ~15 extra credits per year</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintTracker;