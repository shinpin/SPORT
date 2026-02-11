
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalkeeperState, KickResult, GameRole, BallPosition } from '../../types';
import { GOAL_POSITIONS } from '../../constants';

interface GoalAreaProps {
  goalkeeperState: GoalkeeperState;
  gameRole: GameRole;
  activeGrid: number | null;
  netRipple: boolean;
  kickResult: KickResult | null;
  ballPos: BallPosition;
}

const GoalArea: React.FC<GoalAreaProps> = ({
  goalkeeperState, gameRole, activeGrid, netRipple, kickResult, ballPos,
}) => (
  <div className="relative flex-1 flex flex-col items-center justify-center pt-10 perspective-1000">
    <div className={`relative w-full max-w-[340px] aspect-[1.6/1] border-[16px] border-white rounded-t-2xl shadow-[0_-20px_120px_rgba(255,255,255,0.2)] bg-black/70 overflow-hidden transition-colors duration-500 ${netRipple ? 'bg-white/25' : ''}`}>
      <div className="absolute inset-0 bg-goal-net opacity-20" />
      <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 gap-2 p-3">
        {GOAL_POSITIONS.map((pos) => (
          <div
            key={pos.id}
            className={`w-full h-full border border-white/5 rounded-xl transition-all duration-300 ${activeGrid === pos.id ? 'bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : ''}`}
          />
        ))}
      </div>
      <motion.div
        animate={{
          x: goalkeeperState.x,
          y: goalkeeperState.y,
          rotate: goalkeeperState.rotate,
          scale: goalkeeperState.scale,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-36 flex flex-col items-center z-20"
      >
        <div className={`w-15 h-15 rounded-full shadow-2xl border-4 border-black/20 ${gameRole === 'goalie' ? 'bg-blue-400' : 'bg-yellow-400'}`} />
        <div className={`w-22 h-30 rounded-t-[3rem] mt-1 relative overflow-hidden ${gameRole === 'goalie' ? 'bg-blue-600 shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]' : 'bg-yellow-500 shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]'}`} />
      </motion.div>
    </div>

    {/* Kick result overlay */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {kickResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1.8 }}
            exit={{ opacity: 0, scale: 4 }}
            className="flex flex-col items-center gap-2"
          >
            <span className={`font-black italic tracking-tighter uppercase leading-none text-center drop-shadow-[0_0_30px_rgba(0,0,0,1)] ${
              kickResult === 'perfect' ? 'text-yellow-400 text-6xl' :
              kickResult === 'saved' ? 'text-blue-400 text-4xl' :
              kickResult === 'fail' ? 'text-red-400 text-4xl' :
              'text-green-500 text-5xl'
            }`}>
              {kickResult === 'perfect' ? '完美進球!' :
               kickResult === 'saved' ? '被擋下了!' :
               kickResult === 'fail' ? '失球了!' :
               '成功得分!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default GoalArea;
