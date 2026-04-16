import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Search, BookOpen, Video, MessageCircle, ChevronRight, ExternalLink } from 'lucide-react';
import { useHelp } from '@/hooks/useHelp.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocation, useNavigate } from 'react-router-dom';

export const HelpTooltip = ({ children, content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="bg-[#0a0a0a] border border-white/20 text-white p-3 max-w-xs rounded-xl shadow-xl">
        <p className="text-sm leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const HelpSystem = () => {
  const { isOpen, closeHelp, openHelp, searchQuery, setSearchQuery } = useHelp();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine current dashboard context
  const currentPath = location.pathname.split('/')[1];
  const hasSpecificDocs = ['ai-crop-advisor', 'smart-irrigation', 'drone-monitoring'].includes(currentPath);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      closeHelp();
      // In a real app, this would navigate to search results or open the command palette
      navigate('/docs'); 
    }
  };

  return (
    <>
      <button 
        onClick={() => openHelp('general')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#00d4ff] text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-110 transition-transform z-40"
        aria-label="Open Help"
      >
        <HelpCircle className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={closeHelp}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#00d4ff]" /> Help Center
                </h2>
                <button onClick={closeHelp} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search documentation... (Press Enter)" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00d4ff] transition-colors"
                  />
                </div>

                {/* Contextual Help Section */}
                {hasSpecificDocs && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-[#00d4ff] uppercase tracking-wider mb-3">Resources for this page</h3>
                    <div className="space-y-2">
                      <button onClick={() => { navigate(`/docs/guides/${currentPath}`); closeHelp(); }} className="w-full flex items-center justify-between p-3 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30 hover:bg-[#00d4ff]/20 transition-colors text-left">
                        <span className="text-white font-medium flex items-center gap-2"><BookOpen className="w-4 h-4" /> Read the User Guide</span>
                        <ExternalLink className="w-4 h-4 text-[#00d4ff]" />
                      </button>
                      <button onClick={() => { navigate(`/docs/videos`); closeHelp(); }} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left">
                        <span className="text-white font-medium flex items-center gap-2"><Video className="w-4 h-4" /> Watch Video Tutorial</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Documentation Hub</h3>
                <div className="space-y-2 mb-8">
                  <button onClick={() => { navigate('/docs'); closeHelp(); }} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-white font-medium">Main Documentation</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </button>
                  <button onClick={() => { navigate('/docs/faq'); closeHelp(); }} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      <span className="text-white font-medium">Frequently Asked Questions</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                  </button>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-[#b300ff]/20 to-transparent border border-[#b300ff]/30 text-center mt-auto">
                  <h3 className="text-xl font-bold text-white mb-2">Still stuck?</h3>
                  <p className="text-gray-400 mb-4 text-sm">Our support team is ready to assist you.</p>
                  <button className="w-full py-3 rounded-xl bg-[#b300ff] text-white font-bold hover:bg-[#9900cc] transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpSystem;