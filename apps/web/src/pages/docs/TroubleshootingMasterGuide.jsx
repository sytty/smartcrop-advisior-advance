import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Wrench, Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard.jsx';
import { troubleshootingMaster } from '@/lib/docs/troubleshootingMaster.js';

const TroubleshootingMasterGuide = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Troubleshooting - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Wrench className="w-10 h-10 text-red-400" /> Troubleshooting Guide
        </h1>
        <p className="text-xl text-gray-400">Find solutions to common problems quickly.</p>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input 
          type="text" 
          placeholder="Describe your problem (e.g., 'map slow')..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-red-400 transition-colors"
        />
      </div>

      <div className="space-y-10">
        {troubleshootingMaster.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-2xl font-bold text-white mb-4">{category.category}</h2>
            <div className="space-y-4">
              {category.problems.map((prob, i) => {
                const id = `${idx}-${i}`;
                const isOpen = openId === id;
                
                if (search && !prob.title.toLowerCase().includes(search.toLowerCase()) && !prob.symptoms.toLowerCase().includes(search.toLowerCase())) {
                  return null;
                }

                return (
                  <GlassCard key={i} className="p-0 overflow-hidden border-white/10">
                    <button 
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                        <h3 className="text-xl font-bold text-white">{prob.title}</h3>
                      </div>
                      {isOpen ? <ChevronUp className="w-6 h-6 text-gray-500" /> : <ChevronDown className="w-6 h-6 text-gray-500" />}
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <div className="p-6 space-y-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Symptoms</h4>
                              <p className="text-gray-300">{prob.symptoms}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Solutions</h4>
                              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                {prob.solutions.map((sol, j) => <li key={j}>{sol}</li>)}
                              </ol>
                            </div>
                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                              <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-1">When to contact support</h4>
                              <p className="text-red-200">{prob.whenToContact}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TroubleshootingMasterGuide;