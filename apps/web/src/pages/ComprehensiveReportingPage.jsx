import React, { useEffect, useState } from 'react';
import { FileText, Download, BarChart2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { reportGenerator } from '@/lib/reportGenerator';

const ComprehensiveReportingPage = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    setReport(reportGenerator.generateAll());
  }, []);

  if (!report) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Comprehensive Reports</h1>
          <p className="text-gray-400">Aggregated metrics across all 10 reporting categories.</p>
        </div>
        <Button className="bg-[#00d4ff] text-black hover:bg-[#00b3cc]">
          <Download className="w-4 h-4 mr-2" /> Export All (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(report).map(([category, data], idx) => (
          <GlassCard key={category} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/10 text-white"><BarChart2 className="w-5 h-5" /></div>
              <h2 className="text-lg font-bold text-white capitalize">{category.replace(/([A-Z])/g, ' $1')}</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(data).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-sm text-white font-medium">{Array.isArray(v) ? v.join(', ') : v.toString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ComprehensiveReportingPage;