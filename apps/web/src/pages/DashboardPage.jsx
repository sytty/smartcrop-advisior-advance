import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Sprout, Droplets, AlertTriangle, ArrowUpRight, Settings, LogOut, BarChart3, Radar, CloudSun, MapPinned, Wheat, UserCog, FlaskConical, TrendingDown, ThermometerSun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import farmManagementApi from '@/lib/farmManagementApi.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationCenterButton from '@/components/NotificationCenterButton.jsx';

function getAnomalyFlags(t, metrics = {}, activeAlerts = 0) {
  const flags = [];

  if ((metrics.averageFieldHealth || 0) < 65) {
    flags.push({
      id: 'field-health',
      level: 'high',
      title: t('dashboardPage.anomaly.fieldHealth.title', { defaultValue: 'Field health dropped' }),
      message: t('dashboardPage.anomaly.fieldHealth.message', { value: metrics.averageFieldHealth || 0, defaultValue: `Average field health is ${metrics.averageFieldHealth || 0}%. Prioritize field inspections this week.` }),
    });
  }

  if ((metrics.averageDiseaseRisk || 0) >= 60 || (metrics.averagePestRisk || 0) >= 60) {
    flags.push({
      id: 'bio-risk',
      level: 'high',
      title: t('dashboardPage.anomaly.bioRisk.title', { defaultValue: 'Disease or pest pressure rising' }),
      message: t('dashboardPage.anomaly.bioRisk.message', { disease: metrics.averageDiseaseRisk || 0, pest: metrics.averagePestRisk || 0, defaultValue: `Disease risk ${metrics.averageDiseaseRisk || 0}% and pest risk ${metrics.averagePestRisk || 0}% need immediate control plans.` }),
    });
  }

  if ((metrics.averageWaterUsage || 0) > 1400) {
    flags.push({
      id: 'water-usage',
      level: 'medium',
      title: t('dashboardPage.anomaly.waterUsage.title', { defaultValue: 'Water usage anomaly' }),
      message: t('dashboardPage.anomaly.waterUsage.message', { value: metrics.averageWaterUsage || 0, defaultValue: `Average water usage is ${metrics.averageWaterUsage || 0} L. Tune irrigation cycles to reduce waste.` }),
    });
  }

  if (activeAlerts > 5) {
    flags.push({
      id: 'alerts-overload',
      level: 'medium',
      title: t('dashboardPage.anomaly.alertVolume.title', { defaultValue: 'Alert volume elevated' }),
      message: t('dashboardPage.anomaly.alertVolume.message', { value: activeAlerts, defaultValue: `${activeAlerts} active alerts may reduce response quality. Prioritize and close stale alerts.` }),
    });
  }

  if (!flags.length) {
    flags.push({
      id: 'stable',
      level: 'normal',
      title: t('dashboardPage.anomaly.stable.title', { defaultValue: 'Operations stable' }),
      message: t('dashboardPage.anomaly.stable.message', { defaultValue: 'No critical anomalies detected across current field and crop metrics.' }),
    });
  }

  return flags;
}

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [anomalyFlags, setAnomalyFlags] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [performanceData, alerts, feed] = await Promise.all([
          farmManagementApi.getPerformance({
            farmerId: currentUser.id,
            scope: currentUser?.role === 'admin' ? 'all' : '',
          }),
          pb.collection('notifications').getList(1, 1, { filter: `user_id="${currentUser.id}" && is_read=false`, $autoCancel: false }),
          pb.collection('activity_feed').getList(1, 5, { filter: `user_id="${currentUser.id}"`, sort: '-created', $autoCancel: false }),
        ]);

        const metrics = performanceData?.metrics || {};
        const activeAlerts = alerts.totalItems;
        
        setStats({
          fields: metrics.fields || 0,
          healthScore: metrics.averageFieldHealth || 0,
          waterSaved: `${Math.max(0, 18000 - (metrics.averageWaterUsage || 0) * Math.max(1, metrics.crops || 1)).toLocaleString(i18n.language || 'en')} ${t('dashboardPage.units.liter', { defaultValue: 'L' })}`,
          activeAlerts,
          avgYield: metrics.averageYield || 0,
          profitability: metrics.averageProfitability || 0,
          riskPressure: Math.round(((metrics.averageDiseaseRisk || 0) + (metrics.averagePestRisk || 0)) / 2),
          score: performanceData?.score || 0,
        });
        setPerformance(performanceData);
        setAnomalyFlags(getAnomalyFlags(t, metrics, activeAlerts));
        setActivities(feed.items);
        setLoading(false);
      } catch (error) {
        console.error('[Dashboard] Failed to load data:', error);
        toast.error('Unable to load dashboard data. The server may be offline. Please try again later.');
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchDashboardData();
      
      // Real-time subscription
      pb.collection('activity_feed').subscribe('*', function (e) {
        if (e.action === 'create' && e.record.user_id === currentUser.id) {
          setActivities(prev => [e.record, ...prev].slice(0, 5));
        }
      });
    }
    
    return () => {
      pb.collection('activity_feed').unsubscribe('*');
    };
  }, [currentUser, i18n.language, t]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const dateLabel = new Date().toLocaleDateString(i18n.language || 'en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-card rounded-[2rem] p-6 md:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">{currentUser?.name?.charAt(0) || 'F'}</AvatarFallback>
            </Avatar>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">{t('dashboardPage.console', { defaultValue: 'Farm Operations Console' })}</p>
                <h1 className="text-3xl font-bold tracking-tight">{t('dashboardPage.welcome', { defaultValue: 'Welcome back' })}, {currentUser?.name || t('dashboardPage.farmer', { defaultValue: 'Farmer' })}</h1>
                <p className="text-muted-foreground mt-1">{dateLabel}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <NotificationCenterButton userId={currentUser?.id} />
              <Button asChild variant="outline" size="icon" className="h-11 w-11 rounded-xl"><Link to="/settings"><Settings className="w-4 h-4" /></Link></Button>
              <Button variant="destructive" size="icon" onClick={logout} className="h-11 w-11 rounded-xl"><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('dashboardPage.readiness.label', { defaultValue: 'Field Readiness' })}</p>
              <p className="text-lg font-bold">{t('dashboardPage.readiness.value', { defaultValue: 'Operational' })}</p>
            </div>
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('dashboardPage.syncStatus.label', { defaultValue: 'Sync Status' })}</p>
              <p className="text-lg font-bold">{t('dashboardPage.syncStatus.value', { defaultValue: 'Online' })}</p>
            </div>
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t('dashboardPage.nextPriority.label', { defaultValue: 'Next Priority' })}</p>
              <p className="text-lg font-bold">{t('dashboardPage.nextPriority.value', { defaultValue: 'Disease scan update' })}</p>
            </div>
          </div>
        </motion.section>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboardPage.cards.activeFields', { defaultValue: 'Active Fields' })}</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold">{stats?.fields}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboardPage.cards.avgHealth', { defaultValue: 'Avg Health Score' })}</CardTitle>
                <Sprout className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-secondary">{stats?.healthScore}%</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboardPage.cards.waterSaved', { defaultValue: 'Water Saved' })}</CardTitle>
                <Droplets className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold">{stats?.waterSaved}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="rounded-2xl border-destructive/50 bg-destructive/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                <CardTitle className="text-sm font-medium text-destructive">{t('dashboardPage.cards.activeAlerts', { defaultValue: 'Active Alerts' })}</CardTitle>
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-destructive">{stats?.activeAlerts}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="rounded-2xl border-border/70 elevated-card">
            <CardHeader className="px-4 pt-4 pb-2"><CardTitle className="text-sm text-muted-foreground">{t('dashboardPage.cards.performanceScore', { defaultValue: 'Performance Score' })}</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{stats?.score || performance?.score || 0}/100</p>}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 elevated-card">
            <CardHeader className="px-4 pt-4 pb-2"><CardTitle className="text-sm text-muted-foreground">{t('dashboardPage.cards.avgYield', { defaultValue: 'Avg Yield' })}</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{stats?.avgYield || 0}</p>}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 elevated-card">
            <CardHeader className="px-4 pt-4 pb-2"><CardTitle className="text-sm text-muted-foreground">{t('dashboardPage.cards.profitability', { defaultValue: 'Profitability' })}</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{stats?.profitability || 0}%</p>}
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 elevated-card">
            <CardHeader className="px-4 pt-4 pb-2"><CardTitle className="text-sm text-muted-foreground">{t('dashboardPage.cards.riskPressure', { defaultValue: 'Risk Pressure' })}</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4 flex items-center justify-between">
              {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-3xl font-bold">{stats?.riskPressure || 0}%</p>}
              <TrendingDown className={`w-5 h-5 ${(stats?.riskPressure || 0) > 55 ? 'text-destructive' : 'text-emerald-500'}`} />
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-3xl border-border/70 elevated-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('dashboardPage.anomaly.title', { defaultValue: 'Anomaly Flags' })}</CardTitle>
            <ThermometerSun className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array(2).fill(0).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-2xl" />)
            ) : anomalyFlags.map((flag) => (
              <div
                key={flag.id}
                className={`rounded-2xl border p-3 sm:p-4 ${flag.level === 'high' ? 'border-destructive/40 bg-destructive/10' : flag.level === 'medium' ? 'border-amber-500/30 bg-amber-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}
              >
                <p className="font-semibold text-sm sm:text-base">{flag.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{flag.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 elevated-card rounded-3xl border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('dashboardPage.recentActivity.title', { defaultValue: 'Recent Activity' })}</CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-primary/30">
                <Link to="/analytics">{t('dashboardPage.recentActivity.viewAnalytics', { defaultValue: 'View analytics' })}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full loading-shimmer rounded-2xl" />)
                ) : activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card/70 p-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.action_description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(activity.created).toLocaleString(i18n.language || 'en')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 px-6 py-10 text-center">
                    <Activity className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                    <p className="font-semibold text-foreground mb-1">{t('dashboardPage.recentActivity.none', { defaultValue: 'No recent activity' })}</p>
                    <p className="text-sm text-muted-foreground">{t('dashboardPage.recentActivity.hint', { defaultValue: 'Actions you take across the farm will appear here in real time.' })}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle>{t('dashboardPage.quickActions.title', { defaultValue: 'Quick Actions' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/disease-detection-advanced">
                {t('dashboardPage.quickActions.logTreatment', { defaultValue: 'Log Treatment' })} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/drone-monitoring">
                {t('dashboardPage.quickActions.scheduleDrone', { defaultValue: 'Schedule Drone' })} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/predictive-weather">
                {t('dashboardPage.quickActions.viewWeather', { defaultValue: 'View Weather' })} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/fields">
                {t('dashboardPage.quickActions.fieldManagement', { defaultValue: 'Field Management' })} <MapPinned className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/crops">
                {t('dashboardPage.quickActions.cropManagement', { defaultValue: 'Crop Management' })} <Wheat className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/settings">
                {t('dashboardPage.quickActions.profileSettings', { defaultValue: 'Profile Settings' })} <UserCog className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                <Link to="/ph-calculator">
                {t('dashboardPage.quickActions.phCalculator', { defaultValue: 'pH Calculator' })} <FlaskConical className="w-4 h-4" />
                </Link>
              </Button>
              {currentUser?.role === 'admin' && (
                <Button asChild variant="outline" className="w-full h-11 sm:h-10 justify-between rounded-xl text-base sm:text-sm">
                  <Link to="/farmer-performance">
                  {t('dashboardPage.quickActions.farmerPerformance', { defaultValue: 'Farmer Performance Metrics' })} <Radar className="w-4 h-4" />
                  </Link>
                </Button>
              )}

              <div className="pt-2 space-y-2">
                <Link to="/analytics" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><BarChart3 className="w-4 h-4" /> {t('dashboardPage.quickLinks.analyticsDashboard', { defaultValue: 'Analytics Dashboard' })}</Link>
                <Link to="/model-drift-detection" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><Radar className="w-4 h-4" /> {t('dashboardPage.quickLinks.modelDrift', { defaultValue: 'Model Drift Detection' })}</Link>
                <Link to="/weather-impact" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><CloudSun className="w-4 h-4" /> {t('dashboardPage.quickLinks.weatherImpact', { defaultValue: 'Weather Impact Analysis' })}</Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}