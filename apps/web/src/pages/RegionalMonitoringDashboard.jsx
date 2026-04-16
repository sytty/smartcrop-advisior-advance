import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Map, Activity, AlertTriangle, Bug, Download, Filter, Loader2, Sparkles } from 'lucide-react';
import { generateRegionalOutbreakData, generatePestRiskByRegion, generateAlertTimeline } from '@/lib/mockData.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import RegionalOutbreakCard from '@/components/RegionalOutbreakCard.jsx';
import AlertTimelineItem from '@/components/AlertTimelineItem.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const RegionalMonitoringDashboardContent = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const [outbreaks, setOutbreaks] = useState([]);
  const [pestRisks, setPestRisks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [regionFilter, setRegionFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const mockOutbreaks = generateRegionalOutbreakData();
      const mockRisks = generatePestRiskByRegion();
      const mockAlerts = generateAlertTimeline();

      if (!mockOutbreaks || !mockRisks || !mockAlerts) {
        throw new Error('Failed to load regional monitoring data');
      }

      setOutbreaks(mockOutbreaks);
      setPestRisks(mockRisks);
      setAlerts(mockAlerts);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [currentUser]);

  const filteredOutbreaks = regionFilter === 'all' ? outbreaks : outbreaks.filter((o) => o.region === regionFilter);
  const filteredRisks = regionFilter === 'all' ? pestRisks : pestRisks.filter((r) => r.region === regionFilter);
  const regions = ['all', ...new Set(pestRisks.map((r) => r.region))];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return 'text-emerald-700 bg-emerald-500/10 border-emerald-500/25';
      case 'medium':
        return 'text-amber-700 bg-amber-500/10 border-amber-500/25';
      case 'high':
        return 'text-orange-700 bg-orange-500/10 border-orange-500/25';
      case 'critical':
        return 'text-red-700 bg-red-500/10 border-red-500/25';
      default:
        return 'text-muted-foreground bg-card border-border/70';
    }
  };

  const handleExport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Region,Risk Level,Common Pest\n'
      + filteredRisks.map((r) => `${r.region},${r.riskLevel},${r.commonPest}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'regional_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="glass-card rounded-[2rem] p-8 md:p-10 text-center max-w-md w-full">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4 mx-auto" />
          <div className="h-4 w-52 loading-shimmer rounded-full mx-auto mb-3" />
          <div className="h-3 w-64 loading-shimmer rounded-full mx-auto" />
          <p className="text-muted-foreground mt-4">{t('monitoring.regional_monitoring.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) throw new Error(error);

  return (
    <div className="max-w-7xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Sparkles className="w-3 h-3 mr-1" /> Regional intelligence network
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <Map className="w-8 h-8 mr-3 text-primary" />
              {t('monitoring.regional_monitoring.title')}
            </h1>
            <p className="text-muted-foreground">{t('monitoring.regional_monitoring.subtitle')}</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full md:w-[220px] rounded-xl border-primary/30 bg-card/70">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('monitoring.regional_monitoring.filterRegion')} />
              </SelectTrigger>
              <SelectContent className="glass-card border-border/70">
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline" className="rounded-xl border-primary/30 bg-card/70">
              <Download className="w-4 h-4 mr-2" /> {t('monitoring.regional_monitoring.export')}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="elevated-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-medium">{t('monitoring.regional_monitoring.totalFields')}</h3>
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Map className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">1,203</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="elevated-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-medium">{t('monitoring.regional_monitoring.avgHealth')}</h3>
            <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center">
              <Activity className="w-4 h-4 text-secondary" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-foreground">84</p>
            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="elevated-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-medium">{t('monitoring.regional_monitoring.activeOutbreaks')}</h3>
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{outbreaks.length}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="elevated-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground text-sm font-medium">{t('monitoring.regional_monitoring.criticalZones')}</h3>
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
              <Bug className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{pestRisks.filter((r) => r.riskLevel === 'critical').length}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            {t('monitoring.regional_monitoring.activeOutbreaksTitle')}
          </h3>
          <div className="space-y-4">
            {filteredOutbreaks.length > 0 ? (
              filteredOutbreaks.map((outbreak) => (
                <RegionalOutbreakCard key={outbreak.id} outbreak={outbreak} />
              ))
            ) : (
              <div className="glass-card p-6 rounded-2xl text-center border border-border/70">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                <p className="font-semibold text-foreground mb-1">{t('monitoring.regional_monitoring.noOutbreaks')}</p>
                <p className="text-sm text-muted-foreground">No active outbreaks match the selected region right now.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-foreground flex items-center">
            <Bug className="w-5 h-5 mr-2 text-orange-600" />
            {t('monitoring.regional_monitoring.pestRiskTitle')}
          </h3>
          <div className="glass-card rounded-2xl border border-border/70 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-card/70 border-b border-border/70 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t('monitoring.regional_monitoring.region')}</th>
                    <th className="px-6 py-4 font-medium">{t('monitoring.regional_monitoring.riskLevel')}</th>
                    <th className="px-6 py-4 font-medium">{t('monitoring.regional_monitoring.commonPest')}</th>
                    <th className="px-6 py-4 font-medium">{t('monitoring.regional_monitoring.recommendedAction')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 text-foreground font-medium">{risk.region}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getRiskColor(risk.riskLevel)}`}>
                          {risk.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{risk.commonPest}</td>
                      <td className="px-6 py-4 text-muted-foreground">{risk.recommendedAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-border/70">
        <h3 className="text-xl font-bold text-foreground mb-6">{t('monitoring.regional_monitoring.timelineTitle')}</h3>
        <div className="max-w-3xl">
          {alerts.map((alert) => (
            <AlertTimelineItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RegionalMonitoringDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('monitoring.regional_monitoring.title')} - Smart Crop Advisor</title>
      </Helmet>
      <ErrorBoundary componentName="RegionalMonitoringDashboard">
        <RegionalMonitoringDashboardContent />
      </ErrorBoundary>
    </div>
  );
};

export default RegionalMonitoringDashboard;
