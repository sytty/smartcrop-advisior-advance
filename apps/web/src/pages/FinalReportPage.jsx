import React, { useEffect, useState } from 'react';
import { CheckCircle, Shield, Zap, Smartphone, Globe, Award } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { finalReportGenerator } from '@/lib/finalReportGenerator';

const FinalReportPage = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    setReport(finalReportGenerator.generate());
  }, []);

  if (!report) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Final System Report</h1>
          <p className="text-gray-400">Comprehensive overview of system readiness and health.</p>
        </div>
        <div className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold flex items-center gap-2">
          <Award className="w-5 h-5" /> PRODUCTION READY
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Status</p>
          <p className="text-xl font-bold text-green-400">{report.executiveSummary.status}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Features</p>
          <p className="text-xl font-bold text-white">{report.executiveSummary.totalFeatures}+</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Languages</p>
          <p className="text-xl font-bold text-white">{report.executiveSummary.languages}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Performance</p>
          <p className="text-xl font-bold text-[#00d4ff]">{report.executiveSummary.performance}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Security</p>
          <p className="text-xl font-bold text-purple-400">{report.executiveSummary.security}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-xs text-gray-400 uppercase mb-1">Accessibility</p>
          <p className="text-xl font-bold text-yellow-400">{report.executiveSummary.accessibility}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" /> System Audit Results
          </h2>
          <div className="space-y-3">
            {Object.entries(report.systemAudit).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-green-400 font-medium flex items-center gap-2">
                  {v} <CheckCircle className="w-4 h-4" />
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00d4ff]" /> Performance Metrics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Page Load Time</span>
              <span className="text-white font-bold">{report.performanceMetrics.pageLoad}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">API Response</span>
              <span className="text-white font-bold">{report.performanceMetrics.apiResponse}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">DB Query Time</span>
              <span className="text-white font-bold">{report.performanceMetrics.dbQuery}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lighthouse Score</span>
              <span className="text-green-400 font-bold">{report.performanceMetrics.lighthouse}/100</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">How The Website Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(report.howItWorks).map(([k, v]) => (
            <div key={k} className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-white font-medium capitalize mb-2">{k.replace(/([A-Z])/g, ' $1')}</h3>
              <p className="text-sm text-gray-400">{v}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default FinalReportPage;