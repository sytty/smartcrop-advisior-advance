import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, Download, Upload, RefreshCw, Shield, 
  FileSpreadsheet, FileText, FileJson, Search, Filter 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function DataManagementPage() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success('Data synchronized successfully with cloud servers.');
    }, 2000);
  };

  const handleExport = (format) => {
    toast.success(`Preparing ${format} export. Download will begin shortly.`);
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" /> Data Management
            </h1>
            <p className="text-muted-foreground mt-2">Export, import, backup, and synchronize your farm data.</p>
          </div>
          <Button onClick={handleSync} disabled={syncing} className="w-full md:w-auto">
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.4 GB</div>
              <p className="text-sm text-muted-foreground mt-1">of 10 GB limit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">Today, 03:00 AM</div>
              <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Automated Backup Successful
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-emerald-500">Up to date</div>
              <p className="text-sm text-muted-foreground mt-1">All offline changes synced</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
            <TabsTrigger value="backups">Backups & Recovery</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Configuration</CardTitle>
                <CardDescription>Select the data modules and format you wish to export.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Data Modules</h4>
                    <div className="space-y-2">
                      {['Field Boundaries & Maps', 'Yield History', 'Soil Test Results', 'IoT Sensor Logs', 'Financial Records'].map((item) => (
                        <label key={item} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <input type="checkbox" className="w-4 h-4 rounded border-input text-primary focus:ring-primary" defaultChecked />
                          <span className="text-sm font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Export Format</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <Button variant="outline" className="h-16 justify-start px-4" onClick={() => handleExport('CSV')}>
                        <FileSpreadsheet className="w-6 h-6 mr-4 text-emerald-500" />
                        <div className="text-left">
                          <div className="font-bold">CSV / Excel</div>
                          <div className="text-xs text-muted-foreground font-normal">Best for spreadsheet analysis</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-16 justify-start px-4" onClick={() => handleExport('PDF')}>
                        <FileText className="w-6 h-6 mr-4 text-destructive" />
                        <div className="text-left">
                          <div className="font-bold">PDF Report</div>
                          <div className="text-xs text-muted-foreground font-normal">Formatted document with charts</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-16 justify-start px-4" onClick={() => handleExport('JSON')}>
                        <FileJson className="w-6 h-6 mr-4 text-accent" />
                        <div className="text-left">
                          <div className="font-bold">JSON</div>
                          <div className="text-xs text-muted-foreground font-normal">Raw data for API integration</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Data Preview</CardTitle>
                  <CardDescription>Preview of selected records before export.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-9 w-[200px] h-9" placeholder="Search records..." />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9"><Filter className="w-4 h-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Record Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: '2026-04-05', module: 'Yield', type: 'Harvest Log', status: 'Verified' },
                        { date: '2026-04-04', module: 'IoT', type: 'Sensor Telemetry', status: 'Raw' },
                        { date: '2026-04-02', module: 'Soil', type: 'Lab Results', status: 'Verified' },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs">{row.date}</TableCell>
                          <TableCell>{row.module}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell><Badge variant="secondary">{row.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import Data</CardTitle>
                <CardDescription>Upload historical data from other farm management systems.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">Click or drag file to upload</h3>
                  <p className="text-sm text-muted-foreground">Supports CSV, JSON, GeoJSON (Max 50MB)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backups">
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Shield className="w-12 h-12 mb-4 opacity-20" />
                <p>Automated backup configuration and restoration points will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}