import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Sprout, Droplets, AlertTriangle, ArrowUpRight, Bell, Settings, LogOut, BarChart3, Radar, CloudSun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from PB
        const fields = await pb.collection('fields').getList(1, 1, { filter: `farmer_id="${currentUser.id}"`, $autoCancel: false });
        const alerts = await pb.collection('notifications').getList(1, 1, { filter: `user_id="${currentUser.id}" && is_read=false`, $autoCancel: false });
        const feed = await pb.collection('activity_feed').getList(1, 5, { filter: `user_id="${currentUser.id}"`, sort: '-created', $autoCancel: false });
        
        setStats({
          fields: fields.totalItems,
          healthScore: 88, // Mocked aggregation
          waterSaved: '12k L',
          activeAlerts: alerts.totalItems
        });
        setActivities(feed.items);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
  }, [currentUser]);

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

  const dateLabel = new Date().toLocaleDateString('en-US', {
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
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Farm Operations Console</p>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.name || 'Farmer'}</h1>
                <p className="text-muted-foreground mt-1">{dateLabel}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="icon" className="rounded-xl"><Bell className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="rounded-xl"><Settings className="w-4 h-4" /></Button>
              <Button variant="destructive" size="icon" onClick={logout} className="rounded-xl"><LogOut className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Field Readiness</p>
              <p className="text-lg font-bold">Operational</p>
            </div>
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Sync Status</p>
              <p className="text-lg font-bold">Online</p>
            </div>
            <div className="elevated-card rounded-2xl px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Next Priority</p>
              <p className="text-lg font-bold">Disease scan update</p>
            </div>
          </div>
        </motion.section>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Fields</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold">{stats?.fields}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Health Score</CardTitle>
                <Sprout className="w-4 h-4 text-secondary" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-secondary">{stats?.healthScore}%</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="elevated-card rounded-2xl border-border/70">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Water Saved</CardTitle>
                <Droplets className="w-4 h-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold">{stats?.waterSaved}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="rounded-2xl border-destructive/50 bg-destructive/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Active Alerts</CardTitle>
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-16" /> : (
                  <div className="text-3xl font-bold text-destructive">{stats?.activeAlerts}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 elevated-card rounded-3xl border-border/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-primary/30">
                <Link to="/analytics">View analytics</Link>
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
                        <p className="text-xs text-muted-foreground">{new Date(activity.created).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 px-6 py-10 text-center">
                    <Activity className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                    <p className="font-semibold text-foreground mb-1">No recent activity</p>
                    <p className="text-sm text-muted-foreground">Actions you take across the farm will appear here in real time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="elevated-card rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild variant="outline" className="w-full justify-between rounded-xl">
                <Link to="/disease-detection-advanced">
                Log Treatment <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-xl">
                <Link to="/drone-monitoring">
                Schedule Drone <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-xl">
                <Link to="/predictive-weather">
                View Weather <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>

              <div className="pt-2 space-y-2">
                <Link to="/analytics" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><BarChart3 className="w-4 h-4" /> Analytics Dashboard</Link>
                <Link to="/model-drift-detection" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><Radar className="w-4 h-4" /> Model Drift Detection</Link>
                <Link to="/weather-impact" className="flex items-center gap-2 text-sm text-primary font-semibold hover:text-primary/80"><CloudSun className="w-4 h-4" /> Weather Impact Analysis</Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}