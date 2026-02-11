
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Star, Sparkles, Flame } from 'lucide-react';
import { Team, BallPosition, StrikerAnimation } from '../../types';

interface StrikerControlsProps {
  team: Team;
  power: number;
  isCharging: boolean;
  isKicking: boolean;
  gameStarted: boolean;
  isPerfectZone: boolean;
  chargeIntensity: number;
  strikerAnim: StrikerAnimation;
  attemptsInPhase: number;
  ballPos: BallPosition;
  onStartCharging: () => void;
  onShoot: () => void;
}

const StrikerControls: React.FC<StrikerControlsProps> = ({
  team, power, isCharging, isKicking, gameStarted,
  isPerfectZone, chargeIntensity, strikerAnim,
  attemptsInPhase, ballPos, onStartCharging, onShoot,
}) => (
  <>
    {/* Striker character */}
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{
        x: isCharging ? [-2, 2, -1, 1, 0] : 0,
        opacity: 1,
        scale: isCharging ? [1.02, 1, 1.02] : strikerAnim === 'kick' ? 0.85 : strikerAnim === 'followthrough' ? 1.1 : 1,
        rotate: isCharging ? (chargeIntensity * -12) : strikerAnim === 'followthrough' ? -15 : 0,
        y: isCharging ? [0, -4, 0] : 0,
      }}
      transition={isCharging ? { repeat: Infinity, duration: 0.12 - (chargeIntensity * 0.08) } : { type: 'spring', damping: 12 }}
      className="absolute bottom-16 left-2 z-[25] pointer-events-none flex flex-col items-center"
    >
      <AnimatePresence>
        {isCharging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.4 + (chargeIntensity * 0.6), scale: 0.8 + (chargeIntensity * 0.7) }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-400 blur-[50px] rounded-full translate-y-12 translate-x-10 z-0"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPerfectZone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.6, 1.2] }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="absolute inset-0 bg-yellow-400 blur-[60px] rounded-full translate-y-12 translate-x-10 z-0"
          />
        )}
      </AnimatePresence>

      <div className={`mb-3 px-7 py-2 rounded-full border-2 translate-x-16 shadow-2xl transition-all duration-300 ${isPerfectZone ? 'bg-yellow-500 border-white scale-110 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-blue-600/90 border-white/30'}`}>
        <span className="text-[13px] font-black italic text-white uppercase tracking-widest flex items-center gap-2">
          {isPerfectZone && <Star className="w-3.5 h-3.5 fill-white animate-spin" />}
          {team.starPlayer}
          {isPerfectZone && <Star className="w-3.5 h-3.5 fill-white animate-spin" />}
        </span>
      </div>
      <div className="relative w-52 h-72 rotate-[12deg]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-22 h-22 bg-[#eec39a] rounded-full shadow-2xl border-2 border-black/10 z-10 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-black/10" />
        </div>
        <div className={`absolute top-16 left-1/2 -translate-x-1/2 w-36 h-48 bg-gradient-to-b ${team.gradient} rounded-t-[4rem] rounded-b-[2rem] shadow-2xl flex items-center justify-center transition-all duration-300 ${isPerfectZone ? 'ring-8 ring-yellow-400 ring-offset-4 ring-offset-black/50' : isCharging ? 'ring-4 ring-white/40' : ''}`}>
          <div className="text-8xl font-black italic text-white/10 select-none">10</div>
        </div>
      </div>
    </motion.div>

    {/* Power gauge */}
    <div className="w-full max-w-sm bg-blue-950/70 backdrop-blur-2xl p-5 rounded-[2.5rem] border border-white/20 mb-2 relative z-40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-3 px-2">
        <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Zap className={`w-4 h-4 ${isCharging ? 'animate-pulse text-yellow-400' : ''}`} /> 射門動能
        </span>
        <AnimatePresence>
          {isPerfectZone && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-yellow-400 text-black text-[10px] font-black px-3 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            >
              <Sparkles className="w-3 h-3 fill-black" /> 完美區域
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="relative h-10 w-full bg-black/60 rounded-full p-1.5 border border-white/10 overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-white/5" />
          <div className="flex-1 border-r border-white/5" />
          <div className="flex-1 border-r border-white/5" />
          <div className="flex-1 border-r border-white/5" />
        </div>
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-r from-blue-700 via-green-400 to-red-600 opacity-20" />
        <motion.div
          animate={{
            width: `${power}%`,
            backgroundColor: isPerfectZone ? '#fbbf24' : '#3b82f6',
            boxShadow: isPerfectZone ? '0 0 30px rgba(251, 191, 36, 1)' : '0 0 15px rgba(59, 130, 246, 0.5)',
          }}
          className="h-full rounded-full transition-all duration-75 relative z-10"
        >
          {isCharging && (
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="absolute inset-0 bg-white/30 blur-sm rounded-full"
            />
          )}
        </motion.div>
        <div className="absolute top-0 bottom-0 left-[88%] w-[7%] bg-yellow-400/10 border-x-2 border-yellow-400/40 z-20" />
      </div>
    </div>

    {/* Shoot button + ball */}
    <div className="flex flex-col items-center gap-8 relative w-full pt-4">
      <div className="relative z-40">
        <motion.button
          onMouseDown={onStartCharging}
          onMouseUp={onShoot}
          onTouchStart={onStartCharging}
          onTouchEnd={onShoot}
          disabled={isKicking || !gameStarted}
          className={`relative w-40 h-40 rounded-full border-[12px] flex flex-col items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-200 active:scale-90 ${isCharging ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/10 bg-white/5'}`}
        >
          <AnimatePresence>
            {isCharging && (
              <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 0.3, scale: 0.8 }}
                transition={{ repeat: Infinity, duration: 0.4 }}
                className="absolute inset-0 rounded-full bg-white blur-xl"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 flex flex-col items-center">
            <Zap className={`w-14 h-14 mb-1 transition-all ${isPerfectZone ? 'text-white scale-125' : isCharging ? 'text-yellow-400 animate-pulse' : 'text-blue-500'}`} />
            <span className="text-[16px] font-black italic text-white uppercase tracking-tighter drop-shadow-md">射門</span>
          </div>

          <div className="absolute -bottom-6 flex gap-2.5 bg-black/90 px-5 py-2.5 rounded-full border border-white/20 shadow-2xl">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-6 h-6 rounded-full transition-all duration-300 border ${i < (3 - attemptsInPhase) ? 'bg-white border-white shadow-[0_0_15px_white]' : 'bg-white/5 border-white/10 scale-75'}`} />
            ))}
          </div>
        </motion.button>

        <AnimatePresence>
          {isCharging && (
            <motion.div
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: [1.8, 0.4], opacity: [0.6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
              className={`absolute inset-[-60px] rounded-full border-[6px] pointer-events-none ${isPerfectZone ? 'border-yellow-400 shadow-[0_0_40px_rgba(251,191,36,0.6)]' : 'border-blue-500'}`}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="relative pb-10">
        <motion.div
          animate={{
            x: ballPos.x,
            y: ballPos.y,
            scale: ballPos.scale,
            rotate: ballPos.rotate,
            filter: `blur(${Array.isArray(ballPos.blur) ? ballPos.blur[0] : ballPos.blur}px)`,
          }}
          transition={(ballPos.transition as any) || { type: "spring", damping: 12 }}
          className="w-28 h-28 z-40 drop-shadow-[0_40px_40px_rgba(0,0,0,0.8)] relative"
        >
          <AnimatePresence>
            {(isPerfectZone || chargeIntensity > 0.8) && isCharging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [1.2, 1.8, 1.4] }}
                exit={{ opacity: 0 }}
                className="absolute inset-[-10px] z-[-1]"
              >
                <Flame className={`w-full h-full fill-current opacity-70 animate-pulse ${isPerfectZone ? 'text-yellow-400' : 'text-blue-400'}`} />
              </motion.div>
            )}
          </AnimatePresence>
          <img src="https://i.postimg.cc/Dz9Mn9ZJ/ball.png" className="w-full h-full object-contain" alt="Football" />
        </motion.div>
      </div>
    </div>
  </>
);

export default StrikerControls;
