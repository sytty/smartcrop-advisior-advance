import { useState, useEffect, useCallback, useRef } from 'react';
import { useSyncQueue } from './useSyncQueue';
import { getStorageUsage, clearAllCache } from '@/lib/offlineDataCache';
import { generateSyncHistoryData } from '@/lib/mockData.js';

export const useOfflineSync = (farmerId) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const pendingItemsRef = useRef([]);
  const farmerIdRef = useRef(farmerId);
  const lastAutoSyncSignatureRef = useRef('');
  
  const { 
    pendingItems, 
    fetchPendingItems, 
    batchSync, 
    retryFailedItems 
  } = useSyncQueue();

  useEffect(() => {
    pendingItemsRef.current = pendingItems;
  }, [pendingItems]);

  useEffect(() => {
    farmerIdRef.current = farmerId;
  }, [farmerId]);

  // Connection detection
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    if (farmerId) {
      fetchPendingItems(farmerId);
      setSyncHistory(generateSyncHistoryData(5));
    }
  }, [farmerId, fetchPendingItems]);

  const handleProgress = useCallback((current, total, itemName) => {
    setSyncProgress(Math.round((current / total) * 100));
    setCurrentItem(itemName);
  }, []);

  const manualSync = useCallback(async () => {
    const activePendingItems = pendingItemsRef.current;
    if (!isOnline || isSyncing || activePendingItems.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);
    const startTime = Date.now();

    try {
      const itemsToSync = activePendingItems.filter((item) => item.status === 'pending' || item.status === 'failed');
      const { syncedCount, failedCount } = await batchSync(itemsToSync, handleProgress);
      
      setLastSyncTime(new Date());
      
      // Add to history
      setSyncHistory(prev => [{
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration_ms: Date.now() - startTime,
        items_synced: syncedCount,
        failed_count: failedCount
      }, ...prev].slice(0, 10));

      if (failedCount > 0) {
        throw new Error(`${failedCount} items failed to sync`);
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
      throw error; // Rethrow so the UI can catch and display it
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
      setCurrentItem('');
      if (farmerIdRef.current) {
        fetchPendingItems(farmerIdRef.current);
      }
    }
  }, [isOnline, isSyncing, batchSync, handleProgress, fetchPendingItems]);

  const retryFailed = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      const { syncedCount, failedCount } = await retryFailedItems(farmerId, handleProgress);
      setLastSyncTime(new Date());
      
      if (failedCount > 0) {
        throw new Error(`${failedCount} items failed during retry`);
      }
      return { syncedCount, failedCount };
    } catch (error) {
      console.error('Retry failed:', error);
      throw error; // Rethrow so the UI can catch and display it
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
      setCurrentItem('');
      if (farmerIdRef.current) {
        fetchPendingItems(farmerIdRef.current);
      }
    }
  }, [isOnline, isSyncing, retryFailedItems, farmerId, handleProgress, fetchPendingItems]);

  // Auto sync when coming online
  useEffect(() => {
    if (!isOnline || isSyncing || pendingItems.length === 0) {
      return;
    }

    const pendingOnly = pendingItems.filter((item) => item.status === 'pending');
    if (pendingOnly.length === 0) {
      return;
    }

    const signature = pendingOnly.map((item) => `${item.id}:${item.status}`).join('|');
    if (lastAutoSyncSignatureRef.current === signature) {
      return;
    }

    lastAutoSyncSignatureRef.current = signature;
    manualSync().catch(console.error);
  }, [isOnline, isSyncing, pendingItems, manualSync]);

  return {
    isOnline,
    lastSyncTime,
    syncProgress,
    isSyncing,
    currentItem,
    pendingItems,
    syncHistory,
    storageUsage: getStorageUsage(),
    manualSync,
    retryFailed,
    clearCache: clearAllCache
  };
};