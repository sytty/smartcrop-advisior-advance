import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success(t('auth.passwordReset.sent', { defaultValue: 'Reset link sent to your email' }));
    } catch (error) {
      toast.error(t('auth.passwordReset.failed', { defaultValue: 'Failed to send reset link' }));
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
            <KeyRound className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('auth.passwordReset.pageTitle', { defaultValue: 'Reset Password' })}</h1>
          <p className="text-muted-foreground mt-2 text-center">
            {submitted ? t('auth.passwordReset.checkEmail', { defaultValue: 'Check your email for instructions' }) : t('auth.passwordReset.enterEmail', { defaultValue: 'Enter your email to receive a reset link' })}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email', { defaultValue: 'Email' })}</Label>
              <Input 
                id="email" 
                type="email" 
                required
                placeholder={t('auth.emailPlaceholder', { defaultValue: 'farmer@example.com' })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {t('auth.passwordReset.submitLabel', { defaultValue: 'Send Reset Link' })}
            </Button>
          </form>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
            {t('auth.passwordReset.tryAnother', { defaultValue: 'Try another email' })}
          </Button>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth.passwordReset.backToLogin', { defaultValue: 'Back to login' })}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}