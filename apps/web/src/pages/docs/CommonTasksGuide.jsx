import React from 'react';
import { Helmet } from 'react-helmet';
import { CheckSquare, ArrowRight, Lightbulb } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { commonTasks } from '@/lib/docs/commonTasks.js';

const CommonTasksGuide = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Common Tasks - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <CheckSquare className="w-10 h-10 text-green-400" /> Common Tasks Guide
        </h1>
        <p className="text-xl text-gray-400">Step-by-step instructions for the things you'll do most often.</p>
      </div>

      <div className="space-y-12">
        {commonTasks.map((task, idx) => (
          <section key={task.id} className="relative">
            <div className="absolute -left-4 md:-left-12 top-0 text-6xl font-bold text-white/5 select-none">
              {String(idx + 1).padStart(2, '0')}
            </div>
            <GlassCard className="p-8 relative z-10 border-white/10 hover:border-green-500/30 transition-colors">
              <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
              <p className="text-gray-400 mb-6">{task.overview}</p>
              
              <div className="bg-black/40 rounded-xl p-6 mb-6">
                <ol className="space-y-4">
                  {task.steps.map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-sm font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-300 text-lg">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Expected Result</h4>
                  <p className="text-white">{task.results}</p>
                </div>
                <div className="flex-1 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                  <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" /> Pro Tip
                  </h4>
                  <p className="text-yellow-100">{task.tips}</p>
                </div>
              </div>
            </GlassCard>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CommonTasksGuide;