import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, X, FileSearch, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSubsidyVerification } from '@/hooks/useSubsidyVerification.js';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import ApplicationStatusBadge from '@/components/ApplicationStatusBadge.jsx';
import { useTranslation } from 'react-i18next';

const SubsidyPortal = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { getApplications, loading } = useSubsidyVerification();
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      if (currentUser) {
        const apps = await getApplications(currentUser.id);
        setApplications(apps);
      }
    };

    fetchApps();
  }, [currentUser, getApplications]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8 noise-overlay">
      <Helmet>
        <title>{t('enterprise.subsidyPortal.title')} - Smart Crop Advisor</title>
      </Helmet>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-1">Subsidy Operations</p>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-primary" />
                {t('enterprise.subsidyPortal.title')}
              </h1>
              <p className="text-muted-foreground">{t('enterprise.subsidyPortal.subtitle')}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="elevated-card rounded-full px-3 py-1.5 text-sm text-muted-foreground">
                Applications: <span className="text-foreground font-semibold">{applications.length}</span>
              </span>
              <Button asChild className="bg-gradient-electric text-white border-0 hover:brightness-110 rounded-xl">
                <Link to="/subsidy-verification">
                  <Plus className="w-4 h-4 mr-2" /> {t('enterprise.subsidyPortal.newApp')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-0 overflow-hidden rounded-3xl border-border/70">
              <div className="p-6 border-b border-border/70 bg-card/70">
                <h2 className="text-xl font-bold text-foreground">{t('enterprise.subsidyPortal.myApps')}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-background/70 border-b border-border/70 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-medium">{t('enterprise.subsidyPortal.date')}</th>
                      <th className="px-6 py-4 font-medium">{t('enterprise.subsidyPortal.crop')}</th>
                      <th className="px-6 py-4 font-medium">{t('enterprise.subsidyPortal.amount')}</th>
                      <th className="px-6 py-4 font-medium">{t('enterprise.subsidyPortal.status')}</th>
                      <th className="px-6 py-4 font-medium text-right">{t('enterprise.subsidyPortal.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                          <div className="space-y-3">
                            <div className="mx-auto h-4 w-40 loading-shimmer rounded-full" />
                            <div className="mx-auto h-3 w-56 loading-shimmer rounded-full" />
                            <p>{t('enterprise.subsidyPortal.loading')}</p>
                          </div>
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                          <div className="rounded-2xl border border-dashed border-border/70 bg-card/60 px-6 py-10">
                            <FileText className="w-10 h-10 mx-auto mb-3 text-primary/60" />
                            <p className="font-semibold text-foreground mb-1">{t('enterprise.subsidyPortal.noApps')}</p>
                            <p className="text-sm text-muted-foreground">Your subsidy submissions will appear here after you start an application.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 text-muted-foreground">{new Date(app.application_date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-foreground font-medium">{app.crop_type}</td>
                          <td className="px-6 py-4 text-primary font-semibold">₹{app.subsidy_amount?.toLocaleString() || 0}</td>
                          <td className="px-6 py-4">
                            <ApplicationStatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedApp(app)}
                              className="text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl"
                            >
                              {t('enterprise.subsidyPortal.viewDetails')}
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

          <div className="space-y-6">
            <GlassCard className="p-6 rounded-3xl border-border/70">
              <h3 className="text-lg font-bold text-foreground mb-4">{t('enterprise.subsidyPortal.notifications')}</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-card/70 border border-border/70">
                  <p className="text-sm text-foreground font-medium mb-1">{t('enterprise.subsidyPortal.cycleOpen')}</p>
                  <p className="text-xs text-muted-foreground">{t('enterprise.subsidyPortal.cycleOpenDesc')}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-700 font-medium mb-1 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> {t('enterprise.subsidyPortal.paymentProcessed')}
                  </p>
                  <p className="text-xs text-muted-foreground">{t('enterprise.subsidyPortal.paymentProcessedDesc')}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-border/70 shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border/70 bg-card/90 backdrop-blur-md">
                <h2 className="text-xl font-bold text-foreground flex items-center">
                  <FileSearch className="w-5 h-5 mr-2 text-primary" /> {t('enterprise.subsidyPortal.appDetails')}
                </h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('enterprise.subsidyPortal.status')}</p>
                    <div className="mt-1"><ApplicationStatusBadge status={selectedApp.status} /></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t('enterprise.subsidyPortal.estAmount')}</p>
                    <p className="text-2xl font-bold text-primary">₹{selectedApp.subsidy_amount?.toLocaleString() || 0}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card/70 p-4 rounded-xl border border-border/70">
                    <p className="text-xs text-muted-foreground mb-1">{t('enterprise.subsidyPortal.crop')}</p>
                    <p className="text-foreground font-medium">{selectedApp.crop_type}</p>
                  </div>
                  <div className="bg-card/70 p-4 rounded-xl border border-border/70">
                    <p className="text-xs text-muted-foreground mb-1">{t('enterprise.subsidyPortal.landSize')}</p>
                    <p className="text-foreground font-medium">{selectedApp.land_size} Hectares</p>
                  </div>
                  <div className="bg-card/70 p-4 rounded-xl border border-border/70">
                    <p className="text-xs text-muted-foreground mb-1">{t('enterprise.subsidyPortal.appDate')}</p>
                    <p className="text-foreground font-medium">{new Date(selectedApp.application_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-card/70 p-4 rounded-xl border border-border/70">
                    <p className="text-xs text-muted-foreground mb-1">{t('enterprise.subsidyPortal.bankAccount')}</p>
                    <p className="text-foreground font-medium">{selectedApp.bank_account}</p>
                  </div>
                </div>

                {selectedApp.admin_notes && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                    <p className="text-sm font-medium text-yellow-500 mb-1">{t('enterprise.subsidyPortal.adminNotes')}</p>
                    <p className="text-sm text-muted-foreground">{selectedApp.admin_notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubsidyPortal;
