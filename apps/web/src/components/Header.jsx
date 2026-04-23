import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, LogOut, User, Database, ChevronDown, BarChart2, Cpu, Sparkles, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import ConnectionStatusBadge from './ConnectionStatusBadge.jsx';
import { useOfflineSync } from '@/hooks/useOfflineSync.js';
import { useBackendStatus } from '@/hooks/useBackendStatus.js';
import LanguageSelector from './LanguageSelector.jsx';
import NotificationCenterButton from './NotificationCenterButton.jsx';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [futuristicOpen, setFuturisticOpen] = useState(false);
  const [farmOpen, setFarmOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, currentUser, logout } = useAuth();
  
  const { isOnline, isSyncing, lastSyncTime } = useOfflineSync(currentUser?.id);
  const { apiStatus, pocketbaseStatus } = useBackendStatus({ enabled: isAuthenticated });

  const publicNavigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  const advancedFeatures = [
    { name: t('header.tools.digitalTwin', { defaultValue: 'Digital Twin' }), href: '/digital-twin' },
    { name: t('header.tools.pestRiskHeatmap', { defaultValue: 'Pest Risk Heatmap' }), href: '/pest-risk-heatmap' },
    { name: t('header.tools.voiceAssistant', { defaultValue: 'Voice Assistant' }), href: '/voice-assistant' },
    { name: t('header.tools.arFieldOverlay', { defaultValue: 'AR Field Overlay' }), href: '/ar-field-overlay' },
    { name: t('header.tools.diseaseAi', { defaultValue: 'Disease AI' }), href: '/disease-detection-advanced' }
  ];

  const analyticsFeatures = [
    { name: t('header.analytics.yieldPrediction', { defaultValue: 'Yield Prediction' }), href: '/yield-prediction' },
    { name: t('header.analytics.soilHealth', { defaultValue: 'Soil Health' }), href: '/soil-health-analytics' },
    { name: t('header.analytics.weatherImpact', { defaultValue: 'Weather Impact' }), href: '/weather-impact' },
    { name: t('header.analytics.costBenefit', { defaultValue: 'Cost Benefit' }), href: '/cost-benefit-analysis' },
    { name: t('header.analytics.cropComparison', { defaultValue: 'Crop Comparison' }), href: '/crop-comparison' },
    { name: t('header.analytics.marketPrices', { defaultValue: 'Market Prices' }), href: '/market-prices' },
    { name: t('header.analytics.waterOptimization', { defaultValue: 'Water Optimization' }), href: '/water-optimization' },
    { name: t('header.analytics.farmerPerformance', { defaultValue: 'Farmer Performance' }), href: '/farmer-performance', adminOnly: true }
  ];

  const futuristicFeatures = [
    { name: t('header.futuristic.aiCropAdvisor', { defaultValue: 'AI Crop Advisor' }), href: '/ai-crop-advisor' },
    { name: t('header.futuristic.droneMonitoring', { defaultValue: 'Drone Monitoring' }), href: '/drone-monitoring' },
    { name: t('header.futuristic.iotSensors', { defaultValue: 'IoT Sensors' }), href: '/iot-sensors' },
    { name: t('header.futuristic.predictiveWeather', { defaultValue: 'Predictive Weather' }), href: '/predictive-weather' },
    { name: t('header.futuristic.diseaseDetector', { defaultValue: 'Disease Detector' }), href: '/disease-detector' },
    { name: t('header.futuristic.smartIrrigation', { defaultValue: 'Smart Irrigation' }), href: '/smart-irrigation' },
    { name: t('header.futuristic.blockchainCert', { defaultValue: 'Blockchain Cert' }), href: '/blockchain-certification' },
    { name: t('header.futuristic.pestManagement', { defaultValue: 'Pest Management' }), href: '/pest-management' },
    { name: t('header.futuristic.satelliteImagery', { defaultValue: 'Satellite Imagery' }), href: '/satellite-imagery' },
    { name: t('header.futuristic.climateRisk', { defaultValue: 'Climate Risk' }), href: '/climate-risk' },
    { name: t('header.futuristic.precisionFarming', { defaultValue: 'Precision Farming' }), href: '/precision-farming' },
    { name: t('header.futuristic.yieldForecasting', { defaultValue: 'Yield Forecasting' }), href: '/yield-forecasting' },
    { name: t('header.futuristic.soilMicrobiome', { defaultValue: 'Soil Microbiome' }), href: '/soil-microbiome' },
    { name: t('header.futuristic.carbonFootprint', { defaultValue: 'Carbon Footprint' }), href: '/carbon-footprint' },
    { name: t('header.futuristic.communityHub', { defaultValue: 'Community Hub' }), href: '/community-hub' }
  ];

  const farmFeatures = [
    { name: t('header.farm.fieldManagement', { defaultValue: 'Field Management' }), href: '/fields' },
    { name: t('header.farm.cropManagement', { defaultValue: 'Crop Management' }), href: '/crops' },
    { name: t('header.farm.phCalculator', { defaultValue: 'pH Calculator' }), href: '/ph-calculator' },
    { name: t('header.farm.profileSettings', { defaultValue: 'Profile / Settings' }), href: '/settings' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    if (href.startsWith('/#')) return location.pathname === '/' && location.hash === href.substring(1);
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkStyle = (href) => {
    const active = isActive(href);
    return `relative px-1 py-2 text-sm font-semibold transition-colors ${active ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 site-header">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center glow-forest transition-all duration-300 group-hover:scale-105">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="block text-base font-extrabold text-foreground tracking-tight">{t('header.brand.title', { defaultValue: 'Smart Crop Advisor' })}</span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{t('header.brand.subtitle', { defaultValue: 'Intelligence Platform' })}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {!isAuthenticated && publicNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={linkStyle(item.href)}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`relative px-1 py-2 text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`}>
                  {t('nav.dashboard')}
                  {isActive('/dashboard') && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                </Link>

                {/* Futuristic Dropdown */}
                <div className="relative" onMouseEnter={() => setFuturisticOpen(true)} onMouseLeave={() => setFuturisticOpen(false)}>
                  <button className="flex items-center text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors py-2">
                    <Cpu className="w-4 h-4 mr-1" /> {t('nav.futuristic')} <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {futuristicOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 glass-card-neon rounded-xl shadow-2xl py-2 overflow-hidden max-h-[70vh] overflow-y-auto custom-scrollbar"
                      >
                        {futuristicFeatures.map(feat => (
                          <Link key={feat.name} to={feat.href} className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors">
                            {feat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Advanced Features Dropdown */}
                <div className="relative" onMouseEnter={() => setFeaturesOpen(true)} onMouseLeave={() => setFeaturesOpen(false)}>
                  <button className="flex items-center text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors py-2">
                    {t('nav.tools')} <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {featuresOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-48 glass-card rounded-xl shadow-xl py-2 overflow-hidden"
                      >
                        {advancedFeatures.map(feat => (
                          <Link key={feat.name} to={feat.href} className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors">
                            {feat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative" onMouseEnter={() => setFarmOpen(true)} onMouseLeave={() => setFarmOpen(false)}>
                  <button className="flex items-center text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors py-2">
                    <User className="w-4 h-4 mr-1" /> {t('header.farm.title', { defaultValue: 'Farm Management' })} <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {farmOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 glass-card rounded-xl shadow-xl py-2 overflow-hidden"
                      >
                        {farmFeatures.map((feat) => (
                          <Link key={feat.name} to={feat.href} className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors">
                            {feat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Analytics Dropdown */}
                <div className="relative" onMouseEnter={() => setAnalyticsOpen(true)} onMouseLeave={() => setAnalyticsOpen(false)}>
                  <button className="flex items-center text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors py-2">
                    <BarChart2 className="w-4 h-4 mr-1" /> {t('nav.analytics')} <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {analyticsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-56 glass-card rounded-xl shadow-xl py-2 overflow-hidden"
                      >
                        {analyticsFeatures.filter(f => !f.adminOnly || currentUser?.role === 'admin').map(feat => (
                          <Link key={feat.name} to={feat.href} className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/10 hover:text-foreground transition-colors">
                            {feat.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/edge-computing" className={`relative px-1 py-2 text-sm font-semibold transition-colors flex items-center ${isActive('/edge-computing') ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`}>
                  <Database className="w-4 h-4 mr-1" /> {t('nav.edgeSync')}
                  {isActive('/edge-computing') && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                </Link>

                {currentUser?.role !== 'admin' && (
                  <Link to="/subsidy-portal" className={`relative px-1 py-2 text-sm font-semibold transition-colors ${isActive('/subsidy-portal') ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`}>
                    {t('nav.subsidies')}
                    {isActive('/subsidy-portal') && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                  </Link>
                )}

                {currentUser?.role === 'admin' && (
                  <>
                    <Link to="/admin-dashboard" className={`relative px-1 py-2 text-sm font-semibold transition-colors ${isActive('/admin-dashboard') ? 'text-primary' : 'text-foreground/75 hover:text-foreground'}`}>
                      {t('nav.admin')}
                      {isActive('/admin-dashboard') && <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <div className="hidden lg:block scale-75 origin-right">
                <ConnectionStatusBadge
                  isOnline={isOnline}
                  lastSyncTime={lastSyncTime}
                  isSyncing={isSyncing}
                  backendStatus={apiStatus}
                  pocketbaseStatus={pocketbaseStatus}
                />
              </div>
            )}

            <LanguageSelector />

            {isAuthenticated && (
              <div className="hidden sm:block">
                <NotificationCenterButton userId={currentUser?.id} />
              </div>
            )}

            <div className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-sm font-semibold text-foreground/75 hover:text-foreground transition-colors">{t('nav.login')}</Link>
                  <Button asChild className="bg-gradient-electric text-white hover:brightness-110 border-0 rounded-xl">
                    <Link to="/signup">{t('nav.signup')}</Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Button asChild variant="ghost" size="icon" className="text-foreground/75 hover:text-foreground hover:bg-primary/10 rounded-xl">
                    <Link to="/settings">
                      <Settings className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Link to="/settings" className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden lg:block">{currentUser?.name}</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-foreground/75 hover:text-foreground hover:bg-primary/10 rounded-xl">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg glass-card-hover text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/70"
          >
            <div className="px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
              {!isAuthenticated && (
                <div className="glass-panel rounded-2xl p-4 mb-2">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent" /> {t('header.mobile.insightsBanner', { defaultValue: 'Global farm insights at your fingertips' })}</p>
                </div>
              )}

              {!isAuthenticated && publicNavigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">{t('nav.dashboard')}</Link>
                  
                  <div className="px-4 py-2 text-xs font-bold text-accent uppercase tracking-wider">{t('nav.futuristic')}</div>
                  {futuristicFeatures.map(feat => (
                    <Link key={feat.name} to={feat.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">
                      {feat.name}
                    </Link>
                  ))}

                  <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.tools')}</div>
                  {advancedFeatures.map(feat => (
                    <Link key={feat.name} to={feat.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">
                      {feat.name}
                    </Link>
                  ))}

                  <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('header.farm.title', { defaultValue: 'Farm Management' })}</div>
                  {farmFeatures.map((feat) => (
                    <Link key={feat.name} to={feat.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">
                      {feat.name}
                    </Link>
                  ))}

                  <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('nav.analytics')}</div>
                  {analyticsFeatures.filter(f => !f.adminOnly || currentUser?.role === 'admin').map(feat => (
                    <Link key={feat.name} to={feat.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">
                      {feat.name}
                    </Link>
                  ))}

                  <Link to="/edge-computing" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">{t('nav.edgeSync')}</Link>
                  
                  {currentUser?.role !== 'admin' && (
                    <Link to="/subsidy-portal" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">{t('nav.subsidies')}</Link>
                  )}
                  {currentUser?.role === 'admin' && (
                    <>
                      <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:bg-primary/10 hover:text-foreground">{t('nav.admin')}</Link>
                    </>
                  )}
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-destructive/10">
                    {t('nav.logout')}
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="rounded-xl border-primary/30 bg-transparent">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                  </Button>
                  <Button asChild className="rounded-xl bg-gradient-electric text-white border-0">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>{t('nav.signup')}</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
