import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, Video, MessageCircle, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DocumentationSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Mock search results based on query
  const getResults = () => {
    if (!query) return [];
    const q = query.toLowerCase();
    return [
      { id: 1, type: 'guide', title: 'AI Crop Advisor Guide', desc: 'Learn how to use AI to choose crops.', url: '/docs/guides/ai-crop-advisor', icon: BookOpen },
      { id: 2, type: 'video', title: 'Setting up Smart Irrigation', desc: 'Video tutorial on automatic watering.', url: '/docs/videos', icon: Video },
      { id: 3, type: 'faq', title: 'How accurate are recommendations?', desc: 'FAQ about AI accuracy.', url: '/docs/faq', icon: MessageCircle },
      { id: 4, type: 'glossary', title: 'NDVI (Definition)', desc: 'Normalized Difference Vegetation Index.', url: '/docs/glossary', icon: FileText },
    ].filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));
  };

  const results = getResults();

  // Handle keyboard shortcut (Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          <div className="flex items-center px-4 border-b border-white/10 bg-white/5">
            <Search className="w-6 h-6 text-[#00d4ff]" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search guides, videos, FAQs, and terms..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white text-lg py-5 px-4 focus:outline-none placeholder:text-gray-500"
            />
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-2">
            {query === '' ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Type something to search the documentation...</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm">Try "Irrigation"</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm">Try "Drone"</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-sm">Try "NDVI"</span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((res) => (
                  <button 
                    key={res.id}
                    onClick={() => { navigate(res.url); onClose(); }}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff]">
                        <res.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg">{res.title}</h4>
                        <p className="text-gray-400 text-sm">{res.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#00d4ff] transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg">No results found for "{query}"</p>
                <p className="text-sm mt-2">Try using different keywords or check your spelling.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/10 bg-black/50 text-xs text-gray-500 flex justify-between items-center">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Esc</kbd> to close</span>
            <span>Search powered by Smart Crop AI</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentationSearch;