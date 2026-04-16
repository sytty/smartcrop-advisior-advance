import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedChart from './AnimatedChart.jsx';

const PHGaugeChart = ({ title }) => {
  const [pH, setPH] = useState(6.8);
  const [targetPH, setTargetPH] = useState(6.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetPH(6.2 + Math.random() * 1.2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setPH(current => {
        const diff = targetPH - current;
        if (Math.abs(diff) < 0.01) return targetPH;
        return current + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(animationInterval);
  }, [targetPH]);

  const percentage = ((pH - 5.5) / 3) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = (value) => {
    if (value >= 6.0 && value <= 7.0) return '#1a4d2e';
    return '#00d4ff';
  };

  return (
    <AnimatedChart title={title}>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-24">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#1a4d2e" />
                <stop offset="100%" stopColor="#00d4ff" />
              </linearGradient>
            </defs>
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 20 80 A 80 80 0 0 1 180 80"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-16 origin-bottom"
            style={{
              background: getColor(pH),
              boxShadow: `0 0 10px ${getColor(pH)}`,
              transformOrigin: 'bottom center',
              marginLeft: '-2px',
              marginTop: '-64px'
            }}
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center mt-4">
          <div className="text-3xl font-bold text-white font-variant-tabular">
            {pH.toFixed(1)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {pH >= 6.0 && pH <= 7.0 ? 'Optimal' : 'Adjust'}
          </div>
        </div>
      </div>
    </AnimatedChart>
  );
};

export default PHGaugeChart;