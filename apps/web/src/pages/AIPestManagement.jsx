import React, { useState } from 'react';
import { Bug, Upload, AlertTriangle, Activity, BookOpen, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import mlModelService from '@/lib/mlModelService.js';

export default function AIPestManagement() {
  const { t } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    setAnalyzing(true);
    try {
      const inference = await mlModelService.infer('ai_pest_management');
      setResult({
        pest: inference.pest,
        confidence: inference.confidence,
        severity: inference.severity,
        damage: inference.damage,
        treatment: inference.treatment,
        biological: inference.biological,
      });
      toast.success(t('aiPestManagement.toast.success', { defaultValue: 'Pest identified successfully' }));
    } catch (error) {
      toast.error(t('aiPestManagement.toast.error', { defaultValue: 'Pest identification failed' }));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bug className="w-8 h-8 text-warning" /> {t('futuristic.pestManagement.title', { defaultValue: 'AI Pest Management' })}
          </h1>
          <p className="text-muted-foreground mt-2">{t('futuristic.pestManagement.subtitle', { defaultValue: 'Identify pests, assess damage, and generate Integrated Pest Management (IPM) plans.' })}</p>
        </div>

        <Tabs defaultValue="detect" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="detect">{t('aiPestManagement.tabs.detect', { defaultValue: 'Detection' })}</TabsTrigger>
            <TabsTrigger value="tracking">{t('aiPestManagement.tabs.tracking', { defaultValue: 'Active Tracking' })}</TabsTrigger>
            <TabsTrigger value="ipm">{t('aiPestManagement.tabs.ipm', { defaultValue: 'IPM Plans' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="detect">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('aiPestManagement.upload.title', { defaultValue: 'Upload Pest Image' })}</CardTitle>
                  <CardDescription>{t('aiPestManagement.upload.description', { defaultValue: 'Upload clear photos of the pest or crop damage.' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleUpload}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">{t('aiPestManagement.upload.dropTitle', { defaultValue: 'Click or drag image to upload' })}</h3>
                    <p className="text-sm text-muted-foreground">{t('aiPestManagement.upload.dropHint', { defaultValue: 'Supports JPG, PNG (Max 10MB)' })}</p>
                  </div>
                  <Button className="w-full mt-6" disabled={analyzing} onClick={handleUpload}>
                    {analyzing ? t('aiPestManagement.actions.running', { defaultValue: 'Running AI Models...' }) : t('aiPestManagement.actions.identify', { defaultValue: 'Identify Pest' })}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card className="border-warning/50 bg-warning/5">
                  <CardHeader>
                    <CardTitle className="text-warning flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" /> {t('aiPestManagement.results.title', { defaultValue: 'Identification Results' })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('aiPestManagement.results.identifiedPest', { defaultValue: 'Identified Pest' })}</p>
                        <p className="text-2xl font-bold">{result.pest}</p>
                      </div>
                      <Badge variant="destructive">{t('aiPestManagement.results.severity', { value: result.severity, defaultValue: `${result.severity} Severity` })}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/50 p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">{t('aiPestManagement.results.confidence', { defaultValue: 'Confidence' })}</p>
                        <p className="font-bold text-lg">{result.confidence}%</p>
                      </div>
                      <div className="bg-background/50 p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">{t('aiPestManagement.results.cropDamage', { defaultValue: 'Est. Crop Damage' })}</p>
                        <p className="font-bold text-lg text-destructive">{result.damage}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-warning/20">
                      <div>
                        <p className="text-sm font-semibold mb-1 text-destructive">{t('aiPestManagement.results.chemicalTreatment', { defaultValue: 'Chemical Treatment' })}</p>
                        <p className="text-sm text-muted-foreground">{result.treatment}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1 text-secondary">{t('aiPestManagement.results.biologicalControl', { defaultValue: 'Biological Control' })}</p>
                        <p className="text-sm text-muted-foreground">{result.biological}</p>
                      </div>
                    </div>
                    <Button className="w-full">{t('aiPestManagement.actions.logTracking', { defaultValue: 'Log to Tracking System' })}</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiPestManagement.tracking.title', { defaultValue: 'Active Pest Threats' })}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <Activity className="w-12 h-12 mb-4 opacity-20" />
                <p>{t('aiPestManagement.tracking.empty', { defaultValue: 'No active pest threats tracked currently.' })}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ipm">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiPestManagement.ipm.title', { defaultValue: 'Integrated Pest Management (IPM) Strategies' })}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p>{t('aiPestManagement.ipm.empty', { defaultValue: 'Select a crop to view its IPM strategy.' })}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}