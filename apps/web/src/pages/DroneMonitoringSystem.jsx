import React from 'react';
import { Plane, Battery, Signal, AlertCircle, Map as MapIcon, Activity, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DroneMonitoringSystem() {
  const drones = [
    { id: 'DRN-01', status: 'In Flight', battery: 78, signal: 'Strong', task: 'Field Mapping', health: 'Good' },
    { id: 'DRN-02', status: 'Charging', battery: 100, signal: 'N/A', task: 'Idle', health: 'Excellent' },
    { id: 'DRN-03', status: 'Maintenance', battery: 45, signal: 'Weak', task: 'Sensor Calibration', health: 'Needs Service' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Plane className="w-8 h-8 text-primary" /> Drone Fleet Management
            </h1>
            <p className="text-muted-foreground mt-2">Monitor and control your autonomous agricultural drones.</p>
          </div>
          <Button>Deploy Drone</Button>
        </div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
            <TabsTrigger value="live">Live Map</TabsTrigger>
            <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 min-h-[500px] relative overflow-hidden border-primary/20">
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
                <MapIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground flex items-center gap-2">
                  <Signal className="w-5 h-5 animate-pulse text-primary" /> Live GPS Feed Active
                </p>
              </div>
            </Card>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Active Telemetry</h3>
              {drones.filter(d => d.status === 'In Flight').map((drone) => (
                <Card key={drone.id} className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-bold text-lg">{drone.id}</div>
                      <Badge variant="default" className="animate-pulse">Live</Badge>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Altitude</span>
                        <span className="font-mono">120m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Speed</span>
                        <span className="font-mono">15 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Battery</span>
                        <span className="font-mono text-primary">{drone.battery}%</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary/20 flex gap-2">
                      <Button size="sm" variant="destructive" className="w-full">RTH</Button>
                      <Button size="sm" variant="outline" className="w-full">Camera</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fleet">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drones.map((drone) => (
                <Card key={drone.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="font-bold text-xl">{drone.id}</div>
                      <Badge variant={drone.status === 'In Flight' ? 'default' : drone.status === 'Maintenance' ? 'destructive' : 'secondary'}>
                        {drone.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><Battery className="w-4 h-4" /> Battery</span>
                        <span className={drone.battery < 20 ? 'text-destructive' : ''}>{drone.battery}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> Health</span>
                        <span>{drone.health}</span>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        Task: <span className="text-foreground font-medium">{drone.task}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Flight Analytics</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                Charts and historical data visualization will appear here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                Service logs and component health tracking will appear here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}