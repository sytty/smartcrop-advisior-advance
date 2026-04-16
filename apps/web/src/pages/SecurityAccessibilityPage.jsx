import React, { useEffect, useState } from 'react';
import { Shield, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/GlassCard.jsx';
import { securityAuditService } from '@/lib/securityAuditService';
import { accessibilityAuditService } from '@/lib/accessibilityAuditService';

const SecurityAccessibilityPage = () => {
  const [security, setSecurity] = useState(null);
  const [accessibility, setAccessibility] = useState(null);

  useEffect(() => {
    setSecurity(securityAuditService.runAudit());
    setAccessibility(accessibilityAuditService.runAudit());
  }, []);

  if (!security || !accessibility) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Security & Accessibility Audit</h1>
        <p className="text-gray-400">Automated compliance and vulnerability scanning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Security Section */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${security.score >= 90 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Score</h2>
                <p className="text-sm text-gray-400">Based on client-side heuristics</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-white">{security.score}/100</div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Security Findings</h3>
            {security.issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" /> No critical issues found.
              </div>
            ) : (
              <ul className="space-y-4">
                {security.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-400">{issue.type}</p>
                      <p className="text-sm text-gray-300">{issue.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>

        {/* Accessibility Section */}
        <div className="space-y-6">
          <GlassCard className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${accessibility.score >= 90 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Accessibility Score</h2>
                <p className="text-sm text-gray-400">WCAG 2.1 AA Estimates</p>
              </div>
            </div>
            <div className="text-4xl font-bold text-white">{accessibility.score}/100</div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Accessibility Findings</h3>
            {accessibility.issues.length === 0 ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" /> No critical issues found.
              </div>
            ) : (
              <ul className="space-y-4">
                {accessibility.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-400">{issue.type}</p>
                      <p className="text-sm text-gray-300">{issue.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessibilityPage;