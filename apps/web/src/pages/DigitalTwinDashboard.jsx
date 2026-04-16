import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, Map, Sprout, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { generateGeospatialFields, updateFieldHealthScores, generateRegionalStats } from '@/lib/mockData.js';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useTranslation } from 'react-i18next';

const DigitalTwinDashboardContent = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({ totalFields: 0, avgHealth: 0, alerts: 0, mostCommonCrop: '' });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLayer, setActiveLayer] = useState('health');

  useEffect(() => {
    try {
      setIsLoading(true);
      const initialFields = generateGeospatialFields(100);
      if (!initialFields || initialFields.length === 0) throw new Error('Failed to load map data');
      
      setFields(initialFields);
      setStats(generateRegionalStats(initialFields));
      setIsLoading(false);
    } catch (err) {
      console.error('DigitalTwinDashboard Error:', err);
      setError(err.message);
      setIsLoading(false);
    }

    const interval = setInterval(() => {
      try {
        setFields(prevFields => {
          const updatedFields = updateFieldHealthScores(prevFields);
          setStats(generateRegionalStats(updatedFields));
          setLastUpdated(new Date());
          return updatedFields;
        });
      } catch (err) {
        console.error('Real-time update failed:', err);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeLayer]);

  const handleFieldClick = (field) => {
    console.log('Selected field data:', field);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#22c55e';
      case 'warning': return '#eab308';
      case 'critical': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#00d4ff] animate-spin mb-4" />
        <p className="text-gray-400">{t('monitoring.digital_twin.initializing')}</p>
      </div>
    );
  }

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Map className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('monitoring.digital_twin.title')}
          </h1>
          <p className="text-gray-400">{t('monitoring.digital_twin.subtitle')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          <RefreshCw className="w-4 h-4 mr-2 animate-spin-slow text-[#00d4ff]" style={{ animationDuration: '3s' }} />
          {t('monitoring.digital_twin.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{t('monitoring.digital_twin.totalFields')}</h3>
            <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/20 flex items-center justify-center">
              <Map className="w-4 h-4 text-[#00d4ff]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalFields}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{t('monitoring.digital_twin.avgHealth')}</h3>
            <div className="w-8 h-8 rounded-lg bg-[#1a4d2e]/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#2d7a4f]" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-white">{stats.avgHealth}</p>
            <span className="text-sm text-gray-400 mb-1">/ 100</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{t('monitoring.digital_twin.activeAlerts')}</h3>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.alerts}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">{t('monitoring.digital_twin.primaryCrop')}</h3>
            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.mostCommonCrop}</p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl overflow-hidden border border-white/10 relative"
      >
        <div className="absolute top-4 right-4 z-[400] glass-card p-4 rounded-xl border border-white/10 shadow-lg">
          <h4 className="text-sm font-semibold text-white mb-3">{t('monitoring.digital_twin.healthStatus')}</h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              {t('monitoring.digital_twin.healthy')}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
              {t('monitoring.digital_twin.warning')}
            </div>
            <div className="flex items-center text-sm text-gray-300">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
              {t('monitoring.digital_twin.critical')}
            </div>
          </div>
        </div>

        <div className="h-[600px] w-full bg-[#0a0a0a]">
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={5} 
            style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {fields.map((field) => (
              <CircleMarker
                key={field.id}
                center={[field.lat, field.lng]}
                radius={6}
                pathOptions={{
                  color: getStatusColor(field.status),
                  fillColor: getStatusColor(field.status),
                  fillOpacity: 0.7,
                  weight: 2
                }}
                eventHandlers={{
                  click: () => handleFieldClick(field)
                }}
              >
                <Tooltip className="custom-tooltip" direction="top" offset={[0, -10]} opacity={1}>
                  <div className="p-2 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-xl min-w-[150px]">
                    <p className="font-bold text-white mb-1">{field.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{field.region}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Crop:</span>
                      <span className="text-white font-medium">{field.cropType}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-gray-300">Health:</span>
                      <span className="font-bold" style={{ color: getStatusColor(field.status) }}>
                        {field.healthScore}/100
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </motion.div>
    </div>
  );
};

const DigitalTwinDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('monitoring.digital_twin.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="DigitalTwinDashboard">
        <DigitalTwinDashboardContent />
      </ErrorBoundary>
    </div>
  );
};

export default DigitalTwinDashboard;