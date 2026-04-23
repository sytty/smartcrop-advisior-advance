import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeDollarSign, CalendarDays, Plus, RefreshCw, Sprout, SquarePen, Trash2, Wheat } from 'lucide-react';
import { toast } from 'sonner';
import farmManagementApi from '@/lib/farmManagementApi.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

const defaultForm = () => ({
  crop_type: '',
  yield: '',
  profitability: '',
  water_usage: '',
  disease_risk: '',
  pest_risk: '',
  soil_requirements: '',
});

const toRequirementText = (value) => {
  if (Array.isArray(value)) return value.join('\n');
  if (value && typeof value === 'object') return JSON.stringify(value, null, 2);
  return value ? String(value) : '';
};

export default function CropManagement() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const isAdmin = currentUser?.role === 'admin';

  const loadCrops = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await farmManagementApi.getCrops({
        farmerId: currentUser.id,
        scope: isAdmin ? 'all' : '',
      });

      setRecords(response);
    } catch (error) {
      console.error('Failed to load crop data:', error);
      toast.error(t('cropManagement.loadFailed', { defaultValue: 'Unable to load crop records' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, [currentUser?.id, isAdmin]);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm());
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      crop_type: record.crop_type || '',
      yield: record.yield?.toString() || '',
      profitability: record.profitability?.toString() || '',
      water_usage: record.water_usage?.toString() || '',
      disease_risk: record.disease_risk?.toString() || '',
      pest_risk: record.pest_risk?.toString() || '',
      soil_requirements: toRequirementText(record.soil_requirements),
    });
  };

  const handleDelete = async (record) => {
    if (!window.confirm(t('cropManagement.deleteConfirm', { crop: record.crop_type || t('cropManagement.thisCropRecord', { defaultValue: 'this crop record' }), defaultValue: `Delete ${record.crop_type || 'this crop record'}?` }))) return;

    try {
      await farmManagementApi.deleteCrop(record.id);
      setRecords((prev) => prev.filter((item) => item.id !== record.id));
      toast.success(t('cropManagement.deleted', { defaultValue: 'Crop record removed' }));
      if (editingId === record.id) resetForm();
    } catch (error) {
      console.error('Delete crop failed:', error);
      toast.error(t('cropManagement.deleteFailed', { defaultValue: 'Unable to delete crop record' }));
    }
  };

  const parseRequirements = (text) => text
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      const profitability = form.profitability ? Number(form.profitability) : null;
      const diseaseRisk = form.disease_risk ? Number(form.disease_risk) : null;
      const pestRisk = form.pest_risk ? Number(form.pest_risk) : null;

      if (profitability !== null && (profitability < 0 || profitability > 100)) {
        toast.error(t('cropManagement.profitabilityRange', { defaultValue: 'Profitability must be between 0 and 100' }));
        setSaving(false);
        return;
      }

      if (diseaseRisk !== null && (diseaseRisk < 0 || diseaseRisk > 100)) {
        toast.error(t('cropManagement.diseaseRiskRange', { defaultValue: 'Disease risk must be between 0 and 100' }));
        setSaving(false);
        return;
      }

      if (pestRisk !== null && (pestRisk < 0 || pestRisk > 100)) {
        toast.error(t('cropManagement.pestRiskRange', { defaultValue: 'Pest risk must be between 0 and 100' }));
        setSaving(false);
        return;
      }

      const payload = {
        crop_type: form.crop_type.trim(),
        yield: form.yield ? Number(form.yield) : null,
        profitability,
        water_usage: form.water_usage ? Number(form.water_usage) : null,
        disease_risk: diseaseRisk,
        pest_risk: pestRisk,
        soil_requirements: parseRequirements(form.soil_requirements),
      };

      if (editingId) {
        const updated = await farmManagementApi.updateCrop(editingId, {
          ...payload,
          farmerId: currentUser.id,
        });
        setRecords((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        toast.success(t('cropManagement.updated', { defaultValue: 'Crop record updated' }));
      } else {
        const created = await farmManagementApi.createCrop({
          ...payload,
          farmerId: currentUser.id,
        });
        setRecords((prev) => [created, ...prev]);
        toast.success(t('cropManagement.created', { defaultValue: 'Crop record created' }));
      }

      resetForm();
    } catch (error) {
      console.error('Save crop failed:', error);
      toast.error(t('cropManagement.saveFailed', { defaultValue: 'Unable to save crop record' }));
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = records.length;
    const avgYield = total ? Math.round(records.reduce((sum, item) => sum + (Number(item.yield) || 0), 0) / total) : 0;
    const avgProfitability = total ? Math.round(records.reduce((sum, item) => sum + (Number(item.profitability) || 0), 0) / total) : 0;
    const avgWater = total ? Math.round(records.reduce((sum, item) => sum + (Number(item.water_usage) || 0), 0) / total) : 0;

    return { total, avgYield, avgProfitability, avgWater };
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const query = search.toLowerCase();
      const matchSearch = !query || String(record.crop_type || '').toLowerCase().includes(query);
      const avgRisk = ((Number(record.disease_risk) || 0) + (Number(record.pest_risk) || 0)) / 2;
      const matchRisk = riskFilter === 'all'
        || (riskFilter === 'low' && avgRisk < 35)
        || (riskFilter === 'medium' && avgRisk >= 35 && avgRisk < 70)
        || (riskFilter === 'high' && avgRisk >= 70);

      return matchSearch && matchRisk;
    });
  }, [records, search, riskFilter]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-amber-500/10 via-background to-background p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Badge className="w-fit rounded-full bg-amber-500/15 text-amber-600 border-amber-500/20">{t('cropManagement.badge', { defaultValue: 'Crop Management' })}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('cropManagement.title', { defaultValue: 'Manage crop performance, profitability, and risk in one workspace.' })}</h1>
              <p className="text-muted-foreground">{t('cropManagement.subtitle', { defaultValue: 'Record yields, water demand, pest pressure, and soil requirements across seasons.' })}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadCrops} disabled={loading} className="rounded-xl h-11 px-4 text-base sm:text-sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> {t('cropManagement.refresh', { defaultValue: 'Refresh' })}
              </Button>
              <Button onClick={resetForm} className="rounded-xl h-11 px-4 text-base sm:text-sm bg-amber-600 hover:bg-amber-500 text-white">
                <Plus className="w-4 h-4 mr-2" /> {t('cropManagement.newCrop', { defaultValue: 'New Crop' })}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: t('cropManagement.stats.records', { defaultValue: 'Crop records' }), value: stats.total, icon: Wheat },
              { label: t('cropManagement.stats.yield', { defaultValue: 'Average yield' }), value: stats.avgYield, icon: Sprout },
              { label: t('cropManagement.stats.profitability', { defaultValue: 'Avg profitability' }), value: `${stats.avgProfitability}%`, icon: BadgeDollarSign },
              { label: t('cropManagement.stats.waterUse', { defaultValue: 'Avg water use' }), value: `${stats.avgWater} L`, icon: CalendarDays },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.label}</span>
                    <Icon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-3 text-2xl font-semibold">{item.value}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.35fr] gap-8">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit crop record' : 'Add crop record'}</CardTitle>
              <CardDescription>Store harvest and risk metrics to support field planning decisions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="crop_type">Crop type</Label>
                  <Input id="crop_type" value={form.crop_type} onChange={(event) => setForm((prev) => ({ ...prev, crop_type: event.target.value }))} placeholder="Rice" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yield">Yield</Label>
                    <Input id="yield" type="number" min="0" step="1" value={form.yield} onChange={(event) => setForm((prev) => ({ ...prev, yield: event.target.value }))} placeholder="4200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profitability">Profitability</Label>
                    <Input id="profitability" type="number" min="0" max="100" value={form.profitability} onChange={(event) => setForm((prev) => ({ ...prev, profitability: event.target.value }))} placeholder="78" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="water_usage">Water usage</Label>
                    <Input id="water_usage" type="number" min="0" step="1" value={form.water_usage} onChange={(event) => setForm((prev) => ({ ...prev, water_usage: event.target.value }))} placeholder="1200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="disease_risk">Disease risk</Label>
                    <Input id="disease_risk" type="number" min="0" max="100" value={form.disease_risk} onChange={(event) => setForm((prev) => ({ ...prev, disease_risk: event.target.value }))} placeholder="24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pest_risk">Pest risk</Label>
                  <Input id="pest_risk" type="number" min="0" max="100" value={form.pest_risk} onChange={(event) => setForm((prev) => ({ ...prev, pest_risk: event.target.value }))} placeholder="31" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_requirements">Soil requirements</Label>
                  <Textarea id="soil_requirements" rows={5} value={form.soil_requirements} onChange={(event) => setForm((prev) => ({ ...prev, soil_requirements: event.target.value }))} placeholder="Well-drained loam\npH 6.0-7.0\nModerate organic matter" />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving} className="rounded-xl h-11 flex-1 bg-amber-600 hover:bg-amber-500 text-white text-base sm:text-sm">
                    {saving ? 'Saving...' : editingId ? 'Update crop' : 'Create crop'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl h-11 px-4 text-base sm:text-sm">Clear</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>Crop roster</CardTitle>
              <CardDescription>Review crop performance and update values as field conditions change.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <Input
                  placeholder="Search crop type"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={riskFilter}
                  onChange={(event) => setRiskFilter(event.target.value)}
                >
                  <option value="all">All risk bands</option>
                  <option value="low">Low risk</option>
                  <option value="medium">Medium risk</option>
                  <option value="high">High risk</option>
                </select>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center text-muted-foreground">Loading crop records...</div>
              ) : filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center text-muted-foreground">No crop records yet. Add one to start tracking performance.</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Crop</TableHead>
                        <TableHead>Yield</TableHead>
                        <TableHead>Profitability</TableHead>
                        <TableHead>Water</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.crop_type}</div>
                            <div className="text-xs text-muted-foreground">Updated {record.updated ? new Date(record.updated).toLocaleDateString() : 'recently'}</div>
                          </TableCell>
                          <TableCell>{record.yield ?? 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={(Number(record.profitability) || 0) >= 70 ? 'default' : 'secondary'}>{Number(record.profitability) || 'N/A'}%</Badge>
                          </TableCell>
                          <TableCell>{record.water_usage ?? 'N/A'}</TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div>Disease: {record.disease_risk ?? 'N/A'}</div>
                              <div>Pest: {record.pest_risk ?? 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => handleEdit(record)}>
                                <SquarePen className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="icon" className="h-10 w-10" onClick={() => handleDelete(record)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}