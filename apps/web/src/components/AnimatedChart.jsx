import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard.jsx';

const AnimatedChart = ({ children, title, className }) => {
  return (
    <GlassCard className={className} hover>
      {title && (
        <motion.h3 
          className="text-lg font-semibold mb-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </GlassCard>
  );
};

export default AnimatedChart;