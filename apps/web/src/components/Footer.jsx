import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-border/70 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsla(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_bottom_left,hsla(var(--accent)/0.14),transparent_42%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-forest flex items-center justify-center glow-forest">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-extrabold text-foreground tracking-tight">Smart Crop Advisor</span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Intelligence Platform</span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm mb-6 max-w-sm leading-relaxed">
              Built for field teams, farm operators, and agri-enterprises that want reliable AI-driven decisions from sowing to harvest.
            </p>

            <div className="flex gap-4 mb-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <Link to="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              Start your free trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('nav.pricing')}</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('nav.contact')}</Link></li>
              <li><Link to="/docs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('footer.futuristicFeatures')}</h3>
            <ul className="space-y-3">
              <li><Link to="/ai-crop-advisor" className="text-muted-foreground hover:text-primary text-sm transition-colors">AI Crop Advisor</Link></li>
              <li><Link to="/drone-monitoring" className="text-muted-foreground hover:text-primary text-sm transition-colors">Drone Monitoring</Link></li>
              <li><Link to="/iot-sensors" className="text-muted-foreground hover:text-primary text-sm transition-colors">IoT Sensors</Link></li>
              <li><Link to="/predictive-weather" className="text-muted-foreground hover:text-primary text-sm transition-colors">Predictive Weather</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground text-sm">{t('footer.email')}</li>
              <li className="text-muted-foreground text-sm">{t('footer.phone')}</li>
              <li><Link to="/login" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{t('nav.login')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="relative z-10 border-t border-border/70 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Smart Crop Advisor. {t('footer.rights')}.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Support
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/docs" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;