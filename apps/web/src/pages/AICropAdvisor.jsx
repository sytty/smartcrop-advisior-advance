import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sprout, Droplets, ThermometerSun, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AICropAdvisor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        crop: 'Wheat',
        confidence: 94,
        fertilizer: 'Apply 50kg/ha Nitrogen in 2 split doses.',
        water: 'Maintain soil moisture above 60%. Irrigate every 7 days.',
        risk: 'Low risk of rust based on current humidity.',
        yield: '4.2 tons/ha expected'
      });
      setLoading(false);
      toast.success('Analysis complete');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" /> AI Crop Advisor
          </h1>
          <p className="text-muted-foreground mt-2">Get personalized recommendations based on soil and weather data.</p>
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
            <TabsTrigger value="analysis">New Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Input Parameters</CardTitle>
                  <CardDescription>Enter current field conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAnalyze} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target Crop</Label>
                      <Select defaultValue="wheat">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="soybeans">Soybeans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nitrogen (N)</Label>
                        <Input type="number" placeholder="mg/kg" />
                      </div>
                      <div className="space-y-2">
                        <Label>Phosphorus (P)</Label>
                        <Input type="number" placeholder="mg/kg" />
                      </div>
                      <div className="space-y-2">
                        <Label>Potassium (K)</Label>
                        <Input type="number" placeholder="mg/kg" />
                      </div>
                      <div className="space-y-2">
                        <Label>pH Level</Label>
                        <Input type="number" step="0.1" placeholder="6.5" />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                      {loading ? 'Analyzing...' : 'Generate Recommendations'}
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
                          <Sprout className="w-5 h-5" /> Analysis Results
                        </CardTitle>
                        <CardDescription>Confidence Score: {result.confidence}%</CardDescription>
                      </div>
                      <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <Sprout className="w-4 h-4 text-secondary" /> Fertilizer Plan
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.fertilizer}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <Droplets className="w-4 h-4 text-blue-500" /> Irrigation Strategy
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.water}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2 mb-1">
                          <ThermometerSun className="w-4 h-4 text-accent" /> Disease Risk
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
                <CardTitle>Recommendation History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">No previous recommendations found.</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            <Card>
              <CardHeader>
                <CardTitle>Crop Comparison Tool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">Select crops to compare profitability and resource requirements.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}