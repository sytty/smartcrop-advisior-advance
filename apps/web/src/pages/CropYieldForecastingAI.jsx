import React from 'react';
import { LineChart, BrainCircuit, TrendingUp, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CropYieldForecastingAI() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-accent" /> Yield Forecasting AI
            </h1>
            <p className="text-muted-foreground mt-2">Machine learning predictions based on historical, weather, and satellite data.</p>
          </div>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Field</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="north">North Sector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Crop</label>
                <Select defaultValue="wheat">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wheat">Winter Wheat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4">Update Forecast</Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Predicted Yield</p>
                  <div className="text-4xl font-bold text-primary">4.2 <span className="text-xl text-muted-foreground font-normal">t/ha</span></div>
                  <p className="text-sm text-secondary mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> +5% vs last year</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Confidence Interval</p>
                  <div className="text-3xl font-bold">92%</div>
                  <p className="text-sm text-muted-foreground mt-2">High accuracy based on current data</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Est. Harvest Date</p>
                  <div className="text-2xl font-bold flex items-center gap-2"><Calendar className="w-5 h-5" /> Oct 15-20</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Yield Trajectory & Scenarios</CardTitle>
                <CardDescription>Projected yield curve based on current conditions vs optimal conditions.</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                Recharts Line Chart Placeholder (Actual vs Predicted vs Optimal)
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}