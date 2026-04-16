import React from 'react';
import { AlertTriangle, Bug, CloudRain, Sprout, CheckCircle2 } from 'lucide-react';

const AlertTimelineItem = ({ alert }) => {
  const getAlertConfig = (type) => {
    switch (type) {
      case 'disease': return { icon: AlertTriangle, color: 'text-[hsl(var(--alert-disease))]', bg: 'bg-[hsl(var(--alert-disease))]/20' };
      case 'pest': return { icon: Bug, color: 'text-[hsl(var(--alert-pest))]', bg: 'bg-[hsl(var(--alert-pest))]/20' };
      case 'weather': return { icon: CloudRain, color: 'text-[hsl(var(--alert-weather))]', bg: 'bg-[hsl(var(--alert-weather))]/20' };
      case 'soil': return { icon: Sprout, color: 'text-[hsl(var(--alert-soil))]', bg: 'bg-[hsl(var(--alert-soil))]/20' };
      default: return { icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const config = getAlertConfig(alert.type);
  const Icon = config.icon;

  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      {/* Timeline Line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-white/10 last:hidden"></div>
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ${config.bg}`}>
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>

      <div className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
          <h4 className="text-white font-medium">{alert.title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
            {alert.status === 'active' ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">Active</span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Resolved
              </span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-300 mb-3">{alert.details}</p>
        
        <div className="flex items-center text-xs text-gray-400">
          <span className="bg-white/5 px-2 py-1 rounded">
            <strong className="text-white">{alert.affectedFieldsCount}</strong> fields affected
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertTimelineItem;