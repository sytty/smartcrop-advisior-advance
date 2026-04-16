import React, { useRef, useEffect, useState } from 'react';
import { motion , useInView } from 'framer-motion';

const ImpactStat = ({ value, label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const suffix = value.replace(/[0-9.,]/g, '');
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          const formatted = suffix.includes('M') || suffix.includes('k') 
            ? current.toFixed(1) 
            : Math.floor(current).toLocaleString();
          setDisplayValue(formatted + suffix);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-glow-electric mb-2 font-variant-tabular">
        {displayValue}
      </div>
      <div className="text-gray-400 text-sm uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

export default ImpactStat;