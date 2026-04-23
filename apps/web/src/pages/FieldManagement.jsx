import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Plus, RefreshCw, Sprout, SquarePen, Trash2, TreePine, Layers3 } from 'lucide-react';
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

const defaultForm = () => ({
  field_name: '',
  location: '',
  area_size: '',
  crop_type: '',
  soil_type: '',
  current_health_score: '82',
  last_monitored: new Date().toISOString().slice(0, 10),
});

const formatDate = (value) => {
  if (!value) return 'Not set';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleDateString();
};

export default function FieldManagement() {
  const { currentUser } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('all');

  const isAdmin = currentUser?.role === 'admin';

  const loadFields = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const response = await farmManagementApi.getFields({
        farmerId: currentUser.id,
        scope: isAdmin ? 'all' : '',
      });

      setFields(response);
    } catch (error) {
      console.error('Failed to load fields:', error);
      toast.error('Unable to load field records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, [currentUser?.id, isAdmin]);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm());
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      field_name: record.field_name || '',
      location: record.location || '',
      area_size: record.area_size?.toString() || '',
      crop_type: record.crop_type || '',
      soil_type: record.soil_type || '',
      current_health_score: record.current_health_score?.toString() || '82',
      last_monitored: record.last_monitored ? String(record.last_monitored).slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete ${record.field_name || 'this field'}?`)) return;

    try {
      await farmManagementApi.deleteField(record.id);
      setFields((prev) => prev.filter((item) => item.id !== record.id));
      toast.success('Field removed');
      if (editingId === record.id) resetForm();
    } catch (error) {
      console.error('Delete field failed:', error);
      toast.error('Unable to delete field');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      const healthScore = form.current_health_score ? Number(form.current_health_score) : null;
      const areaSize = form.area_size ? Number(form.area_size) : null;

      if (healthScore !== null && (healthScore < 0 || healthScore > 100)) {
        toast.error('Health score must be between 0 and 100');
        setSaving(false);
        return;
      }

      if (areaSize !== null && areaSize <= 0) {
        toast.error('Area size must be greater than zero');
        setSaving(false);
        return;
      }

      const payload = {
        field_name: form.field_name.trim(),
        location: form.location.trim() || null,
        area_size: areaSize,
        crop_type: form.crop_type.trim() || null,
        soil_type: form.soil_type.trim() || null,
        current_health_score: healthScore,
        last_monitored: form.last_monitored || null,
      };

      if (editingId) {
        const updated = await farmManagementApi.updateField(editingId, {
          ...payload,
          farmerId: currentUser.id,
        });
        setFields((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        toast.success('Field updated');
      } else {
        const created = await farmManagementApi.createField({
          ...payload,
          farmerId: currentUser.id,
        });
        setFields((prev) => [created, ...prev]);
        toast.success('Field created');
      }

      resetForm();
    } catch (error) {
      console.error('Save field failed:', error);
      toast.error('Unable to save field');
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = fields.length;
    const avgHealth = total ? Math.round(fields.reduce((sum, item) => sum + (Number(item.current_health_score) || 0), 0) / total) : 0;
    const activeCrops = new Set(fields.map((item) => item.crop_type).filter(Boolean)).size;
    const recentUpdates = fields.filter((item) => {
      const updated = item.last_monitored || item.updated;
      if (!updated) return false;
      const delta = Date.now() - new Date(updated).getTime();
      return Number.isFinite(delta) && delta < 1000 * 60 * 60 * 24 * 30;
    }).length;

    return { total, avgHealth, activeCrops, recentUpdates };
  }, [fields]);

  const cropOptions = useMemo(() => {
    return [...new Set(fields.map((item) => String(item.crop_type || '').trim()).filter(Boolean))];
  }, [fields]);

  const filteredFields = useMemo(() => {
    return fields.filter((item) => {
      const matchSearch = !search || [item.field_name, item.location, item.soil_type]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(search.toLowerCase()));

      const matchCrop = cropFilter === 'all' || String(item.crop_type || '') === cropFilter;
      return matchSearch && matchCrop;
    });
  }, [fields, search, cropFilter]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background to-background p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Badge className="w-fit rounded-full bg-emerald-500/15 text-emerald-600 border-emerald-500/20">Field Management</Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Track every field from planting through harvest.</h1>
              <p className="text-muted-foreground">Create, update, and review field records with crop, soil, size, and health status in one place.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadFields} disabled={loading} className="rounded-xl h-11 px-4 text-base sm:text-sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Button onClick={resetForm} className="rounded-xl h-11 px-4 text-base sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white">
                <Plus className="w-4 h-4 mr-2" /> New Field
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total fields', value: stats.total, icon: Layers3 },
              { label: 'Average health', value: `${stats.avgHealth}%`, icon: Sprout },
              { label: 'Crop types', value: stats.activeCrops, icon: TreePine },
              { label: 'Recent updates', value: stats.recentUpdates, icon: CalendarDays },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.label}</span>
                    <Icon className="w-4 h-4 text-emerald-600" />
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
              <CardTitle>{editingId ? 'Edit field' : 'Add a field'}</CardTitle>
              <CardDescription>Keep boundary, soil, and monitoring details updated for your farm team.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="field_name">Field name</Label>
                  <Input id="field_name" value={form.field_name} onChange={(event) => setForm((prev) => ({ ...prev, field_name: event.target.value }))} placeholder="North Block A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} placeholder="Village, district, state" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area_size">Area size (acres)</Label>
                    <Input id="area_size" type="number" min="0" step="0.1" value={form.area_size} onChange={(event) => setForm((prev) => ({ ...prev, area_size: event.target.value }))} placeholder="12.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_health_score">Health score</Label>
                    <Input id="current_health_score" type="number" min="0" max="100" value={form.current_health_score} onChange={(event) => setForm((prev) => ({ ...prev, current_health_score: event.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop_type">Crop type</Label>
                    <Input id="crop_type" value={form.crop_type} onChange={(event) => setForm((prev) => ({ ...prev, crop_type: event.target.value }))} placeholder="Wheat" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_monitored">Last monitored</Label>
                    <Input id="last_monitored" type="date" value={form.last_monitored} onChange={(event) => setForm((prev) => ({ ...prev, last_monitored: event.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soil_type">Soil type</Label>
                  <Textarea id="soil_type" value={form.soil_type} onChange={(event) => setForm((prev) => ({ ...prev, soil_type: event.target.value }))} placeholder="Loam, clay loam, sandy loam" rows={4} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving} className="rounded-xl h-11 flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-base sm:text-sm">
                    {saving ? 'Saving...' : editingId ? 'Update field' : 'Create field'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl h-11 px-4 text-base sm:text-sm">Clear</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>Field roster</CardTitle>
              <CardDescription>Review active land parcels and jump into edits when conditions change.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <Input
                  placeholder="Search by field, location, or soil"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={cropFilter}
                  onChange={(event) => setCropFilter(event.target.value)}
                >
                  <option value="all">All crops</option>
                  {cropOptions.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center text-muted-foreground">Loading field records...</div>
              ) : filteredFields.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/70 px-6 py-12 text-center text-muted-foreground">No field records yet. Add your first field to get started.</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Crop</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Health</TableHead>
                        <TableHead>Monitored</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFields.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.field_name}</div>
                            <div className="text-xs text-muted-foreground">{record.area_size ? `${record.area_size} acres` : 'Area not set'}</div>
                          </TableCell>
                          <TableCell>{record.crop_type || 'Unassigned'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{record.location || 'Unknown'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={(Number(record.current_health_score) || 0) >= 80 ? 'default' : 'secondary'}>
                              {Number(record.current_health_score) || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(record.last_monitored || record.updated)}</TableCell>
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