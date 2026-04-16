import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Clock, Download, Calendar,
  Activity, Globe, ArrowUpRight, ArrowDownRight, Sparkles
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
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleExport = (format) => {
    toast.success(`Exporting analytics report as ${format}...`);
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
    { title: 'Total Page Views', value: '124.5K', trend: '+12.5%', up: true, icon: Globe, iconColor: 'text-primary', trendLabel: 'vs previous period' },
    { title: 'Active Sessions', value: '8,234', trend: '+5.2%', up: true, icon: Users, iconColor: 'text-secondary', trendLabel: 'vs previous period' },
    { title: 'Avg. Engagement Time', value: '4m 12s', trend: '-1.1%', up: false, icon: Clock, iconColor: 'text-accent', trendLabel: 'vs previous period' },
    { title: 'System Uptime', value: '99.99%', trend: 'Stable', up: true, icon: Activity, iconColor: 'text-emerald-500', trendLabel: 'service level' }
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

        <div className="glass-card rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Insights Center</p>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" /> Analytics & Monitoring
            </h1>
            <p className="text-muted-foreground mt-2">Comprehensive usage, performance, and engagement intelligence for platform optimization.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[170px] rounded-xl border-primary/30 bg-card/70">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl" onClick={() => handleExport('CSV')}>
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button className="rounded-xl bg-gradient-electric text-white border-0" onClick={() => handleExport('PDF')}>
              <Download className="w-4 h-4 mr-2" /> PDF Report
            </Button>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={loading ? 'hidden' : 'show'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card className="relative overflow-hidden elevated-card rounded-2xl border-border/70">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-primary/10 rounded-bl-full -mr-8 -mt-8" />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </CardHeader>
                  <CardContent>
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-card/80 border border-border/70 p-1 rounded-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="performance">System Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 elevated-card rounded-3xl border-border/70">
                <CardHeader>
                  <CardTitle>Traffic & Sessions Trend</CardTitle>
                  <CardDescription>Daily active users and page views over time.</CardDescription>
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
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>Sessions by device type.</CardDescription>
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
                <CardTitle>Feature Adoption Rates</CardTitle>
                <CardDescription>Usage frequency across core platform modules.</CardDescription>
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
                <p className="text-center max-w-md">API response time and error-rate visualizations are preparing. Historical traces are syncing for this range.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}