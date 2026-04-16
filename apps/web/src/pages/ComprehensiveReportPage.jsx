import React, { useEffect, useState } from 'react';
import { FileText, Download, CheckCircle, Shield, Zap, Layout, Database, Globe } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { finalReportGenerator } from '@/lib/finalReportGenerator';

const ComprehensiveReportPage = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    setReport(finalReportGenerator.generate());
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "ultimate_system_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!report) return <div className="min-h-screen pt-24 flex justify-center text-[#00d4ff]">Generating Ultimate Report...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Ultimate Comprehensive Report</h1>
          <p className="text-gray-400">The final aggregation of all system audits, documentation, and readiness checks.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleExport} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
          <div className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> PRODUCTION READY
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">System Health</p>
          <p className="text-2xl font-bold text-green-400">{report.executiveSummary.health}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Features Verified</p>
          <p className="text-2xl font-bold text-white">{report.executiveSummary.totalFeatures}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Security Status</p>
          <p className="text-2xl font-bold text-purple-400">{report.executiveSummary.security}</p>
        </GlassCard>
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-gray-400 mb-1">Performance</p>
          <p className="text-2xl font-bold text-[#00d4ff]">{report.executiveSummary.performance}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Audit Results */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" /> System Audit Results
          </h2>
          <div className="space-y-3">
            {Object.entries(report.systemAudit).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Performance Metrics */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00d4ff]" /> Performance Metrics
          </h2>
          <div className="space-y-4">
            {Object.entries(report.performanceMetrics).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-[#00d4ff] font-bold">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* How It Works */}
      <GlassCard className="p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Layout className="w-6 h-6 text-purple-400" /> How The Website Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(report.howItWorks).map(([k, v]) => (
            <div key={k}>
              <h3 className="text-lg font-medium text-white capitalize mb-2">{k.replace(/([A-Z])/g, ' $1')}</h3>
              <p className="text-gray-400 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Optimizations & Fixes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-yellow-400" /> Optimizations Applied
          </h2>
          <div className="space-y-4">
            {report.optimizations.map((opt, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-white font-medium">{opt.name}</p>
                <p className="text-sm text-green-400">Impact: {opt.impact}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Recommendations
          </h2>
          <ul className="space-y-3 list-disc list-inside text-gray-300 pl-4">
            {report.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};

export default ComprehensiveReportPage;