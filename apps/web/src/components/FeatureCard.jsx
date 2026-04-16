import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard.jsx';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <GlassCard hover delay={delay} className="h-full flex flex-col">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="w-14 h-14 rounded-xl bg-gradient-electric flex items-center justify-center mb-4 glow-electric"
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </GlassCard>
  );
};

export default FeatureCard;