import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('auth.login.fillAll', { defaultValue: 'Please fill in all fields' }));
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.login.success', { defaultValue: 'Welcome back!' }));
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(t('auth.login.invalid', { defaultValue: 'Invalid email or password' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 noise-overlay">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('auth.login.pageTitle', { defaultValue: 'Sign in to your account' })}</h1>
          <p className="text-muted-foreground mt-2">{t('auth.login.pageSubtitle', { defaultValue: 'Enter your details to access your farm data' })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email', { defaultValue: 'Email' })}</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={t('auth.emailPlaceholder', { defaultValue: 'farmer@example.com' })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.password', { defaultValue: 'Password' })}</Label>
              <Link to="/password-reset" className="text-sm text-primary hover:underline">
                {t('auth.login.forgotPassword', { defaultValue: 'Forgot password?' })}
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('auth.login.rememberMe', { defaultValue: 'Remember me' })}
            </label>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {t('auth.login.submitLabel', { defaultValue: 'Sign In' })}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.login.noAccount', { defaultValue: "Don't have an account?" })}{' '}
          <Link to="/signup" className="text-primary hover:underline font-medium">
            {t('auth.login.signupLink', { defaultValue: 'Sign up' })}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}