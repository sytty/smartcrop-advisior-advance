import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, BookOpen } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { glossaryDatabase } from '@/lib/docs/glossary.js';

const GlossaryComponent = () => {
  const [search, setSearch] = useState('');

  const filteredTerms = glossaryDatabase.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) || 
    item.definition.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.term.localeCompare(b.term));

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Glossary - Smart Crop Advisor Docs</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-[#00d4ff]" /> Glossary of Terms
        </h1>
        <p className="text-xl text-gray-400">
          Simple, plain-English definitions for all the technical words used in the app.
        </p>
      </div>

      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for a word (e.g., NDVI, Blockchain)..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-gray-500 focus:outline-none focus:border-[#00d4ff] transition-colors shadow-inner"
        />
      </div>

      <div className="space-y-6">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => (
            <GlassCard key={idx} className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">{item.term}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
              </div>
              
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {item.definition}
              </p>
              
              <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-4">
                <strong className="text-white block mb-1">Example:</strong>
                <p className="text-gray-400 italic">"{item.example}"</p>
              </div>

              {item.related && item.related.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-500">Related:</span>
                  <div className="flex flex-wrap gap-2">
                    {item.related.map((rel, i) => (
                      <span key={i} className="text-sm text-[#00d4ff] hover:underline cursor-pointer">
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500">No terms found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlossaryComponent;