import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const GlassCard = ({ 
  children, 
  className, 
  hover = false,
  animate = true,
  delay = 0,
  ...props 
}) => {
  const baseClasses = hover ? 'glass-card-hover' : 'glass-card';
  
  const content = (
    <div 
      className={cn(
        baseClasses,
        'rounded-2xl p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default GlassCard;