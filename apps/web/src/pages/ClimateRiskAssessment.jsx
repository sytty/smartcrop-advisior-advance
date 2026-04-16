import React from 'react';
import { ThermometerSun, AlertTriangle, TrendingUp, ShieldAlert, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClimateRiskAssessment() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ThermometerSun className="w-8 h-8 text-destructive" /> Climate Risk Assessment
          </h1>
          <p className="text-muted-foreground mt-2">Long-term climate projections and farm vulnerability analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">72/100</div>
              <p className="text-sm font-medium text-destructive mt-1">High Vulnerability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Primary Threat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Prolonged Drought</div>
              <p className="text-sm text-muted-foreground mt-1">+15% probability by 2030</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resilience Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">Moderate</div>
              <p className="text-sm text-muted-foreground mt-1">Requires infrastructure upgrades</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projections" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="projections">Climate Projections</TabsTrigger>
            <TabsTrigger value="maps">Risk Maps</TabsTrigger>
            <TabsTrigger value="adaptation">Adaptation Strategies</TabsTrigger>
          </TabsList>

          <TabsContent value="projections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Temperature & Precipitation Trends (2025-2050)</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                Recharts Area Chart Placeholder (Historical vs Projected)
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maps">
            <Card className="min-h-[500px] flex items-center justify-center bg-muted/50">
              <div className="text-center text-muted-foreground">
                <Map className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>Geospatial Risk Heatmaps</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="adaptation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Recommended Mitigation Actions</CardTitle>
                <CardDescription>Strategies to reduce climate vulnerability based on your specific location and crop types.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-bold text-primary mb-1">Transition to Drought-Resistant Varieties</h4>
                  <p className="text-sm text-muted-foreground">Switching 30% of acreage to drought-resistant wheat strains can mitigate projected water scarcity risks by 2028.</p>
                </div>
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-bold text-blue-500 mb-1">Drip Irrigation Infrastructure</h4>
                  <p className="text-sm text-muted-foreground">Installing subsurface drip irrigation will increase water efficiency by 40%, countering the projected 15% decrease in annual rainfall.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}