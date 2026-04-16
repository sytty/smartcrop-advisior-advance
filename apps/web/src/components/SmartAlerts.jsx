import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartAlerts = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertStyles = (type) => {
    switch(type) {
      case 'urgent': return 'bg-red-500/15 border-red-500/40 text-red-400';
      case 'warning': return 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400';
      default: return 'bg-[#00d4ff]/15 border-[#00d4ff]/40 text-[#00d4ff]';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'urgent': return <AlertTriangle className="w-6 h-6" />;
      case 'warning': return <AlertCircle className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {alerts.map((alert, idx) => (
        <motion.div 
          key={alert.id || idx}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 shrink-0">{getAlertIcon(alert.type)}</div>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{alert.title}</h4>
              <p className="text-current opacity-90">{alert.message}</p>
            </div>
          </div>
          {alert.action && (
            <button className="px-6 py-2.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors whitespace-nowrap w-full sm:w-auto">
              {alert.action}
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SmartAlerts;