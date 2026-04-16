import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard.jsx';
import { expandedFAQ } from '@/lib/docs/expandedFAQ.js';

const ExpandedFAQPage = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...expandedFAQ.map(c => c.category)];

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Expanded FAQ - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <MessageCircle className="w-10 h-10 text-[#b300ff]" /> Comprehensive FAQ
        </h1>
        <p className="text-xl text-gray-400">Everything you ever wanted to know about the platform.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeCategory === cat 
                ? 'bg-[#b300ff] text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {expandedFAQ.filter(c => activeCategory === 'All' || c.category === activeCategory).map((category, idx) => (
          <div key={idx}>
            {activeCategory === 'All' && <h2 className="text-2xl font-bold text-white mb-4">{category.category}</h2>}
            <div className="space-y-4">
              {category.questions.map((faq, i) => {
                const id = `${idx}-${i}`;
                const isOpen = openId === id;
                
                if (search && !faq.q.toLowerCase().includes(search.toLowerCase()) && !faq.a.toLowerCase().includes(search.toLowerCase())) {
                  return null;
                }

                return (
                  <GlassCard key={i} className="p-0 overflow-hidden">
                    <button 
                      onClick={() => setOpenId(isOpen ? null : id)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-white pr-8">{faq.q}</h3>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#b300ff] shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />}
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/10 bg-black/20"
                        >
                          <div className="p-6 text-gray-300 leading-relaxed">{faq.a}</div>
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

export default ExpandedFAQPage;