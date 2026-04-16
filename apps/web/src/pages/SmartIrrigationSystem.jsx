import React from 'react';
import { Droplets, Calendar, Settings2, BarChart3, Map, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SmartIrrigationSystem() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Droplets className="w-8 h-8 text-blue-500" /> Smart Irrigation
            </h1>
            <p className="text-muted-foreground mt-2">Automated water management and scheduling.</p>
          </div>
          <Button variant="outline"><Settings2 className="w-4 h-4 mr-2" /> Configure Zones</Button>
        </div>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="usage">Water Usage</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Upcoming Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { zone: 'North Field', time: 'Today, 18:00', duration: '45 mins', auto: true, amount: '2,500 L' },
                      { zone: 'East Orchard', time: 'Tomorrow, 06:00', duration: '30 mins', auto: true, amount: '1,200 L' },
                      { zone: 'South Field', time: 'Tomorrow, 18:00', duration: '60 mins', auto: false, amount: '3,000 L' },
                    ].map((schedule, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <h4 className="font-bold">{schedule.zone}</h4>
                          <p className="text-sm text-muted-foreground">{schedule.time} • {schedule.duration} • {schedule.amount}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Auto</span>
                            <Switch checked={schedule.auto} />
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Water Usage</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-4xl font-bold text-blue-500 font-variant-tabular">14,500 L</p>
                      <p className="text-sm text-secondary mt-1 font-medium">↓ 12% vs last week</p>
                    </div>
                    <Button className="w-full" variant="outline"><BarChart3 className="w-4 h-4 mr-2" /> View Full Report</Button>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/10 border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-secondary flex items-center gap-2">
                      <Zap className="w-5 h-5" /> Optimization Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Based on tomorrow's rain forecast, we recommend skipping the morning cycle for East Orchard to save 1,200 L.</p>
                    <Button className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">Apply Recommendation</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage">
            <Card className="min-h-[500px]">
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>Detailed breakdown of water consumption by zone and crop.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                Charts will render here.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle>Soil Moisture Triggers</CardTitle>
                <CardDescription>Configure automatic irrigation based on real-time sensor data.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                Automation rules interface will render here.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}