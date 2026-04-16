import React from 'react';
import { Helmet } from 'react-helmet';
import { FileText, Printer } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { systemOverview } from '@/lib/docs/systemOverview.js';

const SystemSummaryDocument = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>System Summary - Smart Crop Advisor</title></Helmet>
      
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-white" /> System Summary Document
        </h1>
        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      <GlassCard className="p-8 md:p-12 bg-white text-black print:shadow-none print:border-none print:bg-transparent print:p-0 max-w-4xl mx-auto">
        <div className="text-center mb-12 border-b-2 border-gray-200 pb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Smart Crop Advisor</h1>
          <h2 className="text-2xl text-gray-600">Comprehensive System Summary</h2>
          <p className="text-gray-500 mt-4">Generated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-800">
          <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">1. Executive Summary</h3>
          <p>{systemOverview.intro.description}</p>
          <p><strong>Target Audience:</strong> {systemOverview.intro.audience}</p>

          <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mt-10 mb-4">2. Core Dashboards</h3>
          <ul className="space-y-4">
            {systemOverview.dashboards.map((dash, i) => (
              <li key={i}>
                <strong>{dash.name}:</strong> {dash.desc}
              </li>
            ))}
          </ul>

          <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2 mt-10 mb-4">3. Getting Started</h3>
          <ol className="space-y-2">
            {systemOverview.gettingStarted.map((step, i) => (
              <li key={i}><strong>{step.title}:</strong> {step.desc}</li>
            ))}
          </ol>

          <div className="mt-16 pt-8 border-t-2 border-gray-200 text-center text-sm text-gray-500">
            <p>Confidential & Proprietary - Smart Crop Advisor © {new Date().getFullYear()}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default SystemSummaryDocument;