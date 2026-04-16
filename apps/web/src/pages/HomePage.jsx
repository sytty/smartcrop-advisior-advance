import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sprout,
  Droplets,
  CloudSun,
  ShieldCheck,
  Activity,
  BarChart3,
  Plane,
  Cpu,
  Leaf,
  Satellite,
  Gauge,
  FlaskConical
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroStats = [
  { label: 'Farmers onboarded', value: '12.4k+' },
  { label: 'Acres monitored', value: '2.1M' },
  { label: 'Irrigation savings', value: '38%' },
  { label: 'Yield uplift avg', value: '24%' }
];

const impactCards = [
  {
    title: 'AI Crop Advisor',
    description: 'Localized crop recommendations blending weather models, soil chemistry, and market demand.',
    icon: Sprout,
    route: '/ai-crop-advisor',
    accent: 'text-primary'
  },
  {
    title: 'Smart Irrigation',
    description: 'Real-time moisture guidance to cut water waste while protecting yield quality.',
    icon: Droplets,
    route: '/smart-irrigation',
    accent: 'text-secondary'
  },
  {
    title: 'Disease Radar',
    description: 'Computer vision and pattern alerts to detect outbreaks before they spread.',
    icon: ShieldCheck,
    route: '/disease-detection-advanced',
    accent: 'text-accent'
  },
  {
    title: 'Precision Analytics',
    description: 'Actionable dashboards for field-level operations, cost, risk, and sustainability.',
    icon: BarChart3,
    route: '/analytics',
    accent: 'text-primary'
  }
];

const capabilityRows = [
  { title: 'Climate Intelligence', icon: CloudSun, text: 'Hyper-local forecasts, anomaly alerts, and seasonal scenario planning.' },
  { title: 'Drone + Satellite Fusion', icon: Satellite, text: 'Visual diagnosis at scale across large farms and distributed regions.' },
  { title: 'Edge + Offline Reliability', icon: Cpu, text: 'Reliable operation in unstable connectivity zones with smart synchronization.' },
  { title: 'Operational Scoring', icon: Gauge, text: 'Clear health and performance indicators for every critical farm workflow.' },
  { title: 'Soil + Microbiome Depth', icon: FlaskConical, text: 'Track nutrient dynamics and soil biology for long-term resilience.' },
  { title: 'Aerial Intervention Planning', icon: Plane, text: 'Coordinate drone interventions and map high-risk hotspots efficiently.' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute -top-28 right-0 w-[34rem] h-[34rem] bg-primary/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-12 w-[30rem] h-[30rem] bg-accent/20 blur-3xl rounded-full" />

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <Activity className="w-4 h-4 mr-2" />
                Built for high-output, climate-resilient agriculture
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-[0.95] text-balance">
                The operating system for
                <span className="gradient-text-electric"> next-generation farms</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Smart Crop Advisor turns fragmented farm data into clear actions across crop health, water, climate risk, and profitability.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="h-12 px-8 rounded-xl bg-gradient-electric text-white border-0">
                  <Link to="/signup">
                    Launch Your Farm Workspace <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-xl border-primary/30 bg-card/70">
                  <Link to="/pricing">See Pricing</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="elevated-card rounded-2xl px-4 py-3">
                    <div className="text-2xl font-extrabold text-primary font-variant-tabular">{stat.value}</div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="glass-card-neon rounded-[2rem] p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Live Insight Pulse</p>
                  <h2 className="text-2xl font-bold">Farm Command Snapshot</h2>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-card/85 border border-border/70 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">Crop Health Confidence</span>
                    <span className="text-lg font-bold text-primary">94%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-electric" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-card/85 border border-border/70 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Irrigation Mode</p>
                    <p className="text-lg font-bold">Adaptive</p>
                    <p className="text-xs text-muted-foreground mt-1">Triggered by moisture and forecast inputs</p>
                  </div>
                  <div className="rounded-2xl bg-card/85 border border-border/70 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Disease Alerts</p>
                    <p className="text-lg font-bold">Low Risk</p>
                    <p className="text-xs text-muted-foreground mt-1">2 watch zones, no active outbreak</p>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full rounded-xl border-primary/30 bg-card/70">
                  <Link to="/dashboard">Explore Full Dashboard</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="mb-12 md:mb-16 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.16em] text-primary font-semibold mb-3">Platform Pillars</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything required to run a modern farm operation</h2>
            <p className="text-muted-foreground text-lg">From sensing to decisions to interventions, each module is connected so your team moves faster with fewer mistakes.</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {impactCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="elevated-card rounded-3xl p-6 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5">
                    <Icon className={`w-5 h-5 ${item.accent}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.description}</p>
                  <Link to={item.route} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                    Open Module <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 border-y border-border/60 bg-card/40">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-accent font-semibold mb-3">Capability Matrix</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for scale, speed, and trust</h2>
              <p className="text-muted-foreground text-lg">Designed for real farm constraints: weather uncertainty, fragmented tooling, data overload, and distributed field teams.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {capabilityRows.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="glass-panel rounded-2xl p-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="glass-card rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-16 right-10 w-56 h-56 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-8 w-52 h-52 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to run your farm like a high-performance system?</h2>
              <p className="text-muted-foreground text-lg mb-8">Deploy in minutes, onboard your team, and turn daily farm data into decisive execution.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild className="h-12 px-8 rounded-xl bg-gradient-electric border-0 text-white">
                  <Link to="/signup">
                    Create Account <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-xl border-primary/30 bg-card/70">
                  <Link to="/contact">Talk to Our Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}