import React from 'react';
import { Helmet } from 'react-helmet';
import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';

const DownloadableGuidesPage = () => {
  const guides = [
    { title: "Complete System Overview", size: "2.4 MB", pages: 45, type: "PDF" },
    { title: "Quick Start Guide", size: "0.8 MB", pages: 5, type: "PDF" },
    { title: "Troubleshooting Master List", size: "1.2 MB", pages: 12, type: "PDF" },
    { title: "API Reference Data", size: "0.5 MB", pages: "N/A", type: "JSON" }
  ];

  const getIcon = (type) => {
    if (type === 'JSON') return <FileJson className="w-8 h-8 text-yellow-400" />;
    if (type === 'Excel') return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
    return <FileText className="w-8 h-8 text-red-400" />;
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Helmet><title>Downloads - Smart Crop Advisor</title></Helmet>
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Download className="w-10 h-10 text-[#00d4ff]" /> Downloadable Guides
        </h1>
        <p className="text-xl text-gray-400">Get offline copies of our most popular documentation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, idx) => (
          <GlassCard key={idx} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#00d4ff]/50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/5">
                {getIcon(guide.type)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00d4ff] transition-colors">{guide.title}</h3>
                <p className="text-sm text-gray-500">{guide.type} • {guide.size} • {guide.pages} Pages</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default DownloadableGuidesPage;