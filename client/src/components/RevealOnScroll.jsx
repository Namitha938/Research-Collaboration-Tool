import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RevealOnScroll = ({ children, delay = 0, threshold = 0.2, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  // Convert delay from milliseconds (used previously) to seconds for Framer Motion
  const delayInSeconds = delay ? delay / 1000 : 0;

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: shouldReduceMotion ? 0 : 40 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0 
      }}
      viewport={{ 
        once: true, 
        amount: threshold 
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: delayInSeconds
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
