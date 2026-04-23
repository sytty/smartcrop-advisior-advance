import React from 'react';
import { BookOpen, Code, Database, Layout } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/GlassCard.jsx';
import { documentationGenerator } from '@/lib/documentationGenerator';

const DocumentationPage = () => {
  const { t } = useTranslation();
  const docs = documentationGenerator.generate();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t('documentation.system.title', { defaultValue: 'System Documentation' })}</h1>
        <p className="text-gray-400">{t('documentation.system.subtitle', { defaultValue: 'Auto-generated architecture and feature reference.' })}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-[#00d4ff]" /> {t('documentation.system.architecture', { defaultValue: 'Architecture' })}
            </h2>
            <ul className="space-y-3 text-sm">
              {Object.entries(docs.architecture).map(([key, val]) => (
                <li key={key} className="flex flex-col">
                  <span className="text-gray-500 capitalize">{key}</span>
                  <span className="text-white font-medium">{val}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-[#00d4ff]" /> {t('documentation.system.database', { defaultValue: 'Database' })}
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">{t('documentation.system.collections', { defaultValue: 'Collections' })}</span>
                <span className="text-white font-medium">{docs.database.collections}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">{t('documentation.system.authProviders', { defaultValue: 'Auth Providers' })}</span>
                <span className="text-white font-medium">{docs.database.authProviders.join(', ')}</span>
              </li>
            </ul>
          </GlassCard>
        </div>

        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Layout className="w-5 h-5 text-[#00d4ff]" /> {t('documentation.system.coreFeatures', { defaultValue: 'Core Features' })}
            </h2>
            <div className="space-y-4">
              {docs.features.map((feat, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h3 className="text-white font-medium mb-1">{feat.name}</h3>
                  <p className="text-sm text-gray-400">{feat.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;