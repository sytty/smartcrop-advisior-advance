import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HardDrive, RefreshCw, Database, AlertTriangle, Trash2, Activity, FileText, CheckCircle2, XCircle, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useOfflineSync } from '@/hooks/useOfflineSync.js';
import { generateConflictData } from '@/lib/mockData.js';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import ConnectionStatusBadge from '@/components/ConnectionStatusBadge.jsx';
import SyncProgressIndicator from '@/components/SyncProgressIndicator.jsx';
import ConflictResolutionModal from '@/components/ConflictResolutionModal.jsx';
import { useBackendStatus } from '@/hooks/useBackendStatus.js';
import { useTranslation } from 'react-i18next';

const EdgeComputingDashboard = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const {
    isOnline,
    lastSyncTime,
    syncProgress,
    isSyncing,
    currentItem,
    pendingItems = [],
    syncHistory,
    storageUsage,
    manualSync,
    retryFailed,
    clearCache
  } = useOfflineSync(currentUser?.id);
  const { apiStatus, pocketbaseStatus } = useBackendStatus({ enabled: Boolean(currentUser?.id) });

  const [showConflicts, setShowConflicts] = useState(false);
  const [conflicts, setConflicts] = useState([]);

  const failedItemsCount = pendingItems.filter((i) => i.status === 'failed').length;

  const handleClearCache = () => {
    if (clearCache()) {
      toast.success('Local cache cleared successfully');
    } else {
      toast.error('Failed to clear cache');
    }
  };

  const handleManualSync = async () => {
    try {
      await manualSync();
      toast.success('Sync completed successfully');
    } catch (error) {
      toast.error(`Sync issue: ${error.message || 'Some items could not be synced'}`);
    }
  };

  const handleRetryFailed = async () => {
    try {
      await retryFailed();
      toast.success('Retry operation completed');
    } catch (error) {
      toast.error(`Retry issue: ${error.message || 'Some items still failed'}`);
    }
  };

  const checkForConflicts = () => {
    const mockConflicts = generateConflictData();
    setConflicts(mockConflicts);
    setShowConflicts(true);
  };

  const handleResolveConflict = (id, strategy) => {
    toast.success(`Conflict resolved using strategy: ${strategy.replace('_', ' ')}`);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('enterprise.edge_computing.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Sparkles className="w-3 h-3 mr-1" /> Edge operations center
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                <Database className="w-8 h-8 mr-3 text-primary" />
                {t('enterprise.edge_computing.title')}
              </h1>
              <p className="text-muted-foreground">{t('enterprise.edge_computing.subtitle')}</p>
            </div>

            <ConnectionStatusBadge
              isOnline={isOnline}
              lastSyncTime={lastSyncTime}
              isSyncing={isSyncing}
              backendStatus={apiStatus}
              pocketbaseStatus={pocketbaseStatus}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 flex flex-col justify-between rounded-3xl border-border/70">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center">
                  <HardDrive className="w-5 h-5 mr-2 text-muted-foreground" />
                  {t('enterprise.edge_computing.localStorage')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{t('enterprise.edge_computing.usage')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClearCache} className="text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-medium">{storageUsage.usageMB} MB {t('enterprise.edge_computing.used')}</span>
                <span className="text-muted-foreground">{storageUsage.limitMB} MB {t('enterprise.edge_computing.limit')}</span>
              </div>
              <div className="h-2 bg-card rounded-full overflow-hidden border border-border/70">
                <div
                  className={`h-full rounded-full ${storageUsage.percentage > 80 ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${storageUsage.percentage}%` }}
                />
              </div>
            </div>
          </GlassCard>

          <div className="lg:col-span-2">
            <SyncProgressIndicator
              progress={syncProgress}
              totalItems={pendingItems.length}
              syncedItems={Math.floor((syncProgress / 100) * pendingItems.length)}
              currentItem={currentItem}
              isSyncing={isSyncing}
              pendingCount={pendingItems.length}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 rounded-3xl border-border/70">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('enterprise.edge_computing.syncControls')}</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleManualSync}
                  disabled={!isOnline || isSyncing || pendingItems.length === 0}
                  className="w-full bg-primary/15 text-primary hover:bg-primary/25 border-0 justify-start rounded-xl"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? t('enterprise.edge_computing.syncing') : t('enterprise.edge_computing.forceSync')}
                </Button>

                <Button
                  onClick={handleRetryFailed}
                  disabled={!isOnline || isSyncing || failedItemsCount === 0}
                  className="w-full bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-0 justify-start rounded-xl"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {t('enterprise.edge_computing.retryFailed')} ({failedItemsCount})
                </Button>

                <Button
                  onClick={checkForConflicts}
                  variant="outline"
                  className="w-full bg-card/70 border-border/70 hover:bg-primary/10 justify-start rounded-xl"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {t('enterprise.edge_computing.checkConflicts')}
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-6 rounded-3xl border-border/70">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('enterprise.edge_computing.offlineCaps')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/70 p-3 rounded-xl border border-border/70 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                  <FileText className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">{t('enterprise.edge_computing.cachedFields')}</span>
                </div>
                <div className="bg-card/70 p-3 rounded-xl border border-border/70 text-center hover:bg-primary/5 transition-colors cursor-pointer">
                  <Activity className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">{t('enterprise.edge_computing.diagnoses')}</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden h-full flex flex-col rounded-3xl border-border/70">
              <div className="p-6 border-b border-border/70 bg-card/70 flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">{t('enterprise.edge_computing.pendingQueue')}</h3>
                <span className="text-xs bg-card px-2 py-1 rounded text-muted-foreground border border-border/70">{pendingItems.length} {t('enterprise.edge_computing.items')}</span>
              </div>

              <div className="overflow-y-auto flex-1 max-h-[400px]">
                {pendingItems.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-35" />
                    <p>{t('enterprise.edge_computing.emptyQueue')}</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-card/70 border-b border-border/70 text-muted-foreground sticky top-0">
                      <tr>
                        <th className="px-6 py-3 font-medium">{t('enterprise.edge_computing.type')}</th>
                        <th className="px-6 py-3 font-medium">{t('enterprise.edge_computing.created')}</th>
                        <th className="px-6 py-3 font-medium">{t('enterprise.edge_computing.status')}</th>
                        <th className="px-6 py-3 font-medium">{t('enterprise.edge_computing.details')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {pendingItems.map((item) => (
                        <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-3 text-foreground capitalize">{item.action_type}</td>
                          <td className="px-6 py-3 text-muted-foreground text-xs">{new Date(item.created_at).toLocaleString()}</td>
                          <td className="px-6 py-3">
                            {item.status === 'failed' ? (
                              <span className="inline-flex items-center text-xs text-red-600 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                <XCircle className="w-3 h-3 mr-1" /> {t('enterprise.edge_computing.failed')}
                              </span>
                            ) : item.status === 'syncing' ? (
                              <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> {t('enterprise.edge_computing.syncing')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border/70">
                                <Clock className="w-3 h-3 mr-1" /> {t('enterprise.edge_computing.pending')}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-xs">
                            {item.status === 'failed' ? (
                              <span className="text-red-600">{item.error_message} (Retries: {item.retry_count})</span>
                            ) : (
                              <span className="text-muted-foreground">{t('enterprise.edge_computing.waiting')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        <GlassCard className="p-0 overflow-hidden rounded-3xl border-border/70">
          <div className="p-6 border-b border-border/70 bg-card/70">
            <h3 className="text-lg font-bold text-foreground">{t('enterprise.edge_computing.recentHistory')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-card/70 border-b border-border/70 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('enterprise.edge_computing.timestamp')}</th>
                  <th className="px-6 py-4 font-medium">{t('enterprise.edge_computing.duration')}</th>
                  <th className="px-6 py-4 font-medium">{t('enterprise.edge_computing.itemsSynced')}</th>
                  <th className="px-6 py-4 font-medium">{t('enterprise.edge_computing.failed')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {syncHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">{new Date(hist.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 text-muted-foreground">{(hist.duration_ms / 1000).toFixed(1)}s</td>
                    <td className="px-6 py-4 text-emerald-700 font-medium">+{hist.items_synced}</td>
                    <td className="px-6 py-4">
                      {hist.failed_count > 0 ? (
                        <span className="text-red-600 font-medium">{hist.failed_count}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <ConflictResolutionModal
          isOpen={showConflicts}
          onClose={() => setShowConflicts(false)}
          conflicts={conflicts}
          onResolve={handleResolveConflict}
        />
      </div>
    </div>
  );
};

export default EdgeComputingDashboard;
