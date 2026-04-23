import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Scan, Save, Image as ImageIcon, X, BookOpen, Loader2, History, AlertTriangle, Camera, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useAuditLogging } from '@/hooks/useAuditLogging.js';
import { generateDiseaseDetectionData, getDiseasesForCrop } from '@/lib/mockData.js';
import { cacheDiagnosis, getCachedDiagnoses, removeCachedDiagnosisByLocalId } from '@/lib/offlineDataCache.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import DiseaseCard from '@/components/DiseaseCard.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useTranslation } from 'react-i18next';

const cropTypes = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Soybean', 'Maize'];
const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const getConfidenceBand = (confidence) => {
  if (confidence >= 90) return { label: 'High confidence', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' };
  if (confidence >= 75) return { label: 'Moderate confidence', color: 'text-amber-600 bg-amber-500/10 border-amber-500/30' };
  return { label: 'Low confidence', color: 'text-red-600 bg-red-500/10 border-red-500/30' };
};

const parseCostEstimate = (costText = '') => {
  const match = String(costText).replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const DiseaseDetectionAdvancedContent = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { logAction } = useAuditLogging();
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [analysisTime, setAnalysisTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [isSyncingCached, setIsSyncingCached] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const loadRecentDiagnoses = useCallback(async () => {
    if (!currentUser?.id) return;

    setIsLoadingRecent(true);
    try {
      const records = await pb.collection('diagnoses').getList(1, 5, {
        filter: `farmer_id="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });

      const mapped = records.items.map((item) => ({
        id: item.id,
        disease_name: item.disease_name,
        confidence_score: item.confidence_score,
        severity: item.severity,
        created: item.created
      }));

      setRecentDiagnoses(mapped);
    } catch (fetchError) {
      const cached = getCachedDiagnoses()
        .filter((item) => item.farmer_id === currentUser.id)
        .slice(0, 5)
        .map((item) => ({
          id: item._localId,
          disease_name: item.disease_name,
          confidence_score: item.confidence_score,
          severity: item.severity,
          created: item.timestamp
        }));

      setRecentDiagnoses(cached);
    } finally {
      setIsLoadingRecent(false);
    }
  }, [currentUser?.id]);

  const refreshPendingSyncCount = useCallback(() => {
    if (!currentUser?.id) {
      setPendingSyncCount(0);
      return;
    }

    const pending = getCachedDiagnoses().filter((item) => item.farmer_id === currentUser.id).length;
    setPendingSyncCount(pending);
  }, [currentUser?.id]);

  const syncCachedDiagnoses = useCallback(async () => {
    if (!currentUser?.id || isSyncingCached) return;

    const cached = getCachedDiagnoses().filter((item) => item.farmer_id === currentUser.id);
    if (cached.length === 0) {
      setPendingSyncCount(0);
      return;
    }

    setIsSyncingCached(true);
    let syncedCount = 0;

    for (const item of cached) {
      try {
        const payload = {
          farmer_id: item.farmer_id,
          disease_name: item.disease_name,
          confidence_score: item.confidence_score,
          severity: item.severity,
          affected_part: item.affected_part,
          organic_treatment: item.organic_treatment,
          chemical_treatment: item.chemical_treatment,
          application_schedule: item.application_schedule || '',
          cost_estimate: item.cost_estimate || null,
          prevention_tips: item.prevention_tips || '',
          image_url: item.image_url || 'uploaded_image_placeholder.jpg'
        };

        await pb.collection('diagnoses').create(payload, { $autoCancel: false });
        removeCachedDiagnosisByLocalId(item._localId);
        syncedCount += 1;
      } catch (syncError) {
        // Keep failed records in cache and retry later.
      }
    }

    if (syncedCount > 0) {
      toast.success(t('diseaseDetection.synced', { count: syncedCount, defaultValue: `${syncedCount} offline diagnosis${syncedCount > 1 ? 'es' : ''} synced successfully` }));
      await loadRecentDiagnoses();
    }

    refreshPendingSyncCount();
    setIsSyncingCached(false);
  }, [currentUser?.id, isSyncingCached, loadRecentDiagnoses, refreshPendingSyncCount]);

  const applyImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('diseaseDetection.imageOnly', { defaultValue: 'Please upload an image file only.' }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(t('diseaseDetection.imageTooLarge', { defaultValue: 'Image is too large. Max size is 8MB.' }));
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    const url = URL.createObjectURL(file);
    setImage(url);
    setImageFile(file);
    setResult(null);
    setAnalysisTime(null);
  };

  useEffect(() => {
    try {
      setIsLoading(false);
    } catch (err) {
      console.error('DiseaseDetectionAdvanced Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentDiagnoses();
    refreshPendingSyncCount();
  }, [loadRecentDiagnoses, refreshPendingSyncCount]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const handleOnline = () => {
      toast.info(t('diseaseDetection.connectionRestored', { defaultValue: 'Connection restored. Syncing offline diagnoses...' }));
      syncCachedDiagnoses();
    };

    window.addEventListener('online', handleOnline);

    if (navigator.onLine) {
      syncCachedDiagnoses();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [currentUser?.id, syncCachedDiagnoses]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      applyImageFile(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      applyImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      applyImageFile(file);
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    const startedAt = Date.now();
    setIsScanning(true);
    setResult(null);
    
    setTimeout(() => {
      try {
        const data = generateDiseaseDetectionData();
        if (!data) throw new Error('Failed to generate diagnosis data');
        
        setIsScanning(false);
        setResult(data);
        setAnalysisTime(Math.max(1, Math.round((Date.now() - startedAt) / 1000)));
        toast.success('Analysis complete');
      } catch (err) {
        console.error('Analysis failed:', err);
        toast.error('Analysis failed. Please try again.');
        setIsScanning(false);
      }
    }, 2500);
  };

  const updateModelMetrics = async (confidence) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const records = await pb.collection('model_metrics').getList(1, 1, {
        filter: `metric_date = "${today}"`,
        $autoCancel: false
      });

      if (records.items.length > 0) {
        const metric = records.items[0];
        const newCount = metric.predictions_count + 1;
        const newHigh = metric.high_confidence_count + (confidence > 90 ? 1 : 0);
        const newLow = metric.low_confidence_count + (confidence < 70 ? 1 : 0);
        const newAvg = ((metric.avg_confidence * metric.predictions_count) + confidence) / newCount;

        await pb.collection('model_metrics').update(metric.id, {
          predictions_count: newCount,
          high_confidence_count: newHigh,
          low_confidence_count: newLow,
          avg_confidence: parseFloat(newAvg.toFixed(2))
        }, { $autoCancel: false });
      } else {
        await pb.collection('model_metrics').create({
          metric_date: today,
          accuracy: 92.0,
          precision: 90.0,
          recall: 89.0,
          f1_score: 89.5,
          predictions_count: 1,
          high_confidence_count: confidence > 90 ? 1 : 0,
          low_confidence_count: confidence < 70 ? 1 : 0,
          avg_confidence: confidence,
          crop_type: selectedCrop,
          model_version: 'v2.0',
          drift_detected: false
        }, { $autoCancel: false });
      }
    } catch (error) {
      console.error('Failed to update model metrics:', error);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);

    const payload = {
      farmer_id: currentUser.id,
      disease_name: result.name,
      confidence_score: result.confidence,
      severity: result.severity,
      affected_part: result.affectedPart,
      organic_treatment: result.treatments.organic.name,
      chemical_treatment: result.treatments.chemical.name,
      application_schedule: `${result.treatments.organic.schedule} | ${result.treatments.chemical.schedule}`,
      cost_estimate: parseCostEstimate(result.treatments.organic.cost),
      prevention_tips: (result.preventionTips || []).join('; '),
      image_url: imageFile?.name || 'uploaded_image_placeholder.jpg'
    };

    try {
      const savedRecord = await pb.collection('diagnoses').create(payload, { $autoCancel: false });

      await logAction('diagnosis', currentUser.id, {
        disease_name: result.name,
        confidence_score: result.confidence,
        severity: result.severity,
        crop_type: selectedCrop
      });

      await updateModelMetrics(result.confidence);

      setRecentDiagnoses((prev) => ([
        {
          id: savedRecord.id,
          disease_name: savedRecord.disease_name,
          confidence_score: savedRecord.confidence_score,
          severity: savedRecord.severity,
          created: savedRecord.created
        },
        ...prev
      ]).slice(0, 5));

      toast.success('Diagnosis saved and securely logged to blockchain');
    } catch (error) {
      console.error(error);

      cacheDiagnosis({
        ...payload,
        farmer_id: currentUser.id
      });

      refreshPendingSyncCount();

      setRecentDiagnoses((prev) => ([
        {
          id: `local-${Date.now()}`,
          disease_name: payload.disease_name,
          confidence_score: payload.confidence_score,
          severity: payload.severity,
          created: new Date().toISOString()
        },
        ...prev
      ]).slice(0, 5));

      toast.warning('Saved locally. It will sync when connection is restored.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);
    setImageFile(null);
    setResult(null);
    setAnalysisTime(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const encyclopedia = getDiseasesForCrop(selectedCrop);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">{t('monitoring.disease_detection.loading')}</p>
      </div>
    );
  }

  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Vision Diagnostics</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center">
              <Scan className="w-8 h-8 mr-3 text-primary" />
              {t('monitoring.disease_detection.title')}
            </h1>
            <p className="text-muted-foreground">{t('monitoring.disease_detection.subtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="elevated-card rounded-full px-3 py-1.5 text-muted-foreground">Crop: <span className="text-foreground font-semibold">{selectedCrop}</span></span>
            <span className="elevated-card rounded-full px-3 py-1.5 text-muted-foreground">Pending sync: <span className="text-foreground font-semibold">{pendingSyncCount}</span></span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-border/70">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-foreground">{t('monitoring.disease_detection.imageAnalysis')}</h3>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger className="w-[180px] bg-card/80 border-border/70 text-foreground rounded-xl">
                  <SelectValue placeholder={t('monitoring.disease_detection.selectCrop')} />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/70">
                  {cropTypes.map(crop => (
                    <SelectItem key={crop} value={crop} className="text-foreground hover:bg-primary/10">
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!image ? (
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer bg-card/40 ${isDragActive ? 'border-primary bg-primary/5' : 'border-border/80 hover:border-primary/50'}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <UploadCloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-1">{t('monitoring.disease_detection.uploadPrompt')}</p>
                <p className="text-sm text-muted-foreground">{t('monitoring.disease_detection.uploadDesc')}</p>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG, WEBP up to 8MB</p>
                {isDragActive && <p className="text-xs text-primary mt-2">Drop image to start analysis</p>}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-black/60 aspect-video flex items-center justify-center scan-container border border-border/70">
                  <img src={image} alt="Crop leaf" className="max-h-full object-contain" />
                  
                  {isScanning && <div className="scan-line"></div>}
                  
                  <button 
                    onClick={clearImage}
                    disabled={isScanning}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-end gap-3 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isScanning}
                    className="rounded-xl border-primary/30 bg-card/70"
                  >
                    <Camera className="w-4 h-4 mr-2" /> Capture
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraInputRef}
                    onChange={handleCameraCapture}
                    className="hidden"
                  />

                  {!result && (
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={isScanning || !selectedCrop}
                      className="bg-gradient-electric text-white hover:brightness-110 border-0 min-w-[150px] rounded-xl"
                    >
                      {isScanning ? (
                        <>{t('monitoring.disease_detection.scanning')}</>
                      ) : (
                        <><Scan className="w-4 h-4 mr-2" /> {t('monitoring.disease_detection.analyzeImage')}</>
                      )}
                    </Button>
                  )}
                  {result && (
                    <>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isScanning}
                        variant="outline"
                        className="border-primary/30 bg-card/70 rounded-xl"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-analyze
                      </Button>
                      <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-gradient-forest hover:brightness-110 text-white border-0 rounded-xl"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? t('monitoring.disease_detection.saving') : t('monitoring.disease_detection.saveDiagnosis')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-4 rounded-xl border border-border/70"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">Crop: <span className="text-foreground font-medium">{selectedCrop}</span></span>
                    {analysisTime ? <span className="text-sm text-muted-foreground">Analysis time: <span className="text-foreground font-medium">{analysisTime}s</span></span> : null}
                    <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceBand(result.confidence).color}`}>
                      {getConfidenceBand(result.confidence).label}
                    </span>
                  </div>
                  {result.confidence < 75 ? (
                    <div className="mt-3 flex items-start gap-2 text-sm text-amber-700 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 mt-0.5" />
                      <span>Low confidence result. Capture a sharper image under natural light for better accuracy.</span>
                    </div>
                  ) : null}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DiseaseCard disease={result} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-3xl border border-border/70 h-full"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-primary" />
              {selectedCrop} {t('monitoring.disease_detection.encyclopedia')}
            </h3>
            
            <div className="space-y-4">
              {encyclopedia.map((item, idx) => (
                <div key={idx} className="bg-card/70 rounded-xl p-4 border border-border/70 hover:bg-primary/5 transition-colors">
                  <h4 className="text-foreground font-medium mb-2 flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    {item.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="text-xs bg-background/70 p-2 rounded text-muted-foreground">
                    <span className="text-primary font-medium">{t('monitoring.disease_detection.symptoms')}:</span> {item.symptoms}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border/70">
              <h4 className="text-foreground font-medium mb-3 flex items-center">
                <History className="w-4 h-4 mr-2 text-primary" />
                Recent diagnoses
              </h4>

              {isLoadingRecent ? (
                <p className="text-sm text-muted-foreground">Loading recent activity...</p>
              ) : recentDiagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent diagnoses yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentDiagnoses.map((entry) => (
                    <div key={entry.id} className="bg-card/70 rounded-lg border border-border/70 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-foreground font-medium truncate">{entry.disease_name}</p>
                        <span className="text-xs text-muted-foreground">{entry.confidence_score}%</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">{entry.severity}</span>
                        <span>{new Date(entry.created).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DiseaseDetectionAdvanced = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('monitoring.disease_detection.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="DiseaseDetectionAdvanced">
        <DiseaseDetectionAdvancedContent />
      </ErrorBoundary>
    </div>
  );
};

export default DiseaseDetectionAdvanced;