import React from 'react';
import { motion } from 'framer-motion';

function Card({ children, className = '', hover = true, padding = 'p-6', shadow = 'shadow-soft', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-lg ${shadow} border border-amani-orange-100 ${padding} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;