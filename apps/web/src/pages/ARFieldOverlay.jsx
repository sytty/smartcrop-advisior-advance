import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Map, AlertTriangle, Droplets, Sprout, X, Maximize, Loader2 } from 'lucide-react';
import { generateGeospatialFields, generateDiseaseHotspots, generateMoistureZones, generateNutrientDeficiencies } from '@/lib/mockData.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useTranslation } from 'react-i18next';

const ARFieldOverlayContent = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [isARMode, setIsARMode] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [activePin, setActivePin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pins, setPins] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const mockFields = generateGeospatialFields(5);
      if (!mockFields || mockFields.length === 0) throw new Error('Failed to load field data');
      
      setFields(mockFields);
      setSelectedField(mockFields[0].id);
      setIsLoading(false);
    } catch (err) {
      console.error('ARFieldOverlay Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedField) {
      const diseases = generateDiseaseHotspots();
      const moisture = generateMoistureZones();
      const nutrients = generateNutrientDeficiencies();
      setPins([...diseases, ...moisture, ...nutrients]);
      setActivePin(null);
    }
  }, [selectedField]);

  useEffect(() => {
    if (isARMode && hasPermission && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isARMode, hasPermission, stream]);

  const requestCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      setHasPermission(true);
      setIsARMode(true);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access is required for AR mode. Falling back to 2D view.");
      setIsARMode(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setHasPermission(false);
    setIsARMode(false);
  };

  const toggleMode = () => {
    if (!isARMode) {
      requestCamera();
    } else {
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getPinColor = (type) => {
    switch (type) {
      case 'disease': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';
      case 'moisture': return 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]';
      case 'nutrient': return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]';
      default: return 'bg-gray-500';
    }
  };

  const getPinIcon = (type) => {
    switch (type) {
      case 'disease': return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'moisture': return <Droplets className="w-4 h-4 text-white" />;
      case 'nutrient': return <Sprout className="w-4 h-4 text-white" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin mb-4" />
        <p className="text-gray-400">{t('intelligence.ar_overlay.loading')}</p>
      </div>
    );
  }

  if (error) throw new Error(error);

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Maximize className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('intelligence.ar_overlay.title')}
          </h1>
          <p className="text-gray-400">{t('intelligence.ar_overlay.subtitle')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 w-full md:w-auto"
        >
          <Select value={selectedField} onValueChange={setSelectedField}>
            <SelectTrigger className="w-full md:w-[250px] bg-white/5 border-white/10 text-white">
              <Map className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('intelligence.ar_overlay.selectField')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              {fields.map(field => (
                <SelectItem key={field.id} value={field.id} className="text-white hover:bg-white/10">
                  {field.name} ({field.cropType})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={toggleMode}
            className={`border-0 ${isARMode ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-gradient-electric text-white hover:brightness-110'}`}
          >
            {isARMode ? (
              <>{t('intelligence.ar_overlay.exitAr')}</>
            ) : (
              <><Camera className="w-4 h-4 mr-2" /> {t('intelligence.ar_overlay.enterAr')}</>
            )}
          </Button>
        </motion.div>
      </div>

      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden glass-card border border-white/10">
        {isARMode && hasPermission ? (
          <div className="absolute inset-0 bg-black">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 pointer-events-none border-2 border-[#00d4ff]/30 m-4 rounded-xl">
              <div className="absolute top-4 left-4 text-[#00d4ff] text-xs font-mono bg-black/50 px-2 py-1 rounded">
                {t('intelligence.ar_overlay.trackingActive')}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#111] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(#1a4d2e 1px, transparent 1px), linear-gradient(90deg, #1a4d2e 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white flex items-center">
              <Map className="w-4 h-4 mr-2 text-[#00d4ff]" />
              {t('intelligence.ar_overlay.topDownView')}
            </div>
          </div>
        )}

        {pins.map((pin) => (
          <button
            key={pin.id}
            onClick={() => setActivePin(pin)}
            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-transform hover:scale-110 z-20 ${getPinColor(pin.type)}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            {getPinIcon(pin.type)}
            <span className="absolute inset-0 rounded-full animate-ping opacity-50 bg-inherit"></span>
          </button>
        ))}

        <AnimatePresence>
          {activePin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-card p-4 rounded-xl border border-white/20 shadow-2xl z-30"
            >
              <button 
                onClick={() => setActivePin(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activePin.type === 'disease' ? 'bg-red-500/20 text-red-400' :
                  activePin.type === 'moisture' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {getPinIcon(activePin.type)}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{activePin.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{t('intelligence.ar_overlay.severity')}:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      activePin.severity === 'severe' ? 'bg-red-500/20 text-red-400' :
                      activePin.severity === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {activePin.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-[#00d4ff] font-medium">{t('intelligence.ar_overlay.action')}:</span> {activePin.action}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="glass-card p-3 rounded-xl border border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-2 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
          <p className="text-xs text-gray-400">{t('intelligence.ar_overlay.diseaseHotspot')}</p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-white/5">
          <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
          <p className="text-xs text-gray-400">{t('intelligence.ar_overlay.lowMoisture')}</p>
        </div>
        <div className="glass-card p-3 rounded-xl border border-white/5">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-2 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
          <p className="text-xs text-gray-400">{t('intelligence.ar_overlay.nutrientDeficit')}</p>
        </div>
      </div>
    </div>
  );
};

const ARFieldOverlay = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('intelligence.ar_overlay.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="ARFieldOverlay">
        <ARFieldOverlayContent />
      </ErrorBoundary>
    </div>
  );
};

export default ARFieldOverlay;