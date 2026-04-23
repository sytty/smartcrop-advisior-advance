import React, { useEffect, useState } from 'react';
import { Layers, Database, Server, Lock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/GlassCard.jsx';
import { detailedArchitectureDoc } from '@/lib/detailedArchitectureDoc';

const DetailedArchitectureDocPage = () => {
  const { t } = useTranslation();
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    setDocs(detailedArchitectureDoc.generate());
  }, []);

  if (!docs) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('documentation.detailedArchitecture.title', { defaultValue: 'Detailed Architecture Documentation' })}</h1>
        <p className="text-gray-400">{t('documentation.detailedArchitecture.subtitle', { defaultValue: 'In-depth technical specifications of the system stack.' })}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-[#00d4ff]" /> {t('documentation.detailedArchitecture.frontend', { defaultValue: 'Frontend Architecture' })}
          </h2>
          <div className="space-y-4">
            {Object.entries(docs.frontend).map(([k, v]) => (
              <div key={k}>
                <p className="text-sm text-gray-500 capitalize mb-1">{k.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-white bg-white/5 p-3 rounded-lg border border-white/10">{v}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-purple-400" /> {t('documentation.detailedArchitecture.backend', { defaultValue: 'Backend Architecture' })}
          </h2>
          <div className="space-y-4">
            {Object.entries(docs.backend).map(([k, v]) => (
              <div key={k}>
                <p className="text-sm text-gray-500 capitalize mb-1">{k}</p>
                <p className="text-white bg-white/5 p-3 rounded-lg border border-white/10">{v}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-green-400" /> {t('documentation.detailedArchitecture.database', { defaultValue: 'Database Architecture' })}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('documentation.detailedArchitecture.provider', { defaultValue: 'Provider' })}</span>
              <span className="text-white font-medium">{docs.database.provider}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('documentation.detailedArchitecture.totalCollections', { defaultValue: 'Total Collections' })}</span>
              <span className="text-white font-medium">{docs.database.collections}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-2">{t('documentation.detailedArchitecture.keyCollections', { defaultValue: 'Key Collections' })}</span>
              <div className="flex flex-wrap gap-2">
                {docs.database.keyCollections.map(c => (
                  <span key={c} className="px-2 py-1 rounded bg-white/10 text-xs text-white">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-yellow-400" /> {t('documentation.detailedArchitecture.securityAuth', { defaultValue: 'Security & Auth' })}
          </h2>
          <div className="space-y-4">
            {Object.entries(docs.authentication).map(([k, v]) => (
              <div key={k}>
                <p className="text-sm text-gray-500 capitalize mb-1">{k}</p>
                <p className="text-white bg-white/5 p-3 rounded-lg border border-white/10">{v}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DetailedArchitectureDocPage;