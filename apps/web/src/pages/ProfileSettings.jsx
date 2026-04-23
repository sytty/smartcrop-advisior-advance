import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldCheck, Settings2, Sparkles, UserCog, Save, RotateCcw, LogOut, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import farmManagementApi from '@/lib/farmManagementApi.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const preferenceKey = 'smart-crop-settings';

const defaultPreferences = {
  notifications: true,
  language: 'en',
  unitSystem: 'metric',
  density: 'comfortable',
};

const regionOptions = ['North', 'South', 'East', 'West', 'Central'];
const languageOptions = ['en', 'hi', 'es', 'fr'];

export default function ProfileSettings() {
  const { t } = useTranslation();
  const { currentUser, refreshSession, logout, resetPassword } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    farm_name: '',
    region: '',
  });
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    if (!currentUser) return;

    setProfile({
      name: currentUser.name || '',
      farm_name: currentUser.farm_name || '',
      region: currentUser.region || '',
    });

    try {
      const stored = localStorage.getItem(preferenceKey);
      if (stored) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
      }
    } catch (_) {
      setPreferences(defaultPreferences);
    }
  }, [currentUser]);

  const initials = useMemo(() => {
    return (profile.name || currentUser?.email || 'F')
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [currentUser?.email, profile.name]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      await farmManagementApi.updateProfile(currentUser.id, {
        name: profile.name.trim(),
        farm_name: profile.farm_name.trim(),
        region: profile.region.trim(),
      });

      await refreshSession();
      toast.success(t('profile.successUpdated', { defaultValue: 'Profile updated successfully' }));
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(t('profile.failedUpdate', { defaultValue: 'Unable to update profile' }));
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesSave = (event) => {
    event.preventDefault();
    localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    toast.success(t('profile.settingsSaved', { defaultValue: 'Settings saved' }));
  };

  const handleResetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem(preferenceKey);
    toast.success(t('profile.settingsRestored', { defaultValue: 'Settings restored to defaults' }));
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    try {
      await resetPassword(currentUser.email);
      toast.success(t('profile.resetEmailSent', { defaultValue: 'Password reset email sent' }));
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(t('profile.resetEmailFailed', { defaultValue: 'Unable to send password reset email' }));
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border/60 bg-gradient-to-br from-sky-500/10 via-background to-background p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3 max-w-2xl">
              <Badge className="w-fit rounded-full bg-sky-500/15 text-sky-600 border-sky-500/20">{t('profile.badge', { defaultValue: 'Profile / Settings' })}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t('profile.heroTitle', { defaultValue: 'Keep your account and farm preferences in sync.' })}</h1>
              <p className="text-muted-foreground">{t('profile.heroSubtitle', { defaultValue: 'Update your public profile, farm identity, and app preferences from one dashboard.' })}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePasswordReset} className="rounded-xl">
                <Mail className="w-4 h-4 mr-2" /> {t('profile.resetPassword', { defaultValue: 'Reset Password' })}
              </Button>
              <Button variant="destructive" onClick={logout} className="rounded-xl">
                <LogOut className="w-4 h-4 mr-2" /> {t('profile.signOut', { defaultValue: 'Sign Out' })}
              </Button>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <Card className="rounded-3xl border-border/70 shadow-xl">
            <CardHeader>
              <CardTitle>{t('profile.accountSnapshot', { defaultValue: 'Account snapshot' })}</CardTitle>
              <CardDescription>{t('profile.accountSnapshotDescription', { defaultValue: 'Quick overview of the profile currently connected to this session.' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card/70 p-4">
                <div className="h-16 w-16 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center text-xl font-semibold border border-sky-500/20">
                  {initials}
                </div>
                <div>
                  <div className="text-lg font-semibold">{profile.name || currentUser?.email || 'Farmer profile'}</div>
                  <div className="text-sm text-muted-foreground">{currentUser?.email || t('profile.noEmail', { defaultValue: 'No email on file' })}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: t('profile.role', { defaultValue: 'Role' }), value: currentUser?.role || t('profile.roleDefault', { defaultValue: 'farmer' }), icon: UserCog },
                  { label: t('profile.farm', { defaultValue: 'Farm' }), value: profile.farm_name || t('profile.notSet', { defaultValue: 'Not set' }), icon: Sparkles },
                  { label: t('profile.region', { defaultValue: 'Region' }), value: profile.region || t('profile.notSet', { defaultValue: 'Not set' }), icon: Settings2 },
                  { label: t('profile.notifications', { defaultValue: 'Notifications' }), value: preferences.notifications ? t('profile.enabled', { defaultValue: 'Enabled' }) : t('profile.muted', { defaultValue: 'Muted' }), icon: Bell },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-border/70 bg-card/80 p-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.label}</span>
                        <Icon className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="mt-2 font-semibold">{item.value}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="rounded-3xl border-border/70 shadow-xl">
              <CardHeader>
                <CardTitle>{t('profile.editProfile', { defaultValue: 'Edit profile' })}</CardTitle>
                <CardDescription>{t('profile.editProfileDescription', { defaultValue: 'Update the display name and farm details visible throughout the app.' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleProfileSave}>
                  <div className="space-y-2">
                      <Label htmlFor="name">{t('profile.displayName', { defaultValue: 'Display name' })}</Label>
                      <Input id="name" value={profile.name} onChange={(event) => setProfile((prev) => ({ ...prev, name: event.target.value }))} placeholder={t('profile.displayNamePlaceholder', { defaultValue: 'Farmer name' })} required />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="farm_name">{t('profile.farmName', { defaultValue: 'Farm name' })}</Label>
                      <Input id="farm_name" value={profile.farm_name} onChange={(event) => setProfile((prev) => ({ ...prev, farm_name: event.target.value }))} placeholder={t('profile.farmNamePlaceholder', { defaultValue: 'Green Valley Farm' })} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="region">{t('profile.regionLabel', { defaultValue: 'Region' })}</Label>
                    <Select value={profile.region || undefined} onValueChange={(value) => setProfile((prev) => ({ ...prev, region: value }))}>
                      <SelectTrigger id="region">
                          <SelectValue placeholder={t('profile.selectRegion', { defaultValue: 'Select region' })} />
                      </SelectTrigger>
                      <SelectContent>
                        {regionOptions.map((region) => (
                            <SelectItem key={region} value={region}>{t(`profile.regions.${region.toLowerCase()}`, { defaultValue: region })}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={saving} className="rounded-xl bg-sky-600 hover:bg-sky-500 text-white">
                      <Save className="w-4 h-4 mr-2" /> {saving ? t('profile.saving', { defaultValue: 'Saving...' }) : t('profile.saveProfile', { defaultValue: 'Save profile' })}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 shadow-xl">
              <CardHeader>
                <CardTitle>{t('profile.appPreferences', { defaultValue: 'App preferences' })}</CardTitle>
                <CardDescription>{t('profile.appPreferencesDescription', { defaultValue: 'Control the way the platform behaves for your daily farm operations.' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handlePreferencesSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t('profile.notificationMode', { defaultValue: 'Notification mode' })}</Label>
                      <Select value={preferences.notifications ? 'enabled' : 'muted'} onValueChange={(value) => setPreferences((prev) => ({ ...prev, notifications: value === 'enabled' }))}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('profile.notificationMode', { defaultValue: 'Notification mode' })} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="enabled">{t('profile.enabled', { defaultValue: 'Enabled' })}</SelectItem>
                            <SelectItem value="muted">{t('profile.muted', { defaultValue: 'Muted' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('profile.measurementSystem', { defaultValue: 'Measurement system' })}</Label>
                      <Select value={preferences.unitSystem} onValueChange={(value) => setPreferences((prev) => ({ ...prev, unitSystem: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('profile.measurementSystem', { defaultValue: 'Measurement system' })} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="metric">{t('profile.metric', { defaultValue: 'Metric' })}</SelectItem>
                            <SelectItem value="imperial">{t('profile.imperial', { defaultValue: 'Imperial' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('profile.language', { defaultValue: 'Language' })}</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('profile.language', { defaultValue: 'Language' })} />
                        </SelectTrigger>
                        <SelectContent>
                          {languageOptions.map((language) => (
                              <SelectItem key={language} value={language}>{t(`profile.languages.${language}`, { defaultValue: language.toUpperCase() })}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>{t('profile.density', { defaultValue: 'Density' })}</Label>
                      <Select value={preferences.density} onValueChange={(value) => setPreferences((prev) => ({ ...prev, density: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('profile.density', { defaultValue: 'Density' })} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="comfortable">{t('profile.comfortable', { defaultValue: 'Comfortable' })}</SelectItem>
                            <SelectItem value="compact">{t('profile.compact', { defaultValue: 'Compact' })}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="rounded-xl bg-sky-600 hover:bg-sky-500 text-white">
                        <Save className="w-4 h-4 mr-2" /> {t('profile.saveSettings', { defaultValue: 'Save settings' })}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleResetPreferences} className="rounded-xl">
                        <RotateCcw className="w-4 h-4 mr-2" /> {t('profile.reset', { defaultValue: 'Reset' })}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/70 shadow-xl">
              <CardHeader>
                <CardTitle>{t('profile.security', { defaultValue: 'Security' })}</CardTitle>
                <CardDescription>{t('profile.securityDescription', { defaultValue: 'Manage sign-in access and recovery options for your account.' })}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                    <div className="font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> {t('profile.accountProtected', { defaultValue: 'Account protected' })}</div>
                    <p className="text-sm text-muted-foreground">{t('profile.resetEmailNotice', { defaultValue: 'Password reset emails are sent to' })} {currentUser?.email || t('profile.yourAccountEmail', { defaultValue: 'your account email' })}.</p>
                </div>
                <Button variant="outline" onClick={handlePasswordReset} className="rounded-xl">
                    <Mail className="w-4 h-4 mr-2" /> {t('profile.sendResetLink', { defaultValue: 'Send reset link' })}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}