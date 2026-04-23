import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sprout, Droplets, ThermometerSun, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import mlModelService from '@/lib/mlModelService.js';

export default function AICropAdvisor() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    targetCrop: 'wheat',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    ph: '',
  });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const inference = await mlModelService.infer('ai_crop_advisor', formData);
      setResult({
        crop: inference.crop,
        confidence: inference.confidence,
        fertilizer: inference.fertilizer,
        water: inference.water,
        risk: inference.risk,
        yield: inference.yield,
      });
      toast.success(t('aiCropAdvisor.toast.success', { defaultValue: 'ML recommendations generated' }));
    } catch (error) {
      toast.error(t('aiCropAdvisor.toast.error', { defaultValue: 'Failed to generate recommendations' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" /> {t('futuristic.aiCropAdvisor.title', { defaultValue: 'AI Crop Advisor' })}
          </h1>
          <p className="text-muted-foreground mt-2">{t('futuristic.aiCropAdvisor.subtitle', { defaultValue: 'Get personalized recommendations based on soil and weather data.' })}</p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="analysis">{t('aiCropAdvisor.tabs.analysis', { defaultValue: 'New Analysis' })}</TabsTrigger>
            <TabsTrigger value="history">{t('aiCropAdvisor.tabs.history', { defaultValue: 'History' })}</TabsTrigger>
            <TabsTrigger value="compare">{t('aiCropAdvisor.tabs.compare', { defaultValue: 'Compare' })}</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('aiCropAdvisor.input.title', { defaultValue: 'Input Parameters' })}</CardTitle>
                  <CardDescription>{t('aiCropAdvisor.input.description', { defaultValue: 'Enter current field conditions' })}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAnalyze} className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t('aiCropAdvisor.input.targetCrop', { defaultValue: 'Target Crop' })}</Label>
                      <Select value={formData.targetCrop} onValueChange={(value) => setFormData((prev) => ({ ...prev, targetCrop: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheat">{t('aiCropAdvisor.crops.wheat', { defaultValue: 'Wheat' })}</SelectItem>
                          <SelectItem value="corn">{t('aiCropAdvisor.crops.corn', { defaultValue: 'Corn' })}</SelectItem>
                          <SelectItem value="rice">{t('aiCropAdvisor.crops.rice', { defaultValue: 'Rice' })}</SelectItem>
                          <SelectItem value="soybeans">{t('aiCropAdvisor.crops.soybeans', { defaultValue: 'Soybeans' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('aiCropAdvisor.input.nitrogen', { defaultValue: 'Nitrogen (N)' })}</Label>
                        <Input type="number" placeholder={t('aiCropAdvisor.input.nutrientPlaceholder', { defaultValue: 'mg/kg' })} value={formData.nitrogen} onChange={(e) => setFormData((prev) => ({ ...prev, nitrogen: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('aiCropAdvisor.input.phosphorus', { defaultValue: 'Phosphorus (P)' })}</Label>
                        <Input type="number" placeholder={t('aiCropAdvisor.input.nutrientPlaceholder', { defaultValue: 'mg/kg' })} value={formData.phosphorus} onChange={(e) => setFormData((prev) => ({ ...prev, phosphorus: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('aiCropAdvisor.input.potassium', { defaultValue: 'Potassium (K)' })}</Label>
                        <Input type="number" placeholder={t('aiCropAdvisor.input.nutrientPlaceholder', { defaultValue: 'mg/kg' })} value={formData.potassium} onChange={(e) => setFormData((prev) => ({ ...prev, potassium: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('aiCropAdvisor.input.phLevel', { defaultValue: 'pH Level' })}</Label>
                        <Input type="number" step="0.1" placeholder="6.5" value={formData.ph} onChange={(e) => setFormData((prev) => ({ ...prev, ph: e.target.value }))} />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                      {loading ? t('aiCropAdvisor.actions.analyzing', { defaultValue: 'Analyzing...' }) : t('aiCropAdvisor.actions.generate', { defaultValue: 'Generate Recommendations' })}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {result && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="h-full border-primary/50 bg-primary/5">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-primary flex items-center gap-2">
                          <Sprout className="w-5 h-5" /> {t('aiCropAdvisor.results.title', { defaultValue: 'Analysis Results' })}
                        </CardTitle>
                        <CardDescription>{t('aiCropAdvisor.results.confidenceScore', { value: result.confidence, defaultValue: `Confidence Score: ${result.confidence}%` })}</CardDescription>
                      </div>
                      <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <Sprout className="w-4 h-4 text-secondary" /> {t('aiCropAdvisor.results.fertilizerPlan', { defaultValue: 'Fertilizer Plan' })}
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.fertilizer}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <Droplets className="w-4 h-4 text-blue-500" /> {t('aiCropAdvisor.results.irrigationStrategy', { defaultValue: 'Irrigation Strategy' })}
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.water}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <ThermometerSun className="w-4 h-4 text-accent" /> {t('aiCropAdvisor.results.diseaseRisk', { defaultValue: 'Disease Risk' })}
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.risk}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiCropAdvisor.history.title', { defaultValue: 'Recommendation History' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">{t('aiCropAdvisor.history.empty', { defaultValue: 'No previous recommendations found.' })}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiCropAdvisor.compare.title', { defaultValue: 'Crop Comparison Tool' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">{t('aiCropAdvisor.compare.empty', { defaultValue: 'Select crops to compare profitability and resource requirements.' })}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}