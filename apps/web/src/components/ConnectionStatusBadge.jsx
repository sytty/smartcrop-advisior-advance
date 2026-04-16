import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const stateStyles = {
  healthy: { dot: 'bg-emerald-400', text: 'text-emerald-300' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-300' },
  offline: { dot: 'bg-rose-400', text: 'text-rose-300' },
  checking: { dot: 'bg-slate-400', text: 'text-slate-300' },
};

const ConnectionStatusBadge = ({
  isOnline,
  lastSyncTime,
  isSyncing,
  backendStatus,
  pocketbaseStatus,
}) => {
  const services = [
    { label: 'API', status: backendStatus },
    { label: 'PocketBase', status: pocketbaseStatus },
  ].filter((service) => service.status);

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <div className="flex items-center text-[hsl(var(--edge-online))]">
            <Wifi className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Online</span>
          </div>
        ) : (
          <div className="flex items-center text-[hsl(var(--edge-offline))]">
            <WifiOff className="w-4 h-4 mr-1.5" />
            <span className="text-sm font-medium">Offline</span>
          </div>
        )}
      </div>

      <div className="w-px h-4 bg-white/20"></div>

      <div className="flex items-center gap-2">
        {isSyncing ? (
          <div className="flex items-center text-[hsl(var(--edge-sync-progress))]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
            </motion.div>
            <span className="text-sm font-medium">Syncing...</span>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            Last sync: {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : 'Never'}
          </div>
        )}
      </div>

      {services.length > 0 && (
        <>
          <div className="w-px h-4 bg-white/20"></div>
          <div className="flex flex-wrap items-center gap-2">
            {services.map((service) => {
              const state = service.status.state || 'checking';
              const tone = stateStyles[state] || stateStyles.checking;

              return (
                <div
                  key={service.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
                >
                  <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                  <span className="text-[11px] font-medium text-gray-300">{service.label}</span>
                  <span className={`text-[11px] ${tone.text}`}>{state}</span>
                  {service.status.latencyMs !== null && (
                    <span className="text-[11px] text-gray-500">{service.status.latencyMs}ms</span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectionStatusBadge;
