import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Search, Download, Activity, Lock, Database, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuditLogging } from '@/hooks/useAuditLogging.js';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuditLogDetailsModal from '@/components/AuditLogDetailsModal.jsx';
import { useTranslation } from 'react-i18next';

const COLORS = ['#00d4ff', '#1a4d2e', '#22c55e', '#eab308', '#f97316'];

const AuditDashboard = () => {
  const { t } = useTranslation();
  const { verifyChain, isVerifying } = useAuditLogging();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [stats, setStats] = useState({ total: 0, byType: [], byDate: [] });
  const [integrityResult, setIntegrityResult] = useState(null);

  const calculateStats = useCallback((data) => {
    const typeCount = {};
    const dateCount = {};

    data.forEach(log => {
      typeCount[log.action_type] = (typeCount[log.action_type] || 0) + 1;
      
      const date = new Date(log.timestamp).toLocaleDateString();
      dateCount[date] = (dateCount[date] || 0) + 1;
    });

    setStats({
      total: data.length,
      byType: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      byDate: Object.entries(dateCount).map(([date, count]) => ({ date, count })).reverse()
    });
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      let filterStr = '';
      if (searchTerm) filterStr += `transaction_id ~ "${searchTerm}"`;
      if (filterType !== 'all') {
        if (filterStr) filterStr += ' && ';
        filterStr += `action_type = "${filterType}"`;
      }

      const records = await pb.collection('audit_logs').getList(1, 50, {
        sort: '-timestamp',
        filter: filterStr,
        expand: 'farmer_id',
        $autoCancel: false
      });
      
      setLogs(records.items);
      calculateStats(records.items);
    } catch (error) {
          console.error('Error fetching audit logs:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, calculateStats, t]);

  useEffect(() => {
    fetchLogs();
    
    const subscribe = async () => {
      await pb.collection('audit_logs').subscribe('*', (e) => {
        if (e.action === 'create') {
          setLogs(prev => [e.record, ...prev].slice(0, 50));
          toast.info(t('audit.newTransaction', { action: e.record.action_type, defaultValue: `New transaction logged: ${e.record.action_type}` }));
        }
      });
    };
    subscribe();

    return () => {
      pb.collection('audit_logs').unsubscribe('*');
    };
  }, [fetchLogs]);

  const handleRunIntegrityCheck = async () => {
    try {
      const result = await verifyChain();
      setIntegrityResult(result);
      if (result.isValid) {
        toast.success(t('audit.integrityVerified', { defaultValue: 'Blockchain integrity verified. No tampering detected.' }));
      } else {
        toast.error(t('audit.integrityFailed', { count: result.brokenLinks.length, defaultValue: `Integrity check failed! Found ${result.brokenLinks.length} broken links.` }));
      }
    } catch (error) {
      toast.error(t('audit.integrityRunFailed', { defaultValue: 'Failed to run integrity check' }));
    }
  };

  const handleExportCSV = () => {
    const headers = [
      t('audit.csv.transactionId', { defaultValue: 'Transaction ID' }),
      t('audit.csv.actionType', { defaultValue: 'Action Type' }),
      t('audit.csv.farmerId', { defaultValue: 'Farmer ID' }),
      t('audit.csv.timestamp', { defaultValue: 'Timestamp' }),
      t('audit.csv.verified', { defaultValue: 'Verified' }),
      t('audit.csv.dataHash', { defaultValue: 'Data Hash' }),
    ];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => 
        `${log.transaction_id},${log.action_type},${log.farmer_id},${log.timestamp},${log.verified},${log.data_hash}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen analytics-theme-bg pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('admin.blockchain_audit.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Lock className="w-8 h-8 mr-3 text-[#00d4ff]" />
              {t('admin.blockchain_audit.title')}
            </h1>
            <p className="text-gray-400">{t('admin.blockchain_audit.subtitle')}</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <Button onClick={handleRunIntegrityCheck} disabled={isVerifying} className="bg-[#1a4d2e] hover:bg-[#2d7a4f] text-white border-0">
              {isVerifying ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              {t('admin.blockchain_audit.runCheck')}
            </Button>
            <Button onClick={handleExportCSV} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" /> {t('admin.blockchain_audit.exportCsv')}
            </Button>
          </motion.div>
        </div>

        {integrityResult && !integrityResult.isValid && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold flex items-center mb-4">
                <ShieldAlert className="w-5 h-5 mr-2" /> {t('admin.blockchain_audit.compromised')}
              </h3>
              <ul className="space-y-2">
                {integrityResult.brokenLinks.map((link, idx) => (
                  <li key={idx} className="text-sm text-red-300 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    TXN: {link.transaction_id} - {link.reason}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="flex flex-col justify-center items-center text-center py-8">
            <Database className="w-8 h-8 text-[#00d4ff] mb-4" />
            <p className="text-gray-400 text-sm font-medium mb-1">{t('admin.blockchain_audit.totalTx')}</p>
            <p className="text-4xl font-bold text-white font-variant-tabular">{stats.total}</p>
          </GlassCard>

          <GlassCard className="h-[250px]">
            <h3 className="text-sm font-medium text-gray-400 mb-4">{t('admin.blockchain_audit.txByType')}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.byType} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {stats.byType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="h-[250px]">
            <h3 className="text-sm font-medium text-gray-400 mb-4">{t('admin.blockchain_audit.txVolume')}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.byDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={5} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="count" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold text-white">{t('admin.blockchain_audit.ledger')}</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                      placeholder={t('admin.blockchain_audit.search')} 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px] bg-black/40 border-white/10 text-white">
                      <SelectValue placeholder={t('admin.blockchain_audit.type')} />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="all" className="text-white hover:bg-white/10">All Types</SelectItem>
                      <SelectItem value="diagnosis" className="text-white hover:bg-white/10">Diagnosis</SelectItem>
                      <SelectItem value="treatment" className="text-white hover:bg-white/10">Treatment</SelectItem>
                      <SelectItem value="yield" className="text-white hover:bg-white/10">Yield</SelectItem>
                      <SelectItem value="subsidy" className="text-white hover:bg-white/10">Subsidy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 border-b border-white/10 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Transaction ID</th>
                      <th className="px-6 py-4 font-medium">{t('admin.blockchain_audit.type')}</th>
                      <th className="px-6 py-4 font-medium">{t('admin.blockchain_audit.farmer')}</th>
                      <th className="px-6 py-4 font-medium">{t('admin.blockchain_audit.timestamp')}</th>
                      <th className="px-6 py-4 font-medium">{t('admin.blockchain_audit.status')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('admin.blockchain_audit.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">{t('common.loading')}</td></tr>
                    ) : logs.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">No transactions found.</td></tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-300">{log.transaction_id.substring(0, 16)}...</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs capitalize text-gray-300">
                              {log.action_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-300">{log.expand?.farmer_id?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            {log.verified ? (
                              <span className="flex items-center text-[#22c55e] text-xs font-medium">
                                <ShieldCheck className="w-3 h-3 mr-1" /> {t('admin.blockchain_audit.verified')}
                              </span>
                            ) : (
                              <span className="flex items-center text-red-400 text-xs font-medium">
                                <ShieldAlert className="w-3 h-3 mr-1" /> {t('admin.blockchain_audit.tampered')}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTx(log)} className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10">
                              {t('admin.blockchain_audit.details')}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-1">
            <GlassCard className="h-full flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-[#00d4ff]" />
                {t('admin.blockchain_audit.liveFeed')}
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {logs.slice(0, 10).map((log) => (
                  <div key={`live-${log.id}`} className="relative pl-4 border-l-2 border-[#1a4d2e]">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    <p className="text-sm text-white font-medium capitalize">{log.action_type} {t('admin.blockchain_audit.logged')}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{log.transaction_id.substring(0, 12)}...</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <AuditLogDetailsModal 
        transaction={selectedTx} 
        isOpen={!!selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />
    </div>
  );
};

export default AuditDashboard;