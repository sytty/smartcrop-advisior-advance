import React from 'react';
import { Award, Star, Zap, TrendingUp , Droplets as DropletsIcon, Cpu as CpuIcon } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';

const Gamification = () => {
  return (
    <GlassCard className="p-6 mb-8 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Level 4: Master Farmer</h3>
            <p className="text-gray-400">2,450 Points • 3 Day Streak <Zap className="w-4 h-4 inline text-yellow-500" /></p>
          </div>
        </div>
        
        <div className="flex-1 w-full md:max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress to Level 5</span>
            <span className="text-yellow-400 font-bold">50 pts needed</span>
          </div>
          <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 w-[85%]" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30" title="Water Saver Badge">
            <DropletsIcon className="w-5 h-5 text-green-400" />
          </div>
          <div className="w-10 h-10 rounded-full bg-[#00d4ff]/20 flex items-center justify-center border border-[#00d4ff]/30" title="Tech Pioneer Badge">
            <CpuIcon className="w-5 h-5 text-[#00d4ff]" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 border-dashed text-gray-500">
            +3
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default Gamification;