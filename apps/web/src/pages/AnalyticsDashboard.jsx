import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, Users, Clock, Download, Calendar,
  Activity, Globe, ArrowUpRight, ArrowDownRight, Sparkles, ShieldAlert, Leaf, Waves
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { toast } from 'sonner';

// Mock Data for Analytics
const performanceData = [
  { name: 'Mon', views: 4000, sessions: 2400, engagement: 2400 },
  { name: 'Tue', views: 3000, sessions: 1398, engagement: 2210 },
  { name: 'Wed', views: 2000, sessions: 9800, engagement: 2290 },
  { name: 'Thu', views: 2780, sessions: 3908, engagement: 2000 },
  { name: 'Fri', views: 1890, sessions: 4800, engagement: 2181 },
  { name: 'Sat', views: 2390, sessions: 3800, engagement: 2500 },
  { name: 'Sun', views: 3490, sessions: 4300, engagement: 2100 },
];

const deviceData = [
  { name: 'Mobile', value: 65 },
  { name: 'Desktop', value: 25 },
  { name: 'Tablet', value: 10 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

export default function AnalyticsDashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  const anomalyFlags = [
    {
      id: 'water-spike',
      title: t('analyticsDashboard.flags.waterSpike.title', { defaultValue: 'Irrigation Cost Spike' }),
      level: 'warning',
      message: t('analyticsDashboard.flags.waterSpike.message', { defaultValue: 'Water usage rose 16% vs last week in East fields. Review evening irrigation windows.' }),
    },
    {
      id: 'disease-risk',
      title: t('analyticsDashboard.flags.diseaseRisk.title', { defaultValue: 'Disease Pressure Zone' }),
      level: 'critical',
      message: t('analyticsDashboard.flags.diseaseRisk.message', { defaultValue: 'Humidity + leaf wetness trend indicates high fungal probability in 2 blocks.' }),
    },
    {
      id: 'yield-stable',
      title: t('analyticsDashboard.flags.yieldStable.title', { defaultValue: 'Yield Trend Stable' }),
      level: 'good',
      message: t('analyticsDashboard.flags.yieldStable.message', { defaultValue: 'Yield prediction variance remains within target band for 14 days.' }),
    },
  ];

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = (format) => {
    toast.success(t('analyticsDashboard.exporting', { format, defaultValue: `Exporting analytics report as ${format}...` }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const metrics = [
    { title: t('analyticsDashboard.metrics.pageViews', { defaultValue: 'Total Page Views' }), value: '124.5K', trend: '+12.5%', up: true, icon: Globe, iconColor: 'text-primary', trendLabel: t('analyticsDashboard.metrics.trendPreviousPeriod', { defaultValue: 'vs previous period' }) },
    { title: t('analyticsDashboard.metrics.activeSessions', { defaultValue: 'Active Sessions' }), value: '8,234', trend: '+5.2%', up: true, icon: Users, iconColor: 'text-secondary', trendLabel: t('analyticsDashboard.metrics.trendPreviousPeriod', { defaultValue: 'vs previous period' }) },
    { title: t('analyticsDashboard.metrics.engagementTime', { defaultValue: 'Avg. Engagement Time' }), value: '4m 12s', trend: '-1.1%', up: false, icon: Clock, iconColor: 'text-accent', trendLabel: t('analyticsDashboard.metrics.trendPreviousPeriod', { defaultValue: 'vs previous period' }) },
    { title: t('analyticsDashboard.metrics.uptime', { defaultValue: 'System Uptime' }), value: '99.99%', trend: t('analyticsDashboard.metrics.stable', { defaultValue: 'Stable' }), up: true, icon: Activity, iconColor: 'text-emerald-500', trendLabel: t('analyticsDashboard.metrics.serviceLevel', { defaultValue: 'service level' }) }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="elevated-card rounded-2xl p-6 space-y-4">
                <div className="h-3 w-24 loading-shimmer rounded-full" />
                <div className="h-10 w-28 loading-shimmer rounded-xl" />
                <div className="h-4 w-36 loading-shimmer rounded-full" />
              </div>
            ))}
          </div>
        )}

        <section className="feature-shell p-6 md:p-8">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 relative z-10">
            <div>
              <span className="feature-kicker mb-3">{t('analyticsDashboard.hero.kicker', { defaultValue: 'Premium Insights' })}</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" /> {t('analyticsDashboard.hero.title', { defaultValue: 'Analytics Command Center' })}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{t('analyticsDashboard.hero.subtitle', { defaultValue: 'Enterprise-grade monitoring for yield, risk, water, and engagement in one operational cockpit.' })}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[185px] h-11 rounded-xl border-primary/30 bg-card/80 text-base sm:text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('analyticsDashboard.controls.selectRange', { defaultValue: 'Select range' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">{t('analyticsDashboard.controls.last24h', { defaultValue: 'Last 24 Hours' })}</SelectItem>
                <SelectItem value="7d">{t('analyticsDashboard.controls.last7d', { defaultValue: 'Last 7 Days' })}</SelectItem>
                <SelectItem value="30d">{t('analyticsDashboard.controls.last30d', { defaultValue: 'Last 30 Days' })}</SelectItem>
                <SelectItem value="90d">{t('analyticsDashboard.controls.last90d', { defaultValue: 'Last 90 Days' })}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl h-11 px-4 text-base sm:text-sm" onClick={() => handleExport('CSV')}>
              <Download className="w-4 h-4 mr-2" /> {t('analyticsDashboard.controls.csv', { defaultValue: 'CSV' })}
            </Button>
            <Button className="rounded-xl h-11 px-4 text-base sm:text-sm bg-gradient-electric text-white border-0" onClick={() => handleExport('PDF')}>
              <Download className="w-4 h-4 mr-2" /> {t('analyticsDashboard.controls.pdfReport', { defaultValue: 'PDF Report' })}
            </Button>
          </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 relative z-10">
            <div className="insight-flag good">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('analyticsDashboard.pulse.health', { defaultValue: 'Farm Health Pulse' })}</p>
              <p className="text-lg font-semibold mt-1">{t('analyticsDashboard.pulse.healthValue', { defaultValue: '89 / 100 Stable' })}</p>
            </div>
            <div className="insight-flag warning">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('analyticsDashboard.pulse.watchZones', { defaultValue: 'Active Watch Zones' })}</p>
              <p className="text-lg font-semibold mt-1">{t('analyticsDashboard.pulse.watchZonesValue', { defaultValue: '2 irrigation, 1 disease' })}</p>
            </div>
            <div className="insight-flag">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{t('analyticsDashboard.pulse.dataFreshness', { defaultValue: 'Data Freshness' })}</p>
              <p className="text-lg font-semibold mt-1">{t('analyticsDashboard.pulse.dataFreshnessValue', { defaultValue: 'Synced 4 min ago' })}</p>
            </div>
          </div>
        </section>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={loading ? 'hidden' : 'show'}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {metrics.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="relative overflow-hidden elevated-card rounded-2xl border-border/70">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-primary/10 rounded-bl-full -mr-8 -mt-8" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="text-3xl font-bold font-variant-tabular">{stat.value}</div>
                    <div className={`flex items-center text-xs mt-1 font-medium ${stat.up ? 'text-emerald-500' : 'text-destructive'}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {stat.trend} {stat.trendLabel}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <Card className="elevated-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-primary" /> {t('analyticsDashboard.insights.title', { defaultValue: 'Top Insights' })}</CardTitle>
              <CardDescription>{t('analyticsDashboard.insights.description', { defaultValue: 'Actionable intelligence generated from multi-signal analytics streams.' })}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="insight-flag good">
                <p className="font-semibold flex items-center gap-2"><Leaf className="w-4 h-4 text-primary" /> {t('analyticsDashboard.insights.cropStability.title', { defaultValue: 'Crop Stability' })}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('analyticsDashboard.insights.cropStability.message', { defaultValue: 'Yield confidence improved by 7% after irrigation schedule normalization.' })}</p>
              </div>
              <div className="insight-flag warning">
                <p className="font-semibold flex items-center gap-2"><Waves className="w-4 h-4 text-accent" /> {t('analyticsDashboard.insights.waterDrift.title', { defaultValue: 'Water Drift' })}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('analyticsDashboard.insights.waterDrift.message', { defaultValue: 'Two zones exceeded optimal water range for 3 consecutive sessions.' })}</p>
              </div>
              <div className="insight-flag">
                <p className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-secondary" /> {t('analyticsDashboard.insights.teamThroughput.title', { defaultValue: 'Team Throughput' })}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('analyticsDashboard.insights.teamThroughput.message', { defaultValue: 'Field task completion latency reduced from 5.1h to 3.8h this week.' })}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle>{t('analyticsDashboard.watchlist.title', { defaultValue: 'Anomaly Watchlist' })}</CardTitle>
              <CardDescription>{t('analyticsDashboard.watchlist.description', { defaultValue: 'Prioritize these signals for farm operations this cycle.' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {anomalyFlags.map((flag) => (
                <div key={flag.id} className={`insight-flag ${flag.level}`}>
                  <p className="font-semibold text-sm">{flag.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{flag.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-card/80 border border-border/70 p-1 rounded-xl h-auto flex flex-wrap">
            <TabsTrigger value="overview" className="min-h-[44px]">{t('analyticsDashboard.tabs.overview', { defaultValue: 'Overview' })}</TabsTrigger>
            <TabsTrigger value="engagement" className="min-h-[44px]">{t('analyticsDashboard.tabs.engagement', { defaultValue: 'User Engagement' })}</TabsTrigger>
            <TabsTrigger value="performance" className="min-h-[44px]">{t('analyticsDashboard.tabs.performance', { defaultValue: 'System Performance' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 elevated-card rounded-3xl border-border/70">
                <CardHeader>
                  <CardTitle>{t('analyticsDashboard.overview.trafficTitle', { defaultValue: 'Traffic & Sessions Trend' })}</CardTitle>
                  <CardDescription>{t('analyticsDashboard.overview.trafficDescription', { defaultValue: 'Daily active users and page views over time.' })}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  {loading ? (
                    <div className="h-full rounded-2xl border border-dashed border-border/70 bg-card/60 p-6 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="h-4 w-40 loading-shimmer rounded-full" />
                        <div className="h-4 w-64 loading-shimmer rounded-full" />
                      </div>
                      <div className="h-52 rounded-2xl loading-shimmer" />
                    </div>
                  ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="sessions" stroke="hsl(var(--secondary))" strokeWidth={2} fillOpacity={0.1} fill="hsl(var(--secondary))" />
                    </AreaChart>
                  </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="elevated-card rounded-3xl border-border/70">
                <CardHeader>
                  <CardTitle>{t('analyticsDashboard.overview.deviceTitle', { defaultValue: 'Device Breakdown' })}</CardTitle>
                  <CardDescription>{t('analyticsDashboard.overview.deviceDescription', { defaultValue: 'Sessions by device type.' })}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex flex-col">
                  {loading ? (
                    <div className="flex-1 rounded-2xl loading-shimmer" />
                  ) : (
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  )}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                    {deviceData.map((device, i) => (
                      <div key={i} className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                          {device.name}
                        </div>
                        <div className="font-bold">{device.value}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <Card className="elevated-card rounded-3xl border-border/70">
              <CardHeader>
                <CardTitle>{t('analyticsDashboard.engagement.title', { defaultValue: 'Feature Adoption Rates' })}</CardTitle>
                <CardDescription>{t('analyticsDashboard.engagement.description', { defaultValue: 'Usage frequency across core platform modules.' })}</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <div className="h-full rounded-2xl border border-dashed border-border/70 bg-card/60 p-6 flex items-end gap-4">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full h-24 loading-shimmer rounded-t-xl" />
                        <div className="h-3 w-8 loading-shimmer rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="engagement" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="elevated-card rounded-3xl border-border/70">
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Sparkles className="w-12 h-12 mb-4 opacity-40 text-primary" />
                <p className="text-center max-w-md">{t('analyticsDashboard.performance.placeholder', { defaultValue: 'API response time and error-rate visualizations are preparing. Historical traces are syncing for this range.' })}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}