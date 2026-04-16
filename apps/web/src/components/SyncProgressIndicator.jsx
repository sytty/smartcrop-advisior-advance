import React from 'react';
import { motion } from 'framer-motion';
import { CloudLightning, CheckCircle2, AlertTriangle } from 'lucide-react';
import GlassCard from './GlassCard.jsx';

const SyncProgressIndicator = ({ progress, totalItems, syncedItems, currentItem, isSyncing, pendingCount }) => {
  if (!isSyncing && pendingCount === 0) {
    return (
      <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--edge-online))]/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-[hsl(var(--edge-online))]" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">All Data Synced</h3>
        <p className="text-sm text-gray-400">Your local data is up to date with the cloud.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 h-full flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <CloudLightning className={`w-5 h-5 mr-2 ${isSyncing ? 'text-[hsl(var(--edge-sync-progress))]' : 'text-gray-400'}`} />
          {isSyncing ? 'Sync in Progress' : 'Pending Sync'}
        </h3>
        <span className="text-sm font-medium text-gray-300">
          {isSyncing ? `${progress}%` : `${pendingCount} items waiting`}
        </span>
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-[hsl(var(--edge-sync-progress))]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {isSyncing ? (
        <div className="flex justify-between text-xs text-gray-400">
          <span>Syncing: <span className="text-white capitalize">{currentItem || 'Preparing...'}</span></span>
          <span>{syncedItems || 0} / {totalItems || 0} items</span>
        </div>
      ) : (
        <div className="flex items-center text-xs text-yellow-400 bg-yellow-400/10 px-3 py-2 rounded-lg border border-yellow-400/20">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Waiting for connection or manual sync trigger.
        </div>
      )}
    </GlassCard>
  );
};

export default SyncProgressIndicator;