import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/GlassCard.jsx';
import { completeFeatureDoc } from '@/lib/completeFeatureDoc';

const CompleteFeatureDocPage = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    setDocs(completeFeatureDoc.generate());
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('documentation.completeFeatures.title', { defaultValue: 'Complete Feature Documentation' })}</h1>
        <p className="text-gray-400">{t('documentation.completeFeatures.subtitle', { defaultValue: 'Detailed breakdown of all 40+ system features and capabilities.' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {docs.map((section, idx) => (
          <GlassCard key={idx} className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
              <BookOpen className="w-5 h-5 text-[#00d4ff]" /> {section.category}
            </h2>
            <div className="space-y-6">
              {section.items.map((feat, i) => (
                <div key={i} className="group">
                  <h3 className="text-white font-medium flex items-center gap-2 mb-1">
                    <ChevronRight className="w-4 h-4 text-[#00d4ff] group-hover:translate-x-1 transition-transform" />
                    {feat.name}
                  </h3>
                  <p className="text-sm text-gray-400 pl-6">{feat.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default CompleteFeatureDocPage;