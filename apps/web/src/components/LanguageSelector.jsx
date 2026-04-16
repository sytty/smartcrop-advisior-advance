import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < filteredLanguages.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredLanguages.length) {
          handleSelect(filteredLanguages[focusedIndex].code);
        }
        break;
      default:
        break;
    }
  };

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card hover:border-[#00d4ff]/50 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-[#00d4ff] focus-visible:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select Language. Current language is ${currentLang.name}`}
      >
        <Globe className="w-4 h-4 text-[#00d4ff] group-hover:animate-pulse" />
        <span className="text-sm font-medium text-white hidden sm:block">{currentLang.native}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 glass-card-neon rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            role="listbox"
            aria-label="Language options"
          >
            <div className="p-3 border-b border-white/10 bg-black/40" dir="ltr">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
                  aria-label="Search languages"
                />
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-2 custom-scrollbar" dir="ltr">
              {filteredLanguages.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No languages found</div>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {filteredLanguages.map((lang, index) => {
                    const isSelected = i18n.language === lang.code;
                    const isFocused = focusedIndex === index;
                    return (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(lang.code)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          isSelected 
                            ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30' 
                            : isFocused
                              ? 'bg-white/10 text-white border border-white/20'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{lang.native}</span>
                            <span className="text-xs opacity-60">{lang.name}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="p-2 border-t border-white/10 bg-black/40 text-center" dir="ltr">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">16 Languages Available</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;