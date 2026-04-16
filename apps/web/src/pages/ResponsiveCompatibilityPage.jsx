import React, { useEffect, useState } from 'react';
import { Smartphone, Monitor, Tablet } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { responsiveDesignTester } from '@/lib/responsiveDesignTester';

const ResponsiveCompatibilityPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(responsiveDesignTester.runTest());
    
    const handleResize = () => setData(responsiveDesignTester.runTest());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!data) return null;

  const Icon = data.breakpoint === 'mobile' ? Smartphone : data.breakpoint === 'tablet' ? Tablet : Monitor;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Responsive & Compatibility</h1>
        <p className="text-gray-400">Current viewport and device capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mb-6">
            <Icon className="w-10 h-10 text-[#00d4ff]" />
          </div>
          <h2 className="text-2xl font-bold text-white capitalize mb-2">{data.breakpoint} Viewport</h2>
          <p className="text-gray-400 text-lg">{data.viewport.width}px × {data.viewport.height}px</p>
        </GlassCard>

        <GlassCard className="p-6 space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Device Capabilities</h3>
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-gray-400">Touch Support</span>
            <span className="text-white font-medium">{data.isTouchDevice ? 'Yes' : 'No'}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-gray-400">Pixel Ratio</span>
            <span className="text-white font-medium">{data.pixelRatio}x</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-gray-400">Orientation</span>
            <span className="text-white font-medium capitalize">{data.orientation}</span>
          </div>

          <div className="pt-2">
            <span className="text-gray-400 block mb-1 text-sm">User Agent</span>
            <span className="text-xs text-gray-500 break-words">{data.userAgent}</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResponsiveCompatibilityPage;