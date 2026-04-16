import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    farm: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success(t('contact.success'));
    setFormData({ name: '', email: '', farm: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${t('contact.title')} - Smart Crop Advisor`}</title>
        <meta name="description" content={t('contact.subtitle')} />
      </Helmet>

      <div className="min-h-screen">
        <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-5">
              <Sparkles className="w-4 h-4 mr-2" />
              We typically respond in under 24 hours
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              {t('contact.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="rounded-xl border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground"
                      placeholder="Maya Chen"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="rounded-xl border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground"
                      placeholder="maya@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="farm" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.farm')}
                    </label>
                    <Input
                      id="farm"
                      name="farm"
                      type="text"
                      required
                      value={formData.farm}
                      onChange={handleChange}
                      className="rounded-xl border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground"
                      placeholder="12.5"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t('contact.message')}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="rounded-xl border-border/80 bg-card/70 text-foreground placeholder:text-muted-foreground"
                      placeholder="I'm interested in monitoring my coffee plantation..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-electric text-white hover:brightness-110 transition-all duration-200 active:scale-[0.98] glow-electric disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                    size="lg"
                  >
                    {isSubmitting ? t('contact.sending') : t('contact.send')}
                  </Button>
                </form>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-electric flex items-center justify-center glow-electric flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
                    <p className="text-muted-foreground">{t('footer.email')}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-forest flex items-center justify-center glow-forest flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
                    <p className="text-muted-foreground">{t('footer.phone')}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-card border border-border/70 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Office</h3>
                    <p className="text-muted-foreground">
                      Agricultural Innovation Hub<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactPage;