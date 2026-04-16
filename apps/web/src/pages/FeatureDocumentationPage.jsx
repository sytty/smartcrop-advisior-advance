import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { featureDocumenter } from '@/lib/featureDocumenter';

const FeatureDocumentationPage = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    setDocs(featureDocumenter.generate());
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Feature Documentation</h1>
        <p className="text-gray-400">Comprehensive guide to all 40+ system features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((category, idx) => (
          <GlassCard key={idx} className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#00d4ff]" /> {category.category}
            </h2>
            <ul className="space-y-3">
              {category.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <ChevronRight className="w-4 h-4 text-[#00d4ff]" /> {feat}
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default FeatureDocumentationPage;