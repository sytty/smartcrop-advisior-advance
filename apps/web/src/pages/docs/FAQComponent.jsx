import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard.jsx';
import { faqDatabase } from '@/lib/docs/faqDatabase.js';

const FAQComponent = () => {
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(faqDatabase.map(f => f.category))];

  const filteredFaqs = faqDatabase.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>FAQ - Smart Crop Advisor Docs</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <MessageCircle className="w-10 h-10 text-[#b300ff]" /> Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-400">
          Quick answers to the most common questions from our farmers.
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search questions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-[#b300ff] transition-colors shadow-inner"
        />
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

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <GlassCard key={faq.id} className="p-0 overflow-hidden">
              <button 
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <h3 className="text-xl font-bold text-white pr-8">{faq.question}</h3>
                {openId === faq.id ? (
                  <ChevronUp className="w-6 h-6 text-[#b300ff] shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500 shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 bg-black/20"
                  >
                    <div className="p-6 text-lg text-gray-300 leading-relaxed">
                      {faq.answer}
                      
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-sm text-gray-500">Was this helpful?</span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded bg-white/5 hover:bg-green-500/20 hover:text-green-400 text-gray-400 text-sm transition-colors">Yes</button>
                          <button className="px-3 py-1 rounded bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 text-sm transition-colors">No</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500">No questions found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQComponent;