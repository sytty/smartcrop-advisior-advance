import React, { useEffect, useState } from 'react';
import { LifeBuoy, HelpCircle, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { troubleshootingGuide } from '@/lib/troubleshootingGuide';

const TroubleshootingPage = () => {
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    setGuide(troubleshootingGuide.generate());
  }, []);

  if (!guide) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Troubleshooting & Knowledge Base</h1>
        <p className="text-gray-400">Solutions for common issues and error codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-yellow-500" /> Common Issues
          </h2>
          <div className="space-y-4">
            {guide.commonIssues.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <h3 className="text-white font-medium mb-2">{item.issue}</h3>
                <p className="text-sm text-gray-400">{item.solution}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <LifeBuoy className="w-5 h-5 text-red-500" /> Error Codes
            </h2>
            <div className="space-y-3">
              {guide.errorCodes.map((err, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="font-mono text-red-400 font-bold">{err.code}</span>
                  <span className="text-sm text-gray-300">{err.meaning}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-[#00d4ff]" /> FAQ
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="text-white font-medium mb-1">Q: {faq.q}</h3>
                  <p className="text-sm text-gray-400">A: {faq.a}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingPage;