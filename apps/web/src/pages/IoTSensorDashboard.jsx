import React from 'react';
import { Cpu, Thermometer, Droplets, Activity, MapPin, Download, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IoTSensorDashboard() {
  const sensors = [
    { id: 'S-101', type: 'Soil Moisture', value: '42%', status: 'optimal', icon: Droplets, color: 'text-blue-500', location: 'North Field' },
    { id: 'S-102', type: 'Temperature', value: '24°C', status: 'optimal', icon: Thermometer, color: 'text-orange-500', location: 'Greenhouse A' },
    { id: 'S-103', type: 'pH Level', value: '6.8', status: 'optimal', icon: Activity, color: 'text-secondary', location: 'East Orchard' },
    { id: 'S-104', type: 'Soil Moisture', value: '18%', status: 'warning', icon: Droplets, color: 'text-blue-500', location: 'South Field' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Cpu className="w-8 h-8 text-primary" /> IoT Sensor Network
            </h1>
            <p className="text-muted-foreground mt-2">Real-time telemetry from field sensors.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Button><Settings className="w-4 h-4 mr-2" /> Configure</Button>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="grid">Sensor Grid</TabsTrigger>
            <TabsTrigger value="map">Network Map</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Config</TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sensors.map((sensor) => {
                const Icon = sensor.icon;
                return (
                  <Card key={sensor.id} className={sensor.status === 'warning' ? 'border-warning/50 bg-warning/5' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{sensor.type}</CardTitle>
                      <Icon className={`w-4 h-4 ${sensor.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">{sensor.value}</div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground font-mono">{sensor.id}</span>
                        <Badge variant={sensor.status === 'warning' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {sensor.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {sensor.location}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle>Historical Trends</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                Time-series charts will render here using Recharts.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card className="min-h-[600px] flex items-center justify-center bg-muted/50">
              <p className="text-muted-foreground">Interactive Sensor Map Visualization</p>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Thresholds</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                Configuration interface for SMS/Email alerts based on sensor readings.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}