import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard.jsx';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t('testimonials.testimonial1.quote'),
      name: t('testimonials.testimonial1.name'),
      location: t('testimonials.testimonial1.location'),
      image: 'https://images.unsplash.com/photo-1667154290181-135ee2dd5c0e'
    },
    {
      quote: t('testimonials.testimonial2.quote'),
      name: t('testimonials.testimonial2.name'),
      location: t('testimonials.testimonial2.location'),
      image: 'https://images.unsplash.com/photo-1511846859610-ea7712ac1c3d'
    },
    {
      quote: t('testimonials.testimonial3.quote'),
      name: t('testimonials.testimonial3.name'),
      location: t('testimonials.testimonial3.location'),
      image: 'https://images.unsplash.com/photo-1670607951160-d7780f0f0478'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
          {t('testimonials.title')}
        </h2>
      </motion.div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {testimonials.map((testimonial, index) => (
          <GlassCard 
            key={index} 
            delay={index * 0.1}
            className="break-inside-avoid"
          >
            <Quote className="w-10 h-10 text-[#00d4ff] mb-4 opacity-50" />
            <p className="text-gray-300 leading-relaxed mb-6 italic">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.location}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;