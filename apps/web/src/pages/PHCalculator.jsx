import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Calculator, FlaskConical, RefreshCw, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import farmManagementApi from '@/lib/farmManagementApi.js';

const defaultForm = {
  currentPh: '5.6',
  targetPh: '6.5',
  soilType: 'loam',
  areaSize: '1',
  areaUnit: 'acre',
};

const HISTORY_KEY = 'ph-calculator-history-v1';

export default function PHCalculator() {
  const [form, setForm] = useState(defaultForm);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setHistory(parsed.slice(0, 8));
      }
    } catch {
      // Ignore invalid local storage entries.
    }
  }, []);

  const updateHistory = (entry) => {
    const nextHistory = [entry, ...history.filter((item) => item.id !== entry.id)].slice(0, 8);
    setHistory(nextHistory);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  };

  const handleReset = () => {
    setForm(defaultForm);
    setResult(null);
  };

  const handleCalculate = async (event) => {
    event.preventDefault();

    const currentPh = Number(form.currentPh);
    const targetPh = Number(form.targetPh);
    const areaSize = Number(form.areaSize);

    if (currentPh < 3 || currentPh > 10 || targetPh < 3 || targetPh > 10) {
      toast.error('pH values must be between 3 and 10');
      return;
    }

    if (areaSize <= 0) {
      toast.error('Area size must be greater than zero');
      return;
    }

    setCalculating(true);
    try {
      const response = await farmManagementApi.calculatePh({
        currentPh,
        targetPh,
        soilType: form.soilType,
        areaSize,
        areaUnit: form.areaUnit,
      });

      setResult(response);
      updateHistory({
        id: `${Date.now()}`,
        timestamp: new Date().toISOString(),
        form: { ...form },
        result: {
          amendment: response.amendment,
          quantity: response.quantity,
          unit: response.unit,
          status: response.status,
          recommendation: response.recommendation,
        },
      });
      toast.success('pH recommendation generated');
    } catch (error) {
      console.error('pH calculation failed:', error);
      toast.error(error?.message || 'Unable to calculate pH adjustment');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-cyan-500/10 via-background to-background p-6 md:p-8 shadow-2xl"
        >
          <div className="space-y-3 max-w-3xl">
            <Badge className="w-fit rounded-full bg-cyan-500/15 text-cyan-600 border-cyan-500/20">pH Calculator</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Calculate field pH correction with amendment quantity and split schedule.</h1>
            <p className="text-muted-foreground">This calculator estimates lime or sulfur application using soil type, current pH, and target pH.</p>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5 text-cyan-600" /> Inputs</CardTitle>
              <CardDescription>Provide your current soil pH and target pH range.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCalculate}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPh">Current pH</Label>
                    <Input id="currentPh" type="number" step="0.1" min="3" max="10" value={form.currentPh} onChange={(event) => setForm((prev) => ({ ...prev, currentPh: event.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetPh">Target pH</Label>
                    <Input id="targetPh" type="number" step="0.1" min="3" max="10" value={form.targetPh} onChange={(event) => setForm((prev) => ({ ...prev, targetPh: event.target.value }))} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Soil Type</Label>
                    <Select value={form.soilType} onValueChange={(value) => setForm((prev) => ({ ...prev, soilType: value }))}>
                      <SelectTrigger><SelectValue placeholder="Soil type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Area Unit</Label>
                    <Select value={form.areaUnit} onValueChange={(value) => setForm((prev) => ({ ...prev, areaUnit: value }))}>
                      <SelectTrigger><SelectValue placeholder="Area unit" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acre">Acre</SelectItem>
                        <SelectItem value="hectare">Hectare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaSize">Area Size</Label>
                  <Input id="areaSize" type="number" step="0.01" min="0.01" value={form.areaSize} onChange={(event) => setForm((prev) => ({ ...prev, areaSize: event.target.value }))} required />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={calculating} className="rounded-xl h-11 bg-cyan-600 hover:bg-cyan-500 text-white flex-1 text-base sm:text-sm">
                    <FlaskConical className="w-4 h-4 mr-2" /> {calculating ? 'Calculating...' : 'Calculate'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleReset} className="rounded-xl h-11 px-4 text-base sm:text-sm">
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Beaker className="w-5 h-5 text-cyan-600" /> Recommendation</CardTitle>
              <CardDescription>Application quantity and split strategy for your target pH.</CardDescription>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center text-muted-foreground">
                  Fill in the inputs and run the calculator to generate a recommendation.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Current pH</p>
                      <p className="text-2xl font-semibold mt-1">{result.currentPh}</p>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Target pH</p>
                      <p className="text-2xl font-semibold mt-1">{result.targetPh}</p>
                    </div>
                  </div>

                  {result.status === 'stable' ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="font-semibold text-emerald-700">No major correction needed</p>
                      <p className="text-sm text-muted-foreground mt-1">{result.recommendation}</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4">
                        <p className="text-sm text-muted-foreground">Amendment</p>
                        <p className="text-xl font-bold mt-1">{result.amendment === 'agricultural_lime' ? 'Agricultural Lime' : 'Elemental Sulfur'}</p>
                        <p className="text-sm mt-1">Apply <span className="font-semibold">{result.quantity} {result.unit}</span> over <span className="font-semibold">{result.plan.splitApplications}</span> application(s).</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-border/70 p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Per Split</p>
                          <p className="text-xl font-semibold mt-1">{result.plan.perSplit} {result.unit}</p>
                        </div>
                        <div className="rounded-2xl border border-border/70 p-4">
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Cadence</p>
                          <p className="text-xl font-semibold mt-1">{result.plan.cadenceDays || 0} days</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="rounded-2xl border border-border/70 p-4">
                    <p className="font-semibold flex items-center gap-2"><Sprout className="w-4 h-4 text-cyan-600" /> Best-practice notes</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {(result.notes || result.monitoring?.tips || []).map((note) => (
                        <li key={note}>- {note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-border/70 shadow-xl">
          <CardHeader>
            <CardTitle>Recent calculations</CardTitle>
            <CardDescription>Reuse recent scenarios to compare pH correction strategies quickly.</CardDescription>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center text-muted-foreground">
                No calculations saved yet. Run your first pH recommendation.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-border/70 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{item.form.currentPh} to {item.form.targetPh} pH ({item.form.soilType})</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.result.status === 'stable'
                            ? item.result.recommendation
                            : `${item.result.quantity} ${item.result.unit} ${item.result.amendment === 'agricultural_lime' ? 'Agricultural Lime' : 'Elemental Sulfur'}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl h-11 px-4 text-base sm:text-sm"
                        onClick={() => {
                          setForm(item.form);
                          toast.success('Inputs restored from history');
                        }}
                      >
                        Reuse inputs
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}