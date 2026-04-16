import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Bug, ShieldAlert, Info, X, Filter, Bell, Download, Loader2 } from 'lucide-react';
import { generatePestRiskData } from '@/lib/mockData.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GlassCard from '@/components/GlassCard.jsx';
import { useTranslation } from 'react-i18next';

const PestRiskHeatmapContent = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedZone, setSelectedZone] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendPeriod, setTrendPeriod] = useState('7d');

  useEffect(() => {
    try {
      setIsLoading(true);
      const data = generatePestRiskData();
      if (!data || data.length === 0) throw new Error('Failed to load pest risk data');
      
      setZones(data);
      
      const highRiskZones = data.filter(z => z.riskLevel > 75).slice(0, 3);
      setAlerts(highRiskZones.map(z => ({
        id: `alert-${z.id}`,
        pest: z.primaryPest,
        region: z.region,
        area: z.affectedArea,
        action: z.recommendedPesticide,
        urgency: z.riskLevel > 90 ? 'critical' : 'high'
      })));

      setIsLoading(false);
    } catch (err) {
      console.error('PestRiskHeatmap Error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }, [selectedRegion, trendPeriod]);

  const handleExport = () => {
    toast.success('PDF Report generated successfully');
  };

  const filteredZones = selectedRegion === 'all' 
    ? zones 
    : zones.filter(z => z.region === selectedRegion);

  const regions = ['all', ...new Set(zones.map(z => z.region))];

  const getRiskColor = (risk) => {
    if (risk <= 30) return '#22c55e';
    if (risk <= 60) return '#eab308';
    if (risk <= 85) return '#f97316';
    return '#ef4444';
  };

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-white/10 rounded-lg">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-sm" style={{ color: getRiskColor(payload[0].value) }}>
            Risk Level: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-400">{t('monitoring.pest_risk.loading')}</p>
      </div>
    );
  }

  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <Bug className="w-8 h-8 mr-3 text-[#00d4ff]" />
            {t('monitoring.pest_risk.title')}
          </h1>
          <p className="text-gray-400">{t('monitoring.pest_risk.subtitle')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 w-full md:w-auto"
        >
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full md:w-[200px] bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder={t('monitoring.pest_risk.filterRegion')} />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10">
              {regions.map(region => (
                <SelectItem key={region} value={region} className="text-white hover:bg-white/10">
                  {region === 'all' ? 'All Regions' : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleExport} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> {t('monitoring.pest_risk.exportPdf')}
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-white/10 relative h-[600px]"
        >
          <div className="absolute top-4 right-4 z-[400] glass-card p-4 rounded-xl border border-white/10 shadow-lg">
            <h4 className="text-sm font-semibold text-white mb-3">{t('monitoring.pest_risk.riskLevels')}</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2 opacity-60"></span>
                {t('monitoring.pest_risk.low')}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2 opacity-60"></span>
                {t('monitoring.pest_risk.moderate')}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-3 h-3 rounded-full bg-orange-500 mr-2 opacity-60"></span>
                {t('monitoring.pest_risk.high')}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2 opacity-60"></span>
                {t('monitoring.pest_risk.critical')}
              </div>
            </div>
          </div>

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
            {filteredZones.map((zone) => (
              <Circle
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getRiskColor(zone.riskLevel),
                  fillColor: getRiskColor(zone.riskLevel),
                  fillOpacity: 0.3,
                  weight: 1
                }}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              >
                <Popup className="custom-popup">
                  <div className="text-center">
                    <p className="font-bold text-white mb-1">{zone.region} Zone</p>
                    <p className="text-sm text-gray-300">Click for detailed analysis</p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-red-400" />
              {t('monitoring.pest_risk.activeAlerts')}
            </h3>
            <div className="space-y-4">
              {alerts.length > 0 ? alerts.map(alert => (
                <div key={alert.id} className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${alert.urgency === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{alert.pest}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      alert.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {alert.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{alert.region} • {alert.area.toLocaleString()} ha affected</p>
                  <div className="flex items-center text-sm text-[#00d4ff]">
                    <ShieldAlert className="w-4 h-4 mr-1" />
                    Action: {alert.action}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400">{t('monitoring.pest_risk.noAlerts')}</p>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedZone ? (
              <motion.div 
                key="details"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-6 rounded-2xl border border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.1)]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedZone.region} Analysis</h3>
                    <p className="text-sm text-gray-400">Zone ID: {selectedZone.id.split('-')[2]}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedZone(null)}
                    className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">{t('monitoring.pest_risk.primaryThreat')}</p>
                    <p className="font-semibold text-white">{selectedZone.primaryPest}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-gray-400 mb-1">{t('monitoring.pest_risk.currentRisk')}</p>
                    <p className="font-bold text-xl" style={{ color: getRiskColor(selectedZone.riskLevel) }}>
                      {selectedZone.riskLevel}%
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-white">{t('monitoring.pest_risk.progression')}</h4>
                    <Select value={trendPeriod} onValueChange={setTrendPeriod}>
                      <SelectTrigger className="w-[100px] h-8 text-xs bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10">
                        <SelectItem value="7d" className="text-white hover:bg-white/10 text-xs">7 Days</SelectItem>
                        <SelectItem value="30d" className="text-white hover:bg-white/10 text-xs">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[150px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedZone.progression}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={5} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={[0, 100]} />
                        <RechartsTooltip content={<CustomChartTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="risk" 
                          stroke="#00d4ff" 
                          strokeWidth={2} 
                          dot={{ fill: '#00d4ff', r: 3 }} 
                          activeDot={{ r: 5, fill: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#1a4d2e]/20 border border-[#1a4d2e]/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2 text-[#22c55e]" />
                    {t('monitoring.pest_risk.recommendation')}
                  </h4>
                  <p className="text-sm text-gray-300">
                    Apply <span className="font-semibold text-[#00d4ff]">{selectedZone.recommendedPesticide}</span> across {selectedZone.affectedArea.toLocaleString()} hectares immediately to prevent further spread.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="glass-card p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center h-[400px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Info className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">{t('monitoring.pest_risk.selectZone')}</h3>
                <p className="text-sm text-gray-400 max-w-[250px]">
                  {t('monitoring.pest_risk.selectZoneDesc')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const PestRiskHeatmap = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('monitoring.pest_risk.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="PestRiskHeatmap">
        <PestRiskHeatmapContent />
      </ErrorBoundary>
    </div>
  );
};

export default PestRiskHeatmap;