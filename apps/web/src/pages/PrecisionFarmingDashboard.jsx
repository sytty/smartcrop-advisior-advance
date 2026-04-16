import React from 'react';
import { Crosshair, Map, Tractor, Layers, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PrecisionFarmingDashboard() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Crosshair className="w-8 h-8 text-primary" /> Precision Farming
            </h1>
            <p className="text-muted-foreground mt-2">Variable Rate Application (VRA) and equipment telemetry.</p>
          </div>
          <Button><Tractor className="w-4 h-4 mr-2" /> Connect Equipment</Button>
        </div>

        <Tabs defaultValue="vra" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="vra">Variable Rate Maps</TabsTrigger>
            <TabsTrigger value="equipment">Equipment Telemetry</TabsTrigger>
            <TabsTrigger value="yield">Yield Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="vra" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 min-h-[500px] relative overflow-hidden border-primary/20">
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
                <Map className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
                <p className="text-muted-foreground">VRA Prescription Map Viewer</p>
              </div>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prescription Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Field</p>
                    <p className="font-medium">North Sector (45 ha)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Input Type</p>
                    <p className="font-medium">Nitrogen Fertilizer</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Savings vs Flat Rate</p>
                    <p className="text-2xl font-bold text-secondary">18.5%</p>
                  </div>
                  <Button className="w-full">Export to Tractor (ISOXML)</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Tractor className="w-12 h-12 mb-4 opacity-20" />
                <p>No active equipment connected. Connect John Deere or Case IH API.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yield">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload harvest data to generate yield maps.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}