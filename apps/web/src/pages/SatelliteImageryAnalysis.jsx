import React from 'react';
import { Satellite, Map, Layers, Download, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SatelliteImageryAnalysis() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Satellite className="w-8 h-8 text-primary" /> Satellite Imagery Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Multispectral analysis for crop health and yield prediction.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Select Date</Button>
            <Button><Download className="w-4 h-4 mr-2" /> Export GeoTIFF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" className="w-full justify-start"><Layers className="w-4 h-4 mr-2" /> True Color (RGB)</Button>
                <Button variant="default" className="w-full justify-start"><Layers className="w-4 h-4 mr-2" /> NDVI (Health)</Button>
                <Button variant="ghost" className="w-full justify-start"><Layers className="w-4 h-4 mr-2" /> NDWI (Water)</Button>
                <Button variant="ghost" className="w-full justify-start"><Layers className="w-4 h-4 mr-2" /> Thermal (Stress)</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Field Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mean NDVI</p>
                  <p className="text-2xl font-bold text-secondary">0.72</p>
                  <p className="text-xs text-muted-foreground">Healthy Vegetation</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stressed Area</p>
                  <p className="text-2xl font-bold text-warning">1.2 ha</p>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Viewer */}
          <Card className="lg:col-span-3 min-h-[600px] relative overflow-hidden border-primary/20">
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
              <Map className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
              <p className="text-muted-foreground">Interactive Map Viewer (React-Leaflet Integration)</p>
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur p-2 rounded-lg border text-xs flex items-center gap-2">
                <span>NDVI Scale:</span>
                <div className="w-32 h-3 bg-gradient-to-r from-destructive via-warning to-secondary rounded-full"></div>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Historical NDVI Trends</CardTitle>
            <CardDescription>Vegetation index changes over the current growing season.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Recharts Line Chart Placeholder
          </CardContent>
        </Card>
      </div>
    </div>
  );
}