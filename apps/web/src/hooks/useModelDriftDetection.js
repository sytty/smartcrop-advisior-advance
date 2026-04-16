import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useModelDriftDetection = () => {
  const [loading, setLoading] = useState(false);

  const calculateDriftStatus = (currentMetrics, baselineMetrics) => {
    if (!currentMetrics || !baselineMetrics) return { status: 'healthy', triggered: [] };

    const triggered = [];
    
    if (baselineMetrics.accuracy - currentMetrics.accuracy > 5) {
      triggered.push({ metric: 'accuracy', drop: baselineMetrics.accuracy - currentMetrics.accuracy });
    }
    if (baselineMetrics.precision - currentMetrics.precision > 3) {
      triggered.push({ metric: 'precision', drop: baselineMetrics.precision - currentMetrics.precision });
    }
    if (baselineMetrics.recall - currentMetrics.recall > 3) {
      triggered.push({ metric: 'recall', drop: baselineMetrics.recall - currentMetrics.recall });
    }
    if (baselineMetrics.avg_confidence - currentMetrics.avg_confidence > 5) {
      triggered.push({ metric: 'confidence', drop: baselineMetrics.avg_confidence - currentMetrics.avg_confidence });
    }

    let status = 'healthy';
    if (triggered.length > 0) {
      const maxDrop = Math.max(...triggered.map(t => t.drop));
      status = maxDrop > 5 ? 'critical' : 'warning';
    }

    return { status, triggered };
  };

  const getModelMetrics = useCallback(async (startDate, endDate) => {
    setLoading(true);
    try {
      let filter = '';
      if (startDate && endDate) {
        filter = `metric_date >= "${startDate}" && metric_date <= "${endDate}"`;
      }
      
      const records = await pb.collection('model_metrics').getFullList({
        sort: 'metric_date',
        filter,
        $autoCancel: false
      });
      return records;
    } catch (error) {
      console.error('Failed to fetch model metrics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDriftAlert = useCallback(async (driftStatus, triggeredMetrics) => {
    try {
      // In a real app, this might log to an alerts collection.
      // For now, we just return the formatted alert object.
      return {
        id: `alert-${Date.now()}`,
        status: driftStatus,
        metrics: triggeredMetrics,
        timestamp: new Date().toISOString(),
        message: `Model drift detected. ${triggeredMetrics.map(m => `${m.metric} dropped by ${m.drop.toFixed(1)}%`).join(', ')}`
      };
    } catch (error) {
      console.error('Failed to generate drift alert:', error);
      throw error;
    }
  }, []);

  const getHistoricalPerformance = useCallback(async (modelVersion) => {
    try {
      const records = await pb.collection('model_metrics').getFullList({
        filter: `model_version = "${modelVersion}"`,
        sort: 'metric_date',
        $autoCancel: false
      });
      return records;
    } catch (error) {
      console.error('Failed to fetch historical performance:', error);
      throw error;
    }
  }, []);

  const calculateSeasonalVariations = (metrics) => {
    // Group by crop type and calculate averages
    const grouped = metrics.reduce((acc, curr) => {
      if (!acc[curr.crop_type]) {
        acc[curr.crop_type] = { count: 0, accuracySum: 0 };
      }
      acc[curr.crop_type].count += 1;
      acc[curr.crop_type].accuracySum += curr.accuracy;
      return acc;
    }, {});

    return Object.entries(grouped).map(([crop, data]) => ({
      crop_type: crop,
      avg_accuracy: parseFloat((data.accuracySum / data.count).toFixed(2))
    }));
  };

  return {
    loading,
    calculateDriftStatus,
    getModelMetrics,
    generateDriftAlert,
    getHistoricalPerformance,
    calculateSeasonalVariations
  };
};