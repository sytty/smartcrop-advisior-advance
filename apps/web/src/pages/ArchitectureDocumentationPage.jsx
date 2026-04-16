import React, { useEffect, useState } from 'react';
import { Layers, Database, Server, Layout } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { architectureDocumenter } from '@/lib/architectureDocumenter';

const ArchitectureDocumentationPage = () => {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    setDocs(architectureDocumenter.generate());
  }, []);

  if (!docs) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Architecture</h1>
        <p className="text-gray-400">Technical documentation of frontend, backend, and data flow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Layout className="w-5 h-5 text-[#00d4ff]" /> Frontend Architecture
          </h2>
          <div className="space-y-4">
            {Object.entries(docs.frontend).map(([k, v]) => (
              <div key={k}>
                <p className="text-sm text-gray-500 capitalize mb-1">{k}</p>
                <p className="text-white bg-white/5 p-3 rounded-lg border border-white/10">{v}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-8">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Server className="w-5 h-5 text-[#00d4ff]" /> Backend & API
            </h2>
            <div className="space-y-4">
              {Object.entries(docs.backend).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-400 capitalize">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <Database className="w-5 h-5 text-[#00d4ff]" /> Database Schema
            </h2>
            <p className="text-gray-300 mb-4">Total Collections: <span className="text-[#00d4ff] font-bold">{docs.database.collections}</span></p>
            <div className="flex flex-wrap gap-2">
              {docs.database.keyCollections.map(c => (
                <span key={c} className="px-3 py-1 rounded-full bg-white/10 text-sm text-white border border-white/20">{c}</span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDocumentationPage;