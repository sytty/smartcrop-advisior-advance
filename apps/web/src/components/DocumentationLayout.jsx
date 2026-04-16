import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { BookOpen, Video, MessageCircle, FileText, Wrench, ShieldCheck, Smartphone, Search, Menu, X, ChevronRight } from 'lucide-react';
import DocumentationSearch from './DocumentationSearch.jsx';

const DocumentationLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { name: 'Documentation Hub', path: '/docs', icon: BookOpen },
    { name: 'User Guides', path: '/docs/guides', icon: FileText },
    { name: 'Video Tutorials', path: '/docs/videos', icon: Video },
    { name: 'FAQ', path: '/docs/faq', icon: MessageCircle },
    { name: 'Troubleshooting', path: '/docs/troubleshooting', icon: Wrench },
    { name: 'Glossary', path: '/docs/glossary', icon: BookOpen },
    { name: 'Accessibility Guide', path: '/docs/accessibility', icon: ShieldCheck },
    { name: 'Mobile Guide', path: '/docs/mobile', icon: Smartphone },
  ];

  // Keyboard shortcut for search (Ctrl + /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const SidebarContent = () => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/docs' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive 
                ? 'bg-primary/10 text-primary font-bold border border-primary/30' 
                : 'text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col md:flex-row">
      <DocumentationSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/70 bg-card/90 backdrop-blur sticky top-16 z-30">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <BookOpen className="w-5 h-5 text-primary" /> Docs
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsSearchOpen(true)} className="p-2 text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground hover:text-foreground">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[120px] z-40 bg-background p-4 overflow-y-auto">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 shrink-0 border-r border-border/70 bg-card/70 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto custom-scrollbar p-6 backdrop-blur">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 mb-8 rounded-xl bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search docs...</span>
          </div>
          <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs bg-background rounded border border-border/80 group-hover:border-primary/40">Ctrl + /</kbd>
        </button>
        
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-4">Documentation</h3>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            {location.pathname !== '/docs' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary capitalize">
                  {location.pathname.split('/').pop().replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DocumentationLayout;