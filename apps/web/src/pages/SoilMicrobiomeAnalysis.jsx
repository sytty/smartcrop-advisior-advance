import React from 'react';
import { FlaskConical, Dna, Activity, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SoilMicrobiomeAnalysis() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Dna className="w-8 h-8 text-secondary" /> Soil Microbiome Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Deep genomic sequencing of soil biology for optimal health.</p>
          </div>
          <Button><FlaskConical className="w-4 h-4 mr-2" /> Submit New Sample</Button>
        </div>

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="results">Latest Results</TabsTrigger>
            <TabsTrigger value="diversity">Microbial Diversity</TabsTrigger>
            <TabsTrigger value="recommendations">Amendments</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-secondary/5 border-secondary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Soil Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-secondary">84/100</div>
                  <p className="text-sm font-medium text-secondary mt-1">Excellent</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Fungal:Bacterial Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2 : 1</div>
                  <p className="text-sm text-muted-foreground mt-1">Optimal for current crop</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pathogen Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">Low</div>
                  <p className="text-sm text-muted-foreground mt-1">No critical pathogens detected</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Key Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-bold text-primary mb-1">High Nitrogen-Fixing Bacteria</h4>
                  <p className="text-sm text-muted-foreground">Rhizobium levels are 20% above average, allowing for a reduction in synthetic nitrogen application.</p>
                </div>
                <div className="p-4 border rounded-lg bg-background">
                  <h4 className="font-bold text-warning mb-1">Low Mycorrhizal Colonization</h4>
                  <p className="text-sm text-muted-foreground">Consider applying a mycorrhizal inoculant to improve phosphorus uptake.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diversity">
            <Card>
              <CardHeader>
                <CardTitle>Species Abundance</CardTitle>
                <CardDescription>Relative abundance of major microbial phyla.</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                Recharts Pie/Bar Chart Placeholder
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Biological amendment recommendations will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}