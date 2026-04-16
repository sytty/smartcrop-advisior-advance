import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { BookOpen, Video, MessageCircle, FileText, ArrowRight, Cpu, Droplets, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';

const DocumentationHub = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Documentation Hub - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
          <Sparkles className="w-4 h-4 mr-2" />
          Documentation that is practical, fast, and field-ready
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How can we help you today?</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Everything you need to know about using Smart Crop Advisor, written in plain English. No technical jargon.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <GlassCard className="md:col-span-2 p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/30 hover:border-primary/60 transition-colors group">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">User Guides</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Step-by-step instructions for every dashboard. Learn how to set up, use features, and understand your data.
          </p>
          <Link to="/docs/guides" className="inline-flex items-center text-primary font-bold text-lg group-hover:underline">
            Browse all guides <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </GlassCard>

        <GlassCard className="p-8 bg-gradient-to-br from-accent/10 to-transparent border-accent/30 hover:border-accent/60 transition-colors group">
          <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
            <Video className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Video Tutorials</h2>
          <p className="text-muted-foreground mb-8">
            Watch short, simple videos showing exactly how to use the app.
          </p>
          <Link to="/docs/videos" className="inline-flex items-center text-accent font-bold group-hover:underline">
            Watch videos <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </GlassCard>

        <GlassCard className="p-8 hover:border-white/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">FAQ</h2>
          <p className="text-muted-foreground mb-6 text-sm">Answers to the most common questions farmers ask us.</p>
          <Link to="/docs/faq" className="text-foreground font-bold group-hover:underline flex items-center">
            Read FAQ <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </GlassCard>

        <GlassCard className="p-8 hover:border-white/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Glossary</h2>
          <p className="text-muted-foreground mb-6 text-sm">Simple definitions for technical farming and app terms.</p>
          <Link to="/docs/glossary" className="text-foreground font-bold group-hover:underline flex items-center">
            View Glossary <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </GlassCard>

        <GlassCard className="p-8 hover:border-white/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Troubleshooting</h2>
          <p className="text-muted-foreground mb-6 text-sm">How to fix things when they aren't working right.</p>
          <Link to="/docs/troubleshooting" className="text-foreground font-bold group-hover:underline flex items-center">
            Fix Problems <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </GlassCard>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">Popular Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/docs/guides/ai-crop-advisor" className="flex items-center gap-4 p-4 rounded-xl bg-card/70 border border-border/70 hover:bg-primary/5 transition-colors">
          <div className="p-3 rounded-lg bg-primary/15 text-primary"><Cpu className="w-6 h-6" /></div>
          <div>
            <h3 className="text-foreground font-bold">AI Crop Advisor Guide</h3>
            <p className="text-sm text-muted-foreground">Learn how to get crop recommendations.</p>
          </div>
        </Link>
        <Link to="/docs/guides/smart-irrigation" className="flex items-center gap-4 p-4 rounded-xl bg-card/70 border border-border/70 hover:bg-primary/5 transition-colors">
          <div className="p-3 rounded-lg bg-secondary/15 text-secondary"><Droplets className="w-6 h-6" /></div>
          <div>
            <h3 className="text-foreground font-bold">Smart Irrigation Setup</h3>
            <p className="text-sm text-muted-foreground">Automate your watering schedule.</p>
          </div>
        </Link>
        <Link to="/docs/guides/drone-monitoring" className="flex items-center gap-4 p-4 rounded-xl bg-card/70 border border-border/70 hover:bg-primary/5 transition-colors">
          <div className="p-3 rounded-lg bg-green-500/20 text-green-400"><Plane className="w-6 h-6" /></div>
          <div>
            <h3 className="text-foreground font-bold">Drone Flight Planning</h3>
            <p className="text-sm text-muted-foreground">How to map your fields from the sky.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DocumentationHub;