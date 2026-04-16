import React from 'react';
import { Download, Share2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExportShare = () => {
  return (
    <div className="flex gap-3">
      <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
        <Share2 className="w-4 h-4 mr-2" /> Share
      </Button>
      <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
        <Printer className="w-4 h-4 mr-2" /> Print
      </Button>
      <Button className="bg-[#00d4ff] text-black hover:bg-[#00b3cc] border-0">
        <Download className="w-4 h-4 mr-2" /> Export PDF
      </Button>
    </div>
  );
};

export default ExportShare;