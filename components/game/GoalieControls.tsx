
import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, Circle,
} from 'lucide-react';

interface GoalieControlsProps {
  isKicking: boolean;
  onDefend: (goalIdx: number) => void;
}

function getDirectionIcon(id: number) {
  switch (id) {
    case 0: return <ArrowUpLeft className="w-6 h-6" />;
    case 1: return <ChevronUp className="w-6 h-6" />;
    case 2: return <ArrowUpRight className="w-6 h-6" />;
    case 3: return <ChevronLeft className="w-6 h-6" />;
    case 4: return <Circle className="w-6 h-6 fill-current" />;
    case 5: return <ChevronRight className="w-6 h-6" />;
    case 6: return <ArrowDownLeft className="w-6 h-6" />;
    case 7: return <ChevronDown className="w-6 h-6" />;
    case 8: return <ArrowDownRight className="w-6 h-6" />;
    default: return null;
  }
}

const GoalieControls: React.FC<GoalieControlsProps> = ({ isKicking, onDefend }) => (
  <div className="w-full flex flex-col items-center gap-8 pb-10">
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-white font-black italic uppercase tracking-[0.2em] text-sm flex flex-col items-center gap-4"
    >
      <div className="p-5 bg-blue-600 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.7)] border-2 border-white/20">
        <ShieldCheck className="w-12 h-12 text-white" />
      </div>
      點擊網格防禦射門!
    </motion.div>
    <div className="grid grid-cols-3 gap-5 bg-black/40 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
        <button
          key={id}
          onClick={() => onDefend(id)}
          disabled={isKicking}
          className="w-18 h-18 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 active:scale-90 active:bg-blue-600 active:text-white transition-all shadow-2xl"
        >
          {getDirectionIcon(id)}
        </button>
      ))}
    </div>
  </div>
);

export default GoalieControls;
