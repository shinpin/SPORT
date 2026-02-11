
import React from 'react';
import { motion } from 'framer-motion';

const StadiumBackground: React.FC = () => (
  <div className="absolute inset-0 z-0">
    <img
      src="https://i.postimg.cc/m20zmy2V/qiu-chang02.png"
      className="w-full h-full object-cover opacity-60"
      alt="Stadium Arena"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#050b15]/70 via-transparent to-[#050b15]" />

    <motion.div
      animate={{ opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute top-0 left-1/4 w-32 h-full bg-blue-400/20 blur-[100px] skew-x-[-30deg]"
    />
    <motion.div
      animate={{ opacity: [0.1, 0.2, 0.1] }}
      transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      className="absolute top-0 right-1/4 w-40 h-full bg-blue-400/10 blur-[120px] skew-x-[30deg]"
    />
  </div>
);

export default StadiumBackground;
