import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function SignupPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '', password: '', passwordConfirm: '', farm_name: '', region: '', role: 'farmer'
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error(t('auth.signup.acceptTerms', { defaultValue: 'You must accept the terms and conditions' }));
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error(t('auth.signup.passwordMismatch', { defaultValue: 'Passwords do not match' }));
      return;
    }
    setLoading(true);
    try {
      await signup(formData);
      toast.success(t('auth.signup.success', { defaultValue: 'Account created successfully!' }));
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || t('auth.signup.failed', { defaultValue: 'Failed to create account' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 noise-overlay py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('auth.signup.pageTitle', { defaultValue: 'Create an account' })}</h1>
          <p className="text-muted-foreground mt-2">{t('auth.signup.pageSubtitle', { defaultValue: 'Join the future of farming' })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email', { defaultValue: 'Email' })}</Label>
            <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm_name">{t('auth.signup.farmName', { defaultValue: 'Farm Name' })}</Label>
            <Input id="farm_name" required value={formData.farm_name} onChange={(e) => setFormData({...formData, farm_name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region">{t('auth.signup.region', { defaultValue: 'Region' })}</Label>
            <Select onValueChange={(val) => setFormData({...formData, region: val})}>
              <SelectTrigger><SelectValue placeholder={t('auth.signup.selectRegion', { defaultValue: 'Select region' })} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Maharashtra">{t('auth.signup.regions.maharashtra', { defaultValue: 'Maharashtra' })}</SelectItem>
                <SelectItem value="Punjab">{t('auth.signup.regions.punjab', { defaultValue: 'Punjab' })}</SelectItem>
                <SelectItem value="Karnataka">{t('auth.signup.regions.karnataka', { defaultValue: 'Karnataka' })}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password', { defaultValue: 'Password' })}</Label>
              <Input id="password" type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">{t('auth.signup.confirmPassword', { defaultValue: 'Confirm' })}</Label>
              <Input id="passwordConfirm" type="password" required value={formData.passwordConfirm} onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})} />
            </div>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={setAcceptedTerms} />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('auth.signup.acceptTermsLabel', { defaultValue: 'I accept the terms and conditions' })}
            </label>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('auth.signup.submitLabel', { defaultValue: 'Create Account' })}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.signup.haveAccount', { defaultValue: 'Already have an account?' })}{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            {t('auth.signup.signInLink', { defaultValue: 'Sign in' })}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}