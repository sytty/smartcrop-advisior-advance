import React, { useEffect, useState } from 'react';
import { Database, CheckCircle, XCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { databaseValidator } from '@/lib/databaseValidator';

const DatabaseStatusPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    databaseValidator.validate().then(data => {
      setReport(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen pt-24 flex justify-center text-[#00d4ff]">Validating Database Schema...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Database Integrity</h1>
        <p className="text-gray-400">Verification of PocketBase collections and schemas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Collections</p>
            <p className="text-3xl font-bold text-white">{report.totalCollections}</p>
          </div>
          <Database className="w-8 h-8 text-[#00d4ff] opacity-50" />
        </GlassCard>
        
        <GlassCard className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Accessible Collections</p>
            <p className="text-3xl font-bold text-green-400">{report.accessible}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
        </GlassCard>
      </div>

      {report.inaccessible.length > 0 && (
        <GlassCard className="p-6 border-red-500/30">
          <h3 className="text-lg font-medium text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Inaccessible or Missing Collections
          </h3>
          <ul className="space-y-3">
            {report.inaccessible.map((item, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <span className="font-mono text-white">{item.collection}</span>
                <span className="text-sm text-red-300">{item.error}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
};

export default DatabaseStatusPage;