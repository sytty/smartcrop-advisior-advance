import React, { useEffect, useState } from 'react';
import { Globe, CheckCircle, AlertTriangle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { i18nValidator } from '@/lib/i18nValidator';

const I18nStatusPage = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    setReport(i18nValidator.validate());
  }, []);

  if (!report) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Internationalization (i18n) Status</h1>
        <p className="text-gray-400">Validation of 16 languages and 11 namespaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-gray-400 font-medium">Languages Loaded</h3>
          </div>
          <p className="text-3xl font-bold text-white">{report.loadedLanguages} / {report.totalLanguages}</p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-gray-400 font-medium">RTL Support (Arabic)</h3>
          </div>
          <p className="text-3xl font-bold text-white">{report.rtlSupport.ar ? 'Active' : 'Missing'}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className={`w-5 h-5 ${report.missingNamespaces.length > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
            <h3 className="text-gray-400 font-medium">Missing Namespaces</h3>
          </div>
          <p className="text-3xl font-bold text-white">{report.missingNamespaces.length}</p>
        </GlassCard>
      </div>

      {report.missingNamespaces.length > 0 && (
        <GlassCard className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Incomplete Translations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {report.missingNamespaces.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between">
                <span className="text-white font-medium uppercase">{item.language}</span>
                <span className="text-gray-400">{item.namespace}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default I18nStatusPage;