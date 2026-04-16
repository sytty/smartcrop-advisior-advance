import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { generateModelMetricsHistory } from '@/lib/mockData.js';

export const useModelMetricsSeeding = () => {
  const [isSeeding, setIsSeeding] = useState(false);

  const seedMetricsIfEmpty = useCallback(async () => {
    setIsSeeding(true);
    try {
      const existing = await pb.collection('model_metrics').getList(1, 1, { $autoCancel: false });
      
      if (existing.totalItems === 0) {
        console.log('Seeding model_metrics collection...');
        const history = generateModelMetricsHistory();
        
        for (const record of history) {
          await pb.collection('model_metrics').create(record, { $autoCancel: false });
        }
        console.log('Seeding complete.');
      }
    } catch (error) {
      console.error('Failed to seed model metrics:', error);
    } finally {
      setIsSeeding(false);
    }
  }, []);

  return { seedMetricsIfEmpty, isSeeding };
};