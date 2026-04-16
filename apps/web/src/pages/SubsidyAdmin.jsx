import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Download, CheckCircle, XCircle, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubsidyVerification } from '@/hooks/useSubsidyVerification.js';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplicationStatusBadge from '@/components/ApplicationStatusBadge.jsx';

const SubsidyAdmin = () => {
  const { getApplications, updateApplicationStatus, loading } = useSubsidyVerification();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      const apps = await getApplications(null, true);
      setApplications(apps);
    };
    fetchApps();
  }, [getApplications]);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.expand?.farmer_id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedApp) return;
    try {
      await updateApplicationStatus(selectedApp.id, newStatus, adminNotes);
      toast.success(`Application marked as ${newStatus}`);
      
      // Update local state
      setApplications(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, status: newStatus, admin_notes: adminNotes } : a
      ));
      setSelectedApp(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>Subsidy Administration - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <FileText className="w-8 h-8 mr-3 text-[#00d4ff]" />
              Subsidy Administration
            </h1>
            <p className="text-gray-400">Review, approve, and manage farmer subsidy applications.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </motion.div>
        </div>

        <GlassCard className="p-0 overflow-hidden mb-8">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search farmer name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-black/40 border-white/10 text-white">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10">
                  <SelectItem value="all" className="text-white hover:bg-white/10">All Statuses</SelectItem>
                  <SelectItem value="submitted" className="text-white hover:bg-white/10">Submitted</SelectItem>
                  <SelectItem value="under_review" className="text-white hover:bg-white/10">Under Review</SelectItem>
                  <SelectItem value="approved" className="text-white hover:bg-white/10">Approved</SelectItem>
                  <SelectItem value="rejected" className="text-white hover:bg-white/10">Rejected</SelectItem>
                  <SelectItem value="paid" className="text-white hover:bg-white/10">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 border-b border-white/10 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Farmer</th>
                  <th className="px-6 py-4 font-medium">Crop</th>
                  <th className="px-6 py-4 font-medium">Land Size</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">Loading applications...</td></tr>
                ) : filteredApps.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400">No applications found.</td></tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{app.expand?.farmer_id?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-300">{app.crop_type}</td>
                      <td className="px-6 py-4 text-gray-300">{app.land_size} ha</td>
                      <td className="px-6 py-4 text-[#00d4ff] font-medium">₹{app.subsidy_amount?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4"><ApplicationStatusBadge status={app.status} /></td>
                      <td className="px-6 py-4 text-gray-400 text-xs">{new Date(app.application_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => { setSelectedApp(app); setAdminNotes(app.admin_notes || ''); }} 
                          className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10"
                        >
                          Review
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

      {/* Admin Review Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white">Review Application</h2>
                <button onClick={() => setSelectedApp(null)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Farmer Name</p>
                    <p className="text-white font-medium">{selectedApp.expand?.farmer_id?.name || 'Unknown'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Calculated Amount</p>
                    <p className="text-xl font-bold text-[#00d4ff]">₹{selectedApp.subsidy_amount?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Admin Notes</label>
                  <textarea 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50"
                    placeholder="Add notes regarding approval or rejection..."
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 justify-end">
                  {selectedApp.status !== 'paid' && (
                    <>
                      <Button onClick={() => handleStatusUpdate('rejected')} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                      <Button onClick={() => handleStatusUpdate('under_review')} className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-0">
                        Mark Under Review
                      </Button>
                      <Button onClick={() => handleStatusUpdate('approved')} className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-0">
                        <CheckCircle className="w-4 h-4 mr-2" /> Approve
                      </Button>
                    </>
                  )}
                  {selectedApp.status === 'approved' && (
                    <Button onClick={() => handleStatusUpdate('paid')} className="bg-gradient-electric text-white hover:brightness-110 border-0">
                      <DollarSign className="w-4 h-4 mr-2" /> Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubsidyAdmin;