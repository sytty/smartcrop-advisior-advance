import React from 'react';
import { Helmet } from 'react-helmet';
import { LifeBuoy, Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { gettingHelp } from '@/lib/docs/gettingHelp.js';

const GettingHelpGuide = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Getting Help - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00d4ff]/20 mb-6 glow-electric">
          <LifeBuoy className="w-10 h-10 text-[#00d4ff]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">We're here to help</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Choose the support channel that works best for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {gettingHelp.options.map((opt, idx) => (
          <GlassCard key={idx} className="p-6 hover:border-[#00d4ff]/50 transition-colors cursor-pointer group">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00d4ff] transition-colors">{opt.name}</h3>
            <p className="text-gray-400 mb-4">{opt.desc}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" /> Expected response: <span className="text-white font-medium">{opt.speed}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8 bg-gradient-to-br from-white/5 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-6">Direct Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-black/40 rounded-xl border border-white/5">
            <Mail className="w-8 h-8 text-gray-400 mb-4" />
            <h3 className="text-white font-bold mb-1">Email Us</h3>
            <p className="text-[#00d4ff]">{gettingHelp.contact.email}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-black/40 rounded-xl border border-white/5">
            <Phone className="w-8 h-8 text-gray-400 mb-4" />
            <h3 className="text-white font-bold mb-1">Call Us</h3>
            <p className="text-[#00d4ff]">{gettingHelp.contact.phone}</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-black/40 rounded-xl border border-white/5">
            <MessageSquare className="w-8 h-8 text-gray-400 mb-4" />
            <h3 className="text-white font-bold mb-1">Live Chat</h3>
            <p className="text-gray-400 text-sm">Available in bottom right corner</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <p className="text-red-200">{gettingHelp.escalation}</p>
        </div>
      </GlassCard>
    </div>
  );
};

export default GettingHelpGuide;