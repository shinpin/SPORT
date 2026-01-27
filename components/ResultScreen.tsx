
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, RefreshCcw, Award, ChevronRight, ListOrdered, Target, Zap, ShieldCheck, Percent } from 'lucide-react';
import { Prize, GameStats } from '../types';
import { PRIZES } from '../constants';

interface ResultScreenProps {
  stats: GameStats;
  onRedeem: (prize: Prize) => void;
  onRestart: () => void;
  onShowLeaderboard: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRedeem, onRestart, onShowLeaderboard }) => {
  const [isOpened, setIsOpened] = useState(false);
  
  const getPrizeByScore = (s: number): Prize => {
    if (s >= 50) return PRIZES[0];
    if (s >= 30) return PRIZES[1];
    return PRIZES[2];
  };

  const prize = getPrizeByScore(stats.score);
  const accuracy = stats.totalShots > 0 ? Math.round((stats.goalsScored / stats.totalShots) * 100) : 0;

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-start py-12 px-6 bg-[#050b15] overflow-y-auto">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-full h-full bg-blue-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-full h-full bg-blue-600/10 blur-[150px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-sm bg-blue-950/40 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-br from-yellow-400 to-amber-600 p-5 rounded-[2rem] shadow-[0_10px_30px_rgba(234,179,8,0.3)]">
          <Award className="w-10 h-10 text-black" />
        </div>

        <h2 className="mt-10 text-3xl font-black italic text-white uppercase tracking-tighter">
          比賽結束
        </h2>
        
        {/* Main Score */}
        <div className="mt-8 flex flex-col items-center bg-black/40 py-6 rounded-3xl border border-white/5 shadow-inner">
          <span className="text-[10px] font-black tracking-[0.5em] text-blue-400 uppercase mb-2">最終得分</span>
          <div className="text-8xl font-black italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            {stats.score}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
             <div className="flex items-center gap-1.5 mb-1 opacity-50">
               <Zap className="w-3 h-3 text-yellow-400" />
               <span className="text-[9px] font-black uppercase tracking-widest">射門數</span>
             </div>
             <div className="text-xl font-black italic text-white">{stats.totalShots}</div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
             <div className="flex items-center gap-1.5 mb-1 opacity-50">
               <Target className="w-3 h-3 text-red-400" />
               <span className="text-[9px] font-black uppercase tracking-widest">進球數</span>
             </div>
             <div className="text-xl font-black italic text-white">{stats.goalsScored}</div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
             <div className="flex items-center gap-1.5 mb-1 opacity-50">
               <Percent className="w-3 h-3 text-green-400" />
               <span className="text-[9px] font-black uppercase tracking-widest">準確率</span>
             </div>
             <div className="text-xl font-black italic text-white">{accuracy}%</div>
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col items-center">
             <div className="flex items-center gap-1.5 mb-1 opacity-50">
               <ShieldCheck className="w-3 h-3 text-blue-400" />
               <span className="text-[9px] font-black uppercase tracking-widest">撲救數</span>
             </div>
             <div className="text-xl font-black italic text-white">{stats.savesMade}</div>
          </div>
        </div>

        {/* Prize Unlock Section */}
        <div className="mt-10 relative flex flex-col items-center justify-center min-h-[160px]">
          <AnimatePresence mode='wait'>
            {!isOpened ? (
              <motion.button
                key="gift-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpened(true)}
                className="group flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500 rounded-full blur-3xl"
                  ></motion.div>
                  <Gift className="w-20 h-20 text-blue-400 relative z-10 group-hover:scale-110 transition-transform drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
                </div>
                <span className="text-[10px] font-black italic tracking-[0.3em] text-blue-300 uppercase animate-pulse">
                  點擊解鎖獎勵
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="prize-reveal"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className={`w-full p-6 rounded-[2.5rem] mb-6 relative overflow-hidden border-2 ${
                  prize.type === 'gold' ? 'bg-gradient-to-br from-yellow-300 to-amber-600 text-black border-yellow-200' : 
                  prize.type === 'silver' ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-black border-gray-100' : 
                  'bg-gradient-to-br from-amber-700 to-orange-950 text-white border-amber-600'
                }`}>
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/30 blur-3xl rounded-full"></div>
                  <Sparkles className="w-8 h-8 mb-2 mx-auto opacity-60" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">
                    {prize.type === 'gold' ? '金獎' : prize.type === 'silver' ? '銀獎' : '銅獎'}
                  </div>
                  <div className="text-2xl font-black italic tracking-tighter uppercase leading-tight">{prize.name}</div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onRedeem(prize)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 px-8 rounded-2xl font-black italic uppercase flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(37,99,235,0.4)] transition-all"
                >
                  立即領取
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-8 flex gap-4 w-full max-w-sm">
        <motion.button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white/60 hover:text-white transition-all uppercase font-black italic tracking-widest text-[10px]"
        >
          <RefreshCcw className="w-4 h-4" />
          再玩一次
        </motion.button>
        <motion.button
          onClick={onShowLeaderboard}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-500/30 px-6 py-4 rounded-2xl text-blue-400 hover:text-white transition-all uppercase font-black italic tracking-widest text-[10px]"
        >
          <ListOrdered className="w-4 h-4" />
          排行榜
        </motion.button>
      </div>
    </div>
  );
};

export default ResultScreen;
