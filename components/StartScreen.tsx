
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ListOrdered, ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { TEAMS } from '../constants';
import { Team } from '../types';

interface StartScreenProps {
  onStart: (team: Team) => void;
  onShowLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowLeaderboard }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 偵測是否已經滑動，若滑動過則隱藏手勢引導
  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollLeft > 20) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-black overflow-hidden">
      {/* 競技場背景 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/m20zmy2V/qiu-chang02.png" 
          className="w-full h-full object-cover opacity-70 scale-105"
          alt="Stadium Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* 排行榜入口 */}
      <button 
        onClick={onShowLeaderboard}
        className="absolute top-6 right-6 z-40 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 active:scale-90 transition-transform flex items-center gap-2 shadow-2xl"
      >
        <ListOrdered className="w-5 h-5 text-yellow-400" />
        <span className="text-[10px] font-black italic tracking-widest text-white uppercase">排行榜</span>
      </button>

      {/* 導引文字 */}
      <div className="relative z-10 w-full pt-16 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-blue-600 text-white px-6 py-1 rounded-full text-[10px] font-black tracking-[0.4em] uppercase shadow-lg inline-block mb-3">
            2025 賽季
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            選擇你的球隊
          </h2>
        </motion.div>
      </div>

      {/* 球隊選擇區 */}
      <div className="mt-auto relative z-20 w-full pb-16 flex flex-col">
        <div className="flex items-center justify-between px-8 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
              選擇隊徽
            </span>
            <AnimatePresence>
              {!hasScrolled && (
                <motion.div
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: [0, 10, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex items-center gap-1"
                >
                  <Hand className="w-3 h-3 text-yellow-400 rotate-[-20deg]" />
                  <span className="text-[9px] font-bold text-yellow-400/80 animate-pulse uppercase">滑動</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Trophy className="w-4 h-4 text-yellow-500" />
        </div>

        {/* 列表外層容器：加入側邊漸層暗示更多內容 */}
        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/60 to-transparent z-30 pointer-events-none" />

          {/* 水平捲動核心 */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 px-12 pb-8 no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {TEAMS.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex-shrink-0 snap-center"
              >
                <button
                  onClick={() => onStart(team)}
                  className="group relative flex flex-col items-center"
                >
                  {/* 徽章容器 */}
                  <div className={`relative w-44 h-44 rounded-full p-1 bg-gradient-to-br ${team.gradient} shadow-[0_15px_50px_rgba(0,0,0,0.8)] group-active:scale-95 transition-transform overflow-hidden border-2 border-white/20`}>
                    {/* 背景裝飾 */}
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                      <img src={team.jerseyImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    
                    {/* 核心徽章 */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-7xl drop-shadow-2xl mb-1">{team.flagEmoji}</span>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">{team.nationality}</span>
                      </div>
                    </div>

                    {/* 掃光特效 */}
                    <motion.div 
                      animate={{ left: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none"
                    />
                  </div>

                  {/* 球隊資訊 */}
                  <div className="mt-5 text-center">
                    <div className="text-2xl font-black italic text-white uppercase tracking-tighter">{team.name}</div>
                    <div className="text-[10px] font-bold text-blue-300 flex items-center justify-center gap-1 mt-1">
                      <Zap className="w-3 h-3 fill-blue-300" />
                      {team.starPlayer}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
            {/* 列表末尾填充空間，讓最後一個項目能置中 */}
            <div className="flex-shrink-0 w-12" />
          </div>
          
          {/* 浮動箭頭指示器 */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 z-40 opacity-30 animate-pulse pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-40 opacity-30 animate-pulse pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* 進度圓點 */}
        <div className="flex justify-center mt-4">
           <div className="flex gap-2">
              {TEAMS.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
              ))}
           </div>
        </div>
        
        <p className="mt-8 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">爭奪 2025 金靴獎</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default StartScreen;
