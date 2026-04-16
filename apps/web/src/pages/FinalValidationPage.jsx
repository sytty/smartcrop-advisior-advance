import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { finalValidationEngine } from '@/lib/finalValidationEngine';

const FinalValidationPage = () => {
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    setValidation(finalValidationEngine.validate());
  }, []);

  if (!validation) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Final Validation & Verification</h1>
          <p className="text-gray-400">Automated sign-off and final system checks.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 mb-1">Validation Score</p>
          <p className="text-4xl font-bold text-green-400">{validation.score}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {validation.checks.map((check, idx) => (
            <GlassCard key={idx} className="p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{check.category}</h3>
                <p className="text-sm text-gray-400">{check.details}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
            </GlassCard>
          ))}
        </div>

        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-24 border-green-500/30 bg-green-500/5">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 mx-auto">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-6">System Approved</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-bold">{validation.status}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Approved By</span>
                <span className="text-white">{validation.signOff.approvedBy}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{validation.signOff.date}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default FinalValidationPage;