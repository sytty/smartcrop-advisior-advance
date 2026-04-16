import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Check, Sparkles, ShieldCheck, Leaf, Building2, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '@/components/GlassCard.jsx';
import { Button } from '@/components/ui/button';

const normalizeFeatures = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return [value];
  }

  if (value && typeof value === 'object') {
    return Object.values(value).filter((item) => typeof item === 'string' && item.trim());
  }

  return [];
};

const normalizePrice = (priceLabel) => {
  const numeric = Number.parseFloat(String(priceLabel).replace(/[^\d.]/g, ''));
  return Number.isFinite(numeric) ? numeric : null;
};

const PricingPage = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = useMemo(() => {
    const freePriceLabel = t('pricing.free.price');
    const proPriceLabel = t('pricing.pro.price');
    const enterprisePriceLabel = t('pricing.enterprise.price');

    const proMonthly = normalizePrice(proPriceLabel);
    const proAnnual = proMonthly ? Math.round((proMonthly * 12 * 0.8) / 12) : null;

    return [
      {
        id: 'free',
        icon: Leaf,
        toneClass: 'text-secondary',
        accentClass: 'bg-gradient-forest',
        name: t('pricing.free.name'),
        price: freePriceLabel,
        monthlyPrice: normalizePrice(freePriceLabel),
        annualPrice: normalizePrice(freePriceLabel),
        description: t('pricing.free.description'),
        features: normalizeFeatures(t('pricing.free.features', { returnObjects: true })),
        cta: t('pricing.free.cta'),
        highlighted: false,
        summary: 'Perfect for getting started with field intelligence.'
      },
      {
        id: 'pro',
        icon: Rocket,
        toneClass: 'text-primary',
        accentClass: 'bg-gradient-electric',
        name: t('pricing.pro.name'),
        price: proPriceLabel,
        monthlyPrice: proMonthly,
        annualPrice: proAnnual,
        description: t('pricing.pro.description'),
        features: normalizeFeatures(t('pricing.pro.features', { returnObjects: true })),
        cta: t('pricing.pro.cta'),
        badge: t('pricing.pro.badge'),
        highlighted: true,
        summary: 'Built for high-performing farms that scale with confidence.'
      },
      {
        id: 'enterprise',
        icon: Building2,
        toneClass: 'text-accent',
        accentClass: 'bg-card border border-border/70',
        name: t('pricing.enterprise.name'),
        price: enterprisePriceLabel,
        monthlyPrice: null,
        annualPrice: null,
        description: t('pricing.enterprise.description'),
        features: normalizeFeatures(t('pricing.enterprise.features', { returnObjects: true })),
        cta: t('pricing.enterprise.cta'),
        highlighted: false,
        summary: 'Tailored platform architecture for organizations and governments.'
      }
    ];
  }, [t]);

  const trustPillars = [
    '99.95% platform availability SLA',
    'Secure infrastructure with encrypted records',
    'Local-first workflows for unreliable connectivity'
  ];

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer: 'Yes. You can upgrade or downgrade at any time without losing historical farm data.'
    },
    {
      question: 'Do you support regional compliance requirements?',
      answer: 'Enterprise plans include deployment and governance controls tailored to your regulatory region.'
    },
    {
      question: 'Is onboarding included?',
      answer: 'Pro includes guided setup. Enterprise includes dedicated onboarding and training sessions.'
    }
  ];

  const renderPrice = (plan) => {
    if (plan.id === 'enterprise') {
      return <span className="text-5xl font-bold text-foreground">{plan.price}</span>;
    }

    const activePrice = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
    if (!Number.isFinite(activePrice)) {
      return <span className="text-5xl font-bold text-foreground">{plan.price}</span>;
    }

    return (
      <>
        <span className="text-5xl font-bold text-foreground">${activePrice}</span>
        <span className="text-muted-foreground ml-2">/month</span>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>{`${t('pricing.title')} - Smart Crop Advisor`}</title>
        <meta name="description" content={t('pricing.subtitle')} />
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
              Precision plans for every stage of growth
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
              {t('pricing.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>

            <div className="mt-8 inline-flex items-center rounded-2xl border border-border/70 bg-card/70 p-1.5">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  billingCycle === 'annual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Annual
              </button>
              <span className="ml-2 rounded-lg bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary">
                Save up to 20%
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <GlassCard
                key={plan.id}
                delay={index * 0.1}
                className={`flex flex-col h-full ${
                  plan.highlighted ? 'ring-2 ring-primary/50 md:scale-[1.03] shadow-[0_12px_40px_hsla(var(--primary)/0.25)]' : ''
                }`}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className={`w-11 h-11 rounded-xl ${plan.accentClass} flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 ${plan.id === 'enterprise' ? 'text-primary' : 'text-white'}`} />
                  </div>
                  {plan.badge && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-electric text-white">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  {renderPrice(plan)}
                </div>

                <p className="text-sm text-muted-foreground mb-6 border-l-2 border-primary/30 pl-3">
                  {plan.summary}
                </p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-auto ${
                    plan.highlighted
                      ? 'bg-gradient-electric text-white hover:brightness-110 glow-electric'
                      : 'border border-primary/30 bg-card/70 text-foreground hover:bg-primary/10'
                  } transition-all duration-200 active:scale-[0.98]`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </GlassCard>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mt-12"
          >
            <GlassCard className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trustPillars.map((pillar, idx) => (
                  <div key={pillar} className="rounded-2xl border border-border/70 bg-card/60 p-4 flex items-start gap-3">
                    {idx === 0 && <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />}
                    {idx === 1 && <Sparkles className="w-5 h-5 text-secondary mt-0.5" />}
                    {idx === 2 && <Leaf className="w-5 h-5 text-accent mt-0.5" />}
                    <p className="text-sm text-foreground/90">{pillar}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <GlassCard className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-foreground mb-5">Frequently asked questions</h3>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-xl border border-border/70 bg-card/60 p-4">
                    <summary className="list-none cursor-pointer font-semibold text-foreground flex items-center justify-between">
                      {faq.question}
                      <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h4 className="text-xl font-bold text-foreground mb-3">Enterprise advisory</h4>
              <p className="text-sm text-muted-foreground mb-5">
                Need a private cloud deployment, policy controls, or custom integrations?
              </p>
              <Button className="w-full bg-gradient-electric text-white hover:brightness-110 glow-electric" size="lg">
                Talk to enterprise team
              </Button>
            </GlassCard>
          </motion.div>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            Need a custom deployment, private cloud, or regional compliance? Contact our enterprise team.
          </div>
        </main>
      </div>
    </>
  );
};

export default PricingPage;