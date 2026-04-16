import { useState, useCallback } from 'react';
import SHA256 from 'crypto-js/sha256';
import pb from '@/lib/pocketbaseClient';

export const useAuditLogging = () => {
  const [isLogging, setIsLogging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const generateHash = (data, previousHash, timestamp) => {
    const stringToHash = JSON.stringify(data) + (previousHash || '') + timestamp;
    return SHA256(stringToHash).toString();
  };

  const logAction = useCallback(async (actionType, farmerId, dataObject) => {
    setIsLogging(true);
    try {
      // Get the most recent transaction to link the chain
      const lastLogList = await pb.collection('audit_logs').getList(1, 1, {
        sort: '-created',
        $autoCancel: false
      });
      
      const previousHash = lastLogList.items.length > 0 ? lastLogList.items[0].data_hash : 'GENESIS';
      const timestamp = new Date().toISOString();
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      const dataHash = generateHash(dataObject, previousHash, timestamp);

      const newLog = await pb.collection('audit_logs').create({
        transaction_id: transactionId,
        action_type: actionType,
        farmer_id: farmerId,
        data_hash: dataHash,
        previous_hash: previousHash,
        timestamp: timestamp,
        metadata: dataObject,
        verified: true
      }, { $autoCancel: false });

      return newLog;
    } catch (error) {
      console.error('Audit logging failed:', error);
      throw error;
    } finally {
      setIsLogging(false);
    }
  }, []);

  const verifyChain = useCallback(async () => {
    setIsVerifying(true);
    try {
      // Fetch all logs sorted by creation time ascending to verify the chain
      const logs = await pb.collection('audit_logs').getFullList({
        sort: 'created',
        $autoCancel: false
      });

      const brokenLinks = [];
      let isValid = true;

      for (let i = 0; i < logs.length; i++) {
        const currentLog = logs[i];
        
        // Verify current hash
        const expectedHash = generateHash(currentLog.metadata, currentLog.previous_hash, currentLog.timestamp);
        if (currentLog.data_hash !== expectedHash) {
          isValid = false;
          brokenLinks.push({
            transaction_id: currentLog.transaction_id,
            reason: 'Data hash mismatch (Tampered Data)'
          });
          continue;
        }

        // Verify chain link (except for genesis block)
        if (i > 0) {
          const previousLog = logs[i - 1];
          if (currentLog.previous_hash !== previousLog.data_hash) {
            isValid = false;
            brokenLinks.push({
              transaction_id: currentLog.transaction_id,
              reason: 'Broken chain link (Previous hash mismatch)'
            });
          }
        } else {
          if (currentLog.previous_hash !== 'GENESIS') {
            isValid = false;
            brokenLinks.push({
              transaction_id: currentLog.transaction_id,
              reason: 'Invalid Genesis block'
            });
          }
        }
      }

      return { isValid, brokenLinks, totalChecked: logs.length };
    } catch (error) {
      console.error('Chain verification failed:', error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const getTransactionDetails = useCallback(async (transactionId) => {
    try {
      const record = await pb.collection('audit_logs').getFirstListItem(`transaction_id="${transactionId}"`, {
        expand: 'farmer_id',
        $autoCancel: false
      });
      return record;
    } catch (error) {
      console.error('Failed to fetch transaction details:', error);
      throw error;
    }
  }, []);

  return {
    logAction,
    verifyChain,
    getTransactionDetails,
    isLogging,
    isVerifying
  };
};