
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Team } from '../../types';

interface RoleSwapOverlayProps {
  show: boolean;
  team: Team;
}

const RoleSwapOverlay: React.FC<RoleSwapOverlayProps> = ({ show, team }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ x: '-150%', skewX: -45 }}
          animate={{ x: '150%' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-r ${team.gradient} opacity-90 z-[101] shadow-[0_0_100px_white]`}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          transition={{ delay: 0.3 }}
          className="relative z-[102] flex flex-col items-center"
        >
          <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/20 shadow-[0_0_120px_rgba(255,255,255,0.4)]">
            <ShieldCheck className="w-28 h-28 text-white mb-6 animate-bounce" />
            <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] text-center">攻守互換!</h2>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default RoleSwapOverlay;
