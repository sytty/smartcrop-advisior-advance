import React from 'react';
import { motion } from 'framer-motion';

const LiveIndicator = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="w-2 h-2 rounded-full bg-[#00d4ff]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#00d4ff]"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <span className="text-xs font-medium text-[#00d4ff] uppercase tracking-wider">Live</span>
    </div>
  );
};

export default LiveIndicator;