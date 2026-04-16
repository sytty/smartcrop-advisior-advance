import { useState, useCallback, useEffect, useRef } from 'react';
import pb from '@/lib/pocketbaseClient';
import { generateSyncQueueData } from '@/lib/mockData.js';

export const useSyncQueue = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const pendingItemsRef = useRef([]);

  useEffect(() => {
    pendingItemsRef.current = pendingItems;
  }, [pendingItems]);

  const fetchPendingItems = useCallback(async (farmerId) => {
    setLoading(true);
    try {
      const records = await pb.collection('sync_queue').getList(1, 100, {
        filter: `(status="pending" || status="failed") && user_id="${farmerId}"`,
        sort: '-created',
        $autoCancel: false
      });
      
      if (records.items.length > 0) {
        setPendingItems(records.items);
      } else {
        // Only use mock data for initial display when the database is empty
        // These will be filtered out before actual sync operations
        const mock = generateSyncQueueData(farmerId, 5).filter(i => i.status !== 'synced');
        setPendingItems(mock);
      }
      return records.items;
    } catch (error) {
      console.error('Failed to fetch sync queue:', error);
      setPendingItems([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createSyncItem = useCallback(async (farmerId, actionType, data) => {
    try {
      const record = await pb.collection('sync_queue').create({
        user_id: farmerId,
        action_type: actionType,
        data,
        status: 'pending',
        retry_count: 0
      }, { $autoCancel: false });
      
      setPendingItems(prev => [record, ...prev]);
      return record;
    } catch (error) {
      console.error('Failed to create sync item:', error);
      throw error;
    }
  }, []);

  const updateSyncStatus = useCallback(async (id, status, errorMessage = '') => {
    try {
      // Prevent attempting to update mock data in the real database
      if (id.startsWith('sync-')) {
        console.warn(`Attempted to update mock record ${id}. Removing from queue.`);
        setPendingItems(prev => prev.filter(item => item.id !== id));
        throw new Error('Sync item no longer exists');
      }

      const data = { status };
      if (status === 'synced') data.synced_at = new Date().toISOString();
      if (errorMessage) data.error_message = errorMessage;

      const record = await pb.collection('sync_queue').update(id, data, { $autoCancel: false });
      
      setPendingItems(prev => 
        status === 'synced' 
          ? prev.filter(item => item.id !== id)
          : prev.map(item => item.id === id ? record : item)
      );
      return record;
    } catch (error) {
      console.error(`Failed to update sync status for ${id}:`, error);
      
      // Handle 404 gracefully by removing the non-existent item from the queue
      if (error.status === 404 || error.message === 'Sync item no longer exists') {
        setPendingItems(prev => prev.filter(item => item.id !== id));
        throw new Error('Sync item no longer exists');
      }
      throw error;
    }
  }, []);

  const batchSync = useCallback(async (items, onProgress) => {
    let syncedCount = 0;
    let failedCount = 0;

    // Filter out mock items before syncing to avoid unnecessary 404 errors
    const actualItems = items.filter(item => !item.id.startsWith('sync-'));

    for (let i = 0; i < actualItems.length; i++) {
      const item = actualItems[i];
      try {
        await updateSyncStatus(item.id, 'syncing');
        if (onProgress) onProgress(i + 1, actualItems.length, item.action_type);
        
        // Simulate network delay for sync
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Random failure simulation for realism (10% chance)
        if (Math.random() > 0.9) throw new Error('Network timeout during batch sync');

        await updateSyncStatus(item.id, 'synced');
        syncedCount++;
      } catch (error) {
        if (error.message !== 'Sync item no longer exists') {
          try {
            await updateSyncStatus(item.id, 'failed', error.message);
          } catch (e) {
            // Ignore secondary errors if the item was already removed due to 404
            console.warn(`Secondary error updating failed status for ${item.id}:`, e);
          }
        }
        failedCount++;
      }
    }

    // Clean up any mock items that were skipped
    if (items.length > actualItems.length) {
      setPendingItems(prev => prev.filter(item => !item.id.startsWith('sync-')));
    }

    return { syncedCount, failedCount };
  }, [updateSyncStatus]);

  const retryFailedItems = useCallback(async (farmerId, onProgress) => {
    // Only retry actual database records, ignore mock data
    const failedItems = pendingItemsRef.current.filter(item => item.status === 'failed' && !item.id.startsWith('sync-'));
    
    if (failedItems.length === 0) {
      // Clear any mock failed items from the UI
      setPendingItems(prev => prev.filter(item => !item.id.startsWith('sync-')));
      return { syncedCount: 0, failedCount: 0 };
    }

    for (const item of failedItems) {
      try {
        // Check existence implicitly via update
        await pb.collection('sync_queue').update(item.id, {
          retry_count: (item.retry_count || 0) + 1,
          status: 'pending'
        }, { $autoCancel: false });
      } catch (error) {
        console.error(`Failed to reset retry count for ${item.id}:`, error);
        if (error.status === 404) {
          // Remove non-existent records from the queue
          setPendingItems(prev => prev.filter(i => i.id !== item.id));
        }
      }
    }

    const updatedItems = await fetchPendingItems(farmerId);
    return batchSync(updatedItems, onProgress);
  }, [fetchPendingItems, batchSync]);

  return {
    pendingItems,
    loading,
    fetchPendingItems,
    createSyncItem,
    updateSyncStatus,
    batchSync,
    retryFailedItems
  };
};