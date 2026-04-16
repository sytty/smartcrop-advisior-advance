import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { FileText, CheckCircle2, AlertTriangle, Lightbulb, PlayCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { userGuides } from '@/lib/docs/userGuides.js';

const UserGuideTemplate = () => {
  const { id } = useParams();
  const guideId = id || 'ai-crop-advisor'; // Default fallback
  const guide = userGuides[guideId];

  if (!guide) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-white mb-4">Guide Not Found</h2>
        <p className="text-gray-400 mb-8">We couldn't find the guide you're looking for.</p>
        <Link to="/docs" className="px-6 py-3 bg-[#00d4ff] text-black font-bold rounded-xl">Return to Hub</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>{guide.title} - Smart Crop Advisor Docs</title></Helmet>
      
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-sm font-bold uppercase tracking-wider mb-6">
          <FileText className="w-4 h-4" /> User Guide
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{guide.title}</h1>
        <p className="text-2xl text-gray-300 leading-relaxed border-l-4 border-[#00d4ff] pl-6">
          {guide.description}
        </p>
      </div>

      <div className="space-y-12">
        {/* Getting Started */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center text-xl">1</div>
            Getting Started (5 mins)
          </h2>
          <GlassCard className="p-8">
            <ol className="space-y-6">
              {guide.gettingStarted.map((step, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                  <p className="text-xl text-gray-300">{step}</p>
                </li>
              ))}
            </ol>
          </GlassCard>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00d4ff]/20 text-[#00d4ff] flex items-center justify-center text-xl">2</div>
            Understanding the Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guide.features.map((feat, idx) => (
              <GlassCard key={idx} className="p-6 border-white/10">
                <h3 className="text-xl font-bold text-white mb-3">{feat.name}</h3>
                <p className="text-lg text-gray-400">{feat.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Tips & Mistakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-400" /> Pro Tips
            </h2>
            <GlassCard className="p-6 bg-yellow-500/5 border-yellow-500/20">
              <ul className="space-y-4">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2.5 shrink-0" />
                    <p className="text-lg text-gray-300">{tip}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" /> Mistakes to Avoid
            </h2>
            <GlassCard className="p-6 bg-red-500/5 border-red-500/20">
              <ul className="space-y-4">
                {guide.mistakes.map((mistake, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 shrink-0" />
                    <p className="text-lg text-gray-300">{mistake}</p>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>
        </div>

        {/* Video Link */}
        <section className="pt-8 border-t border-white/10">
          <GlassCard className="p-8 bg-gradient-to-r from-[#b300ff]/20 to-transparent border-[#b300ff]/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Prefer watching a video?</h3>
              <p className="text-lg text-gray-400">We have a 5-minute video tutorial covering everything on this page.</p>
            </div>
            <Link to="/docs/videos" className="px-8 py-4 rounded-xl bg-[#b300ff] text-white font-bold hover:bg-[#9900cc] transition-colors flex items-center whitespace-nowrap text-lg">
              <PlayCircle className="w-6 h-6 mr-2" /> Watch Tutorial
            </Link>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

export default UserGuideTemplate;