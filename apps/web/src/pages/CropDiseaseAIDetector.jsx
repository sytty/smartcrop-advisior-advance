import React, { useState } from 'react';
import { Upload, ShieldCheck, AlertCircle, FileText, History, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function CropDiseaseAIDetector() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        disease: 'Leaf Rust',
        confidence: 92,
        severity: 'Moderate',
        treatment: 'Apply organic copper fungicide immediately.',
        prevention: 'Ensure proper spacing between plants for airflow.'
      });
      setAnalyzing(false);
      toast.success('Analysis complete');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-destructive" /> Disease AI Detector
          </h1>
          <p className="text-muted-foreground mt-2">Upload leaf images for instant computer vision diagnosis.</p>
        </div>

        <Tabs defaultValue="detect" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="detect">Detection</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="database">Disease Database</TabsTrigger>
          </TabsList>

          <TabsContent value="detect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Drag and drop or click to browse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleUpload}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-1">Click or drag image to upload</h3>
                    <p className="text-sm text-muted-foreground">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                  <Button className="w-full mt-6" disabled={analyzing} onClick={handleUpload}>
                    {analyzing ? 'Analyzing Image...' : 'Analyze Image'}
                  </Button>
                </CardContent>
              </Card>

              {result && (
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Detection Results
                      </CardTitle>
                      <CardDescription>Processed in 1.2s</CardDescription>
                    </div>
                    <Button variant="outline" size="icon"><FileText className="w-4 h-4" /></Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Identified Condition</p>
                      <p className="text-2xl font-bold">{result.disease}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background/50 p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="font-bold text-lg">{result.confidence}%</p>
                      </div>
                      <div className="bg-background/50 p-3 rounded-lg border">
                        <p className="text-sm text-muted-foreground">Severity</p>
                        <p className="font-bold text-lg text-warning">{result.severity}</p>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-destructive/20">
                      <div>
                        <p className="text-sm font-semibold mb-1">Recommended Treatment</p>
                        <p className="text-sm text-muted-foreground">{result.treatment}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Prevention</p>
                        <p className="text-sm text-muted-foreground">{result.prevention}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <p>No previous detections found.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                <p>Disease library loading...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}