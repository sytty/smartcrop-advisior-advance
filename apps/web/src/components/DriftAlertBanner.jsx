import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, CheckCircle, X } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const DriftAlertBanner = ({ status, metrics = [], onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || status === 'healthy') return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  const config = {
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      title: 'Performance Warning Detected'
    },
    critical: {
      icon: ShieldAlert,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      title: 'Critical Model Drift Detected'
    }
  };

  const currentConfig = config[status];
  const Icon = currentConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="mb-6"
      >
        <GlassCard className={`p-4 flex items-start justify-between ${currentConfig.bg} ${currentConfig.border}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-black/20 ${currentConfig.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`font-bold ${currentConfig.color}`}>{currentConfig.title}</h3>
              <p className="text-sm text-gray-300 mt-1">
                The model has degraded beyond acceptable thresholds. 
                {metrics.length > 0 && (
                  <span className="block mt-1">
                    Triggered by: {metrics.map(m => <strong key={m.metric} className="capitalize text-white">{m.metric} (-{m.drop.toFixed(1)}%)</strong>).reduce((prev, curr) => [prev, ', ', curr])}
                  </span>
                )}
              </p>
              <div className="mt-3">
                <button className="text-xs font-medium px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">
                  Schedule Retraining
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default DriftAlertBanner;