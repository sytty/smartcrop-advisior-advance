import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check, X } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';

const SmartSuggestions = ({ suggestions = [] }) => {
  const [activeSuggestions, setActiveSuggestions] = useState(suggestions);

  const handleDismiss = (id) => {
    setActiveSuggestions(prev => prev.filter(s => s.id !== id));
  };

  if (activeSuggestions.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <AnimatePresence>
        {activeSuggestions.map((suggestion) => (
          <motion.div 
            key={suggestion.id}
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
          >
            <GlassCard className="p-6 border-[#b300ff]/40 bg-gradient-to-r from-[#b300ff]/10 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#b300ff]" />
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-[#b300ff]/20 text-[#b300ff] shrink-0">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Smart Suggestion</h3>
                    <p className="text-gray-300 text-lg">{suggestion.text}</p>
                    {suggestion.impact && (
                      <p className="text-[#00d4ff] font-medium mt-2">Expected Impact: {suggestion.impact}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleDismiss(suggestion.id)}
                    className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5 mr-2" /> Dismiss
                  </button>
                  <button 
                    onClick={() => handleDismiss(suggestion.id)}
                    className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#b300ff] hover:bg-[#9900cc] text-white font-bold transition-colors flex items-center justify-center shadow-[0_0_15px_rgba(179,0,255,0.4)]"
                  >
                    <Check className="w-5 h-5 mr-2" /> Apply Now
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SmartSuggestions;