import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Layout, CheckCircle2, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { dashboardDescriptions } from '@/lib/docs/dashboardDescriptions.js';

const DashboardDescriptionPage = () => {
  const [activeDash, setActiveDash] = useState(dashboardDescriptions[0]);

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Dashboard Details - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Layout className="w-10 h-10 text-[#b300ff]" /> Dashboard Descriptions
        </h1>
        <p className="text-xl text-gray-400">Detailed breakdowns of every tool in the platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Selector */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {dashboardDescriptions.map(dash => (
            <button
              key={dash.id}
              onClick={() => setActiveDash(dash)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium ${
                activeDash.id === dash.id 
                  ? 'bg-[#b300ff] text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {dash.name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <GlassCard className="p-8 border-[#b300ff]/30">
            <h2 className="text-3xl font-bold text-white mb-4">{activeDash.name}</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">{activeDash.overview}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                <ul className="space-y-3">
                  {activeDash.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 rounded-full bg-[#b300ff]" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Benefits</h3>
                <ul className="space-y-3">
                  {activeDash.benefits.map((ben, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400" /> {ben}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 bg-white/5">
            <h3 className="text-xl font-bold text-white mb-4">Real-World Example</h3>
            <p className="text-lg text-gray-400 italic border-l-4 border-gray-500 pl-4">
              "{activeDash.example}"
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardDescriptionPage;