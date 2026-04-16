import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, Hash, Clock, User, Activity, Database, CheckCircle2 } from 'lucide-react';
import { useAuditLogging } from '@/hooks/useAuditLogging.js';
import { Button } from '@/components/ui/button';

const AuditLogDetailsModal = ({ transaction, isOpen, onClose }) => {
  const { getTransactionDetails } = useAuditLogging();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  if (!isOpen || !transaction) return null;

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      // Re-fetch to ensure we have the latest data
      const freshData = await getTransactionDetails(transaction.transaction_id);
      
      // Simple local verification of this specific block's hash
      const stringToHash = JSON.stringify(freshData.metadata) + (freshData.previous_hash || '') + freshData.timestamp;
      const { default: SHA256 } = await import('crypto-js/sha256');
      const calculatedHash = SHA256(stringToHash).toString();
      
      const isValid = calculatedHash === freshData.data_hash;
      setVerificationResult({ isValid, calculatedHash });
    } catch (error) {
      console.error(error);
      setVerificationResult({ isValid: false, error: 'Verification failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${transaction.verified ? 'bg-[#1a4d2e]/30 text-[#22c55e]' : 'bg-red-500/20 text-red-400'}`}>
                {transaction.verified ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Transaction Details</h2>
                <p className="text-sm text-gray-400 font-mono">{transaction.transaction_id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <Activity className="w-4 h-4 mr-2" /> Action Type
                </div>
                <p className="text-white font-medium capitalize">{transaction.action_type}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <User className="w-4 h-4 mr-2" /> Farmer
                </div>
                <p className="text-white font-medium">{transaction.expand?.farmer_id?.name || transaction.farmer_id}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <Clock className="w-4 h-4 mr-2" /> Timestamp
                </div>
                <p className="text-white font-medium">{new Date(transaction.timestamp).toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center text-sm text-gray-400 mb-1">
                  <ShieldCheck className="w-4 h-4 mr-2" /> Status
                </div>
                <p className={`font-medium ${transaction.verified ? 'text-[#22c55e]' : 'text-red-400'}`}>
                  {transaction.verified ? 'Verified & Immutable' : 'Tampered / Invalid'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Hash className="w-4 h-4 mr-2 text-[#00d4ff]" /> Data Hash (SHA-256)
                </div>
                <p className="text-[#00d4ff] font-mono text-xs break-all">{transaction.data_hash}</p>
              </div>
              
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Hash className="w-4 h-4 mr-2 text-gray-500" /> Previous Hash
                </div>
                <p className="text-gray-400 font-mono text-xs break-all">{transaction.previous_hash}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center text-sm text-gray-400 mb-3">
                <Database className="w-4 h-4 mr-2" /> Transaction Metadata
              </div>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs text-gray-300 font-mono border border-white/5">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                {verificationResult && (
                  <div className={`flex items-center text-sm ${verificationResult.isValid ? 'text-[#22c55e]' : 'text-red-400'}`}>
                    {verificationResult.isValid ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Hash matches perfectly</>
                    ) : (
                      <><ShieldAlert className="w-4 h-4 mr-2" /> Hash mismatch detected!</>
                    )}
                  </div>
                )}
              </div>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying}
                className="w-full sm:w-auto bg-gradient-electric text-white border-0 hover:brightness-110"
              >
                {isVerifying ? 'Verifying...' : 'Verify This Transaction'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuditLogDetailsModal;