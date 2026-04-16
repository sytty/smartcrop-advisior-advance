import React from 'react';
import { Calculator, AlertCircle } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const SubsidyCalculator = ({ landSize, cropType, calculation }) => {
  if (!calculation || !calculation.breakdown) {
    return (
      <GlassCard className="p-6 h-full flex flex-col items-center justify-center text-center">
        <Calculator className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-400 text-sm">Enter land size and select crop type to calculate estimated subsidy.</p>
      </GlassCard>
    );
  }

  const { amount, capped, breakdown } = calculation;

  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-[#00d4ff]" />
        Subsidy Estimate
      </h3>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Base Rate ({cropType})</span>
          <span className="text-sm font-medium text-white">{breakdown.rate}% of standard cost</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Raw Calculation</span>
          <span className="text-sm font-medium text-white">₹{breakdown.rawAmount.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <span className="text-sm text-gray-400">Maximum Cap</span>
          <span className="text-sm font-medium text-white">₹{breakdown.maxCap.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-sm text-gray-400 mb-1">Estimated Total Subsidy</p>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-bold text-[#00d4ff]">₹{amount.toLocaleString()}</p>
          {capped && (
            <span className="flex items-center text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md border border-yellow-500/20">
              <AlertCircle className="w-3 h-3 mr-1" /> Capped at max
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default SubsidyCalculator;