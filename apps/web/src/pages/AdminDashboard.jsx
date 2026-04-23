import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Users,
  Map,
  AlertTriangle,
  Activity,
  ShieldCheck,
  BrainCircuit,
  RefreshCcw,
  Server,
  Search,
  ArrowRight,
  Loader2,
  UserCog,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/GlassCard.jsx';
import { useModelMetricsSeeding } from '@/hooks/useModelMetricsSeeding.js';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import adminApi from '@/lib/adminApi.js';

const FALLBACK_OVERVIEW = {
  users: { total: 0, farmers: 0, admins: 0 },
  operations: { fields: 0, crops: 0, activeAlerts: 0 },
  subsidy: { submitted: 0, underReview: 0, approved: 0, rejected: 0, paid: 0 },
  ml: { highConfidence: 0, lowConfidence: 0, highConfidenceRate: null, driftDetected: false, lastUpdated: null },
  services: {
    api: { status: 'degraded', env: 'unknown', version: 'unknown' },
    pocketbase: { status: 'degraded', latencyMs: null, url: '', authenticated: false },
  },
};

const MODULES = [
  {
    title: 'Regional Monitoring',
    description: 'View active alerts and regional incidents in one place.',
    icon: Map,
    href: '/regional-monitoring',
    accent: 'group-hover:text-[#00d4ff] group-hover:bg-[#00d4ff]/20',
  },
  {
    title: 'Blockchain Audit',
    description: 'Run integrity checks and inspect immutable transaction logs.',
    icon: ShieldCheck,
    href: '/audit-dashboard',
    accent: 'group-hover:text-yellow-300 group-hover:bg-yellow-500/20',
  },
  {
    title: 'Model Drift Detection',
    description: 'Monitor model confidence and detect drift before impact.',
    icon: BrainCircuit,
    href: '/model-drift-detection',
    accent: 'group-hover:text-purple-300 group-hover:bg-purple-500/20',
  },
  {
    title: 'Subsidy Administration',
    description: 'Review, approve, and process subsidy applications quickly.',
    icon: Activity,
    href: '/subsidy-admin',
    accent: 'group-hover:text-green-300 group-hover:bg-green-500/20',
  },
  {
    title: 'Farmer Performance',
    description: 'Compare farmer outcomes and identify coaching priorities.',
    icon: Users,
    href: '/farmer-performance',
    accent: 'group-hover:text-cyan-300 group-hover:bg-cyan-500/20',
  },
  {
    title: 'Digital Twin',
    description: 'Explore real-time digital representation of farm operations.',
    icon: Map,
    href: '/digital-twin',
    accent: 'group-hover:text-emerald-300 group-hover:bg-emerald-500/20',
  },
];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { seedMetricsIfEmpty } = useModelMetricsSeeding();
  const [overview, setOverview] = useState(FALLBACK_OVERVIEW);
  const [systemHealth, setSystemHealth] = useState(FALLBACK_OVERVIEW.services);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savingRoleId, setSavingRoleId] = useState('');
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    perPage: 40,
    totalItems: 0,
    totalPages: 1,
  });

  const derivedStats = useMemo(() => {
    const subsidy = overview.subsidy || FALLBACK_OVERVIEW.subsidy;
    const pendingSubsidies = subsidy.submitted + subsidy.underReview;

    return {
      totalFarmers: overview.users.farmers,
      monitoredFields: overview.operations.fields,
      activeAlerts: overview.operations.activeAlerts,
      pendingSubsidies,
    };
  }, [overview]);

  const userRoleStats = useMemo(() => {
    const totals = users.reduce(
      (acc, user) => {
        const role = String(user.role || '').toLowerCase();
        if (role === 'admin') acc.admins += 1;
        if (role === 'farmer') acc.farmers += 1;
        return acc;
      },
      { admins: 0, farmers: 0 },
    );

    return {
      admins: totals.admins,
      farmers: totals.farmers,
      total: users.length,
    };
  }, [users]);

  const priorityQueue = useMemo(() => {
    const queue = [];

    if ((overview.subsidy.underReview || 0) > 0) {
      queue.push({
        id: 'subsidy-review',
        title: 'Subsidy Review Backlog',
        description: `${overview.subsidy.underReview} applications are waiting for an admin decision.`,
        href: '/subsidy-admin',
        level: 'amber',
      });
    }

    if ((overview.operations.activeAlerts || 0) > 0) {
      queue.push({
        id: 'regional-alerts',
        title: 'Active Regional Alerts',
        description: `${overview.operations.activeAlerts} incidents need regional monitoring follow-up.`,
        href: '/regional-monitoring',
        level: 'red',
      });
    }

    if (overview.ml.driftDetected) {
      queue.push({
        id: 'model-drift',
        title: 'Model Drift Detected',
        description: 'ML quality has drift signals and should be reviewed immediately.',
        href: '/model-drift-detection',
        level: 'purple',
      });
    }

    if (systemHealth.pocketbase.status !== 'up') {
      queue.push({
        id: 'infra-health',
        title: 'PocketBase Service Degraded',
        description: 'Database/API dependency status is degraded and needs infrastructure checks.',
        href: '/audit-dashboard',
        level: 'red',
      });
    }

    if (!queue.length) {
      queue.push({
        id: 'all-stable',
        title: 'Operations Stable',
        description: 'No urgent admin actions are currently pending.',
        href: '/regional-monitoring',
        level: 'green',
      });
    }

    return queue;
  }, [overview, systemHealth]);

  const loadOverview = async () => {
    const [overviewData, healthData] = await Promise.all([
      adminApi.getOverview(),
      adminApi.getSystemHealth(),
    ]);
    setOverview(overviewData || FALLBACK_OVERVIEW);
    setSystemHealth(healthData || FALLBACK_OVERVIEW.services);
  };

  const loadUsers = async (searchValue = '', page = 1) => {
    setLoadingUsers(true);
    try {
      const payload = await adminApi.getUsers({ q: searchValue, page, limit: 40 });
      setUsers(payload.users || []);
      setUsersPagination(payload.pagination || { page: 1, perPage: 40, totalItems: 0, totalPages: 1 });
    } catch (error) {
      toast.error(error?.message || 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        seedMetricsIfEmpty();
        await Promise.all([loadOverview(), loadUsers('', 1)]);
      } catch (error) {
        if (mounted) {
          toast.error(error?.message || 'Unable to load admin dashboard data');
        }
      } finally {
        if (mounted) {
          setLoadingOverview(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [seedMetricsIfEmpty]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadOverview(), loadUsers(query, usersPagination.page || 1)]);
      toast.success('Admin data refreshed');
    } catch (error) {
      toast.error(error?.message || 'Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setSavingRoleId(userId);
    try {
      const updated = await adminApi.updateUserRole(userId, role);
      setUsers((current) => current.map((user) => (user.id === userId ? { ...user, role: updated.role } : user)));
      await loadOverview();
      toast.success('User role updated');
    } catch (error) {
      toast.error(error?.message || 'Failed to update role');
    } finally {
      setSavingRoleId('');
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    await loadUsers(query, 1);
  };

  const handleResetSearch = async () => {
    setQuery('');
    await loadUsers('', 1);
  };

  const handlePageChange = async (direction) => {
    const nextPage = usersPagination.page + direction;
    if (nextPage < 1 || nextPage > usersPagination.totalPages) return;
    await loadUsers(query, nextPage);
  };

  const serviceBadge = (status) => (
    status === 'up'
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      : 'bg-red-500/20 text-red-300 border-red-500/30'
  );

  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('admin.admin_dashboard.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t('admin.admin_dashboard.title', { defaultValue: 'Admin Control Center' })}</h1>
              <p className="text-gray-400">{t('admin.admin_dashboard.subtitle', { defaultValue: 'Unified command view for operations, user access, and critical service health.' })}</p>
            </div>
            <Button onClick={handleRefresh} disabled={isRefreshing || loadingOverview} className="bg-gradient-electric text-white hover:brightness-110 border-0">
              {isRefreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
              Refresh Data
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Farmers</p>
              <p className="text-2xl font-bold text-white">{derivedStats.totalFarmers}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-[#1a4d2e]/40 flex items-center justify-center mr-4">
              <Map className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Monitored Fields</p>
              <p className="text-2xl font-bold text-white">{derivedStats.monitoredFields}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{derivedStats.activeAlerts}</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Subsidies</p>
              <p className="text-2xl font-bold text-white">{derivedStats.pendingSubsidies}</p>
            </div>
          </GlassCard>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-white/5 border border-white/10 h-auto p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/10">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/10">User Access</TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-white/10">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Priority Action Queue</h2>
                <span className="text-xs text-gray-500">Auto-generated from live admin signals</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {priorityQueue.map((item) => {
                  const levelClass = item.level === 'red'
                    ? 'border-red-500/30 bg-red-500/10'
                    : item.level === 'amber'
                      ? 'border-amber-500/30 bg-amber-500/10'
                      : item.level === 'purple'
                        ? 'border-purple-500/30 bg-purple-500/10'
                        : 'border-emerald-500/30 bg-emerald-500/10';

                  return (
                    <div key={item.id} className={`rounded-xl border p-4 ${levelClass}`}>
                      <p className="text-white font-semibold mb-1">{item.title}</p>
                      <p className="text-sm text-gray-300 mb-3">{item.description}</p>
                      <Link to={item.href} className="text-[#00d4ff] text-sm inline-flex items-center hover:underline">
                        Open now <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Subsidy Pipeline</h2>
                  <Link to="/subsidy-admin" className="text-[#00d4ff] text-sm hover:underline">Open subsidy admin</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-gray-400">Submitted</p>
                    <p className="text-xl font-semibold text-white">{overview.subsidy.submitted}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-gray-400">Under Review</p>
                    <p className="text-xl font-semibold text-amber-300">{overview.subsidy.underReview}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-gray-400">Approved</p>
                    <p className="text-xl font-semibold text-emerald-300">{overview.subsidy.approved}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-gray-400">Rejected</p>
                    <p className="text-xl font-semibold text-red-300">{overview.subsidy.rejected}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs text-gray-400">Paid</p>
                    <p className="text-xl font-semibold text-cyan-300">{overview.subsidy.paid}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-white mb-4">ML Reliability</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">High confidence</span>
                    <span className="text-white">{overview.ml.highConfidence}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Low confidence</span>
                    <span className="text-white">{overview.ml.lowConfidence}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence rate</span>
                    <span className="text-white">{overview.ml.highConfidenceRate ?? 'N/A'}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Drift status</span>
                    <span className={overview.ml.driftDetected ? 'text-red-300' : 'text-emerald-300'}>
                      {overview.ml.driftDetected ? 'Drift detected' : 'Stable'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last update: {overview.ml.lastUpdated ? new Date(overview.ml.lastUpdated).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center"><Server className="w-5 h-5 mr-2 text-[#00d4ff]" />Service Health</h2>
                <span className="text-xs text-gray-500">Live from backend</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-300">API Server</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${serviceBadge(systemHealth.api.status)}`}>{systemHealth.api.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">Environment: {systemHealth.api.env}</p>
                  <p className="text-xs text-gray-500">Version: {systemHealth.api.version}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-300">PocketBase</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${serviceBadge(systemHealth.pocketbase.status)}`}>{systemHealth.pocketbase.status}</span>
                  </div>
                  <p className="text-xs text-gray-500">Latency: {systemHealth.pocketbase.latencyMs ?? 'N/A'} ms</p>
                  <p className="text-xs text-gray-500">Authenticated: {systemHealth.pocketbase.authenticated ? 'yes' : 'no'}</p>
                </div>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center"><UserCog className="w-5 h-5 mr-2 text-[#00d4ff]" />User Access Management</h2>
                  <p className="text-sm text-gray-400">Search users and assign farmer or admin roles in one place.</p>
                </div>
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:w-auto">
                  <div className="relative w-full lg:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search by name, email, or farm"
                      className="pl-9 bg-black/40 border-white/10 text-white"
                    />
                  </div>
                  <Button type="submit" variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">Search</Button>
                  <Button type="button" onClick={handleResetSearch} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Clear
                  </Button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-gray-400">Users in result</p>
                  <p className="text-xl font-semibold text-white">{userRoleStats.total}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-gray-400">Admins in result</p>
                  <p className="text-xl font-semibold text-cyan-300">{userRoleStats.admins}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-gray-400">Farmers in result</p>
                  <p className="text-xl font-semibold text-emerald-300">{userRoleStats.farmers}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-gray-400">Global user count</p>
                  <p className="text-xl font-semibold text-white">{usersPagination.totalItems}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                <div className="inline-flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Showing page {usersPagination.page} of {usersPagination.totalPages}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(-1)}
                    disabled={loadingUsers || usersPagination.page <= 1}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={loadingUsers || usersPagination.page >= usersPagination.totalPages}
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-white/10 text-gray-400">
                    <tr>
                      <th className="py-3 px-2 font-medium">User</th>
                      <th className="py-3 px-2 font-medium">Farm</th>
                      <th className="py-3 px-2 font-medium">Region</th>
                      <th className="py-3 px-2 font-medium">Current Role</th>
                      <th className="py-3 px-2 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingUsers ? (
                      <tr>
                        <td className="py-6 px-2 text-gray-400" colSpan={5}>Loading users...</td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td className="py-6 px-2 text-gray-400" colSpan={5}>No users found.</td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5">
                          <td className="py-3 px-2">
                            <p className="text-white font-medium">{user.name || 'Unnamed user'}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </td>
                          <td className="py-3 px-2 text-gray-300">{user.farm_name || '-'}</td>
                          <td className="py-3 px-2 text-gray-300">{user.region || '-'}</td>
                          <td className="py-3 px-2">
                            <span className={`inline-flex text-xs px-2 py-1 rounded-full border ${user.role === 'admin' ? 'border-cyan-400/40 text-cyan-300 bg-cyan-500/10' : 'border-gray-400/20 text-gray-300 bg-white/5'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={user.role}
                                disabled={savingRoleId === user.id}
                                onChange={(event) => handleRoleChange(user.id, event.target.value)}
                                className="bg-black/40 border border-white/15 rounded-lg px-2 py-1 text-white text-sm"
                              >
                                <option value="farmer">farmer</option>
                                <option value="admin">admin</option>
                              </select>
                              {savingRoleId === user.id && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Operational Decision Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <p className="text-white font-semibold mb-1">User Governance</p>
                  <p className="text-sm text-gray-300 mb-3">Review elevated accounts and align role access with responsibilities.</p>
                  <Link to="/admin" className="text-[#00d4ff] text-sm inline-flex items-center hover:underline">Open user access <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="text-white font-semibold mb-1">Subsidy Throughput</p>
                  <p className="text-sm text-gray-300 mb-3">Keep application queues moving to reduce farmer wait times.</p>
                  <Link to="/subsidy-admin" className="text-[#00d4ff] text-sm inline-flex items-center hover:underline">Open subsidy admin <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                  <p className="text-white font-semibold mb-1">Model Governance</p>
                  <p className="text-sm text-gray-300 mb-3">Track confidence trends and react quickly to ML drift.</p>
                  <Link to="/model-drift-detection" className="text-[#00d4ff] text-sm inline-flex items-center hover:underline">Open drift panel <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-5 flex items-center">
                <CheckCircle className="w-8 h-8 text-emerald-300 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Approved Subsidies</p>
                  <p className="text-2xl font-semibold text-white">{overview.subsidy.approved}</p>
                </div>
              </GlassCard>
              <GlassCard className="p-5 flex items-center">
                <Clock className="w-8 h-8 text-amber-300 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Under Review</p>
                  <p className="text-2xl font-semibold text-white">{overview.subsidy.underReview}</p>
                </div>
              </GlassCard>
              <GlassCard className="p-5 flex items-center">
                <XCircle className="w-8 h-8 text-red-300 mr-3" />
                <div>
                  <p className="text-sm text-gray-400">Rejected Subsidies</p>
                  <p className="text-2xl font-semibold text-white">{overview.subsidy.rejected}</p>
                </div>
              </GlassCard>
            </div>

            <h2 className="text-xl font-bold text-white">Admin Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MODULES.map((module) => (
                <Link key={module.href} to={module.href}>
                  <GlassCard hover className="h-full p-6 group flex flex-col">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-gray-400 transition-colors ${module.accent}`}>
                      <module.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-400 flex-1">{module.description}</p>
                    <div className="mt-4 text-[#00d4ff] text-sm inline-flex items-center">
                      Open module <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;