import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const SubsidyEligibilityChecker = ({ landSize, cropType, income, criteria, isEligible, failed }) => {
  if (!criteria) return null;

  const checks = [
    {
      label: 'Land Size Requirement',
      value: `${landSize || 0} ha`,
      requirement: `${criteria.min_land_size} - ${criteria.max_land_size} ha`,
      passed: landSize >= criteria.min_land_size && landSize <= criteria.max_land_size
    },
    {
      label: 'Crop Type Eligibility',
      value: cropType || 'None',
      requirement: 'Must be eligible crop',
      passed: !!cropType
    },
    {
      label: 'Income Threshold',
      value: `₹${(income || 0).toLocaleString()}`,
      requirement: `< ₹${criteria.income_threshold.toLocaleString()}`,
      passed: income <= criteria.income_threshold
    },
    {
      label: 'Previous Subsidy History',
      value: 'No recent claims',
      requirement: '1 claim per cycle',
      passed: true // Mocked as passed
    }
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Eligibility Verification</h3>
        {isEligible ? (
          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Eligible
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30 flex items-center">
            <XCircle className="w-4 h-4 mr-1" /> Not Eligible
          </span>
        )}
      </div>

      <div className="space-y-4">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-medium text-white">{check.label}</p>
              <p className="text-xs text-gray-400">Req: {check.requirement} | Current: {check.value}</p>
            </div>
            <div>
              {check.passed ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>

      {!isEligible && failed && failed.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-medium mb-1">Issues to resolve:</p>
          <ul className="list-disc list-inside text-xs text-red-300 pl-4 space-y-1">
            {failed.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
    </GlassCard>
  );
};

export default SubsidyEligibilityChecker;