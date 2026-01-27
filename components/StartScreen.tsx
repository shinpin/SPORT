
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ListOrdered, ChevronLeft, ChevronRight, Hand, Star, Maximize2, Minimize2, Smartphone, RotateCcw } from 'lucide-react';
import { TEAMS } from '../constants';
import { Team } from '../types';

interface StartScreenProps {
  onStart: (team: Team) => void;
  onShowLeaderboard: () => void;
  onOpenBackstage: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowLeaderboard, onOpenBackstage }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastClickTime = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleVersionClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current > 2000) {
      setClickCount(1);
    } else {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount >= 3) {
        onOpenBackstage();
        setClickCount(0);
      }
    }
    lastClickTime.current = now;
  };

  const handleScroll = () => {
    if (scrollRef.current && scrollRef.current.scrollLeft > 20) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-black overflow-y-auto no-scrollbar">
      {/* 頂部快捷工具欄 */}
      <div className="absolute top-0 left-0 right-0 z-[60] flex flex-col items-center pt-4 pointer-events-none">
        <div className="flex items-center gap-6 px-6 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-auto">
          <Smartphone className="w-4 h-4 text-white/40" />
          <RotateCcw className="w-4 h-4 text-white/40" />
          <Maximize2 className="w-4 h-4 text-white/40" />
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleFullscreen}
          className="mt-4 px-8 py-2.5 bg-white text-black rounded-full font-bold shadow-2xl flex items-center gap-2 pointer-events-auto active:bg-gray-200 transition-colors"
        >
          <span className="text-sm tracking-tight">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </motion.button>
      </div>

      <div 
        onClick={handleVersionClick}
        className="absolute top-2 left-4 z-[100] text-[10px] font-mono text-white/30 p-2 cursor-pointer active:text-white/60 select-none"
      >
        footballdemo-v01.0126
      </div>

      <div className="absolute inset-0 z-0 h-[100vh] fixed">
        <img 
          src="https://i.postimg.cc/m20zmy2V/qiu-chang02.png" 
          className="w-full h-full object-cover opacity-70 scale-105"
          alt="Stadium Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      <button 
        onClick={onShowLeaderboard}
        className="absolute top-6 right-6 z-40 p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 active:scale-90 transition-transform flex items-center gap-2 shadow-2xl"
      >
        <ListOrdered className="w-5 h-5 text-yellow-400" />
        <span className="text-[10px] font-black italic tracking-widest text-white uppercase">排行榜</span>
      </button>

      {/* 內容區塊 - 移除品牌元素 */}
      <div className="relative z-10 w-full pt-32 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-[90%] max-w-sm bg-slate-50/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl mb-12 border border-white/50"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            <h3 className="text-3xl font-black italic tracking-widest text-emerald-700 uppercase">遊戲規則</h3>
          </div>

          <div className="space-y-5">
            {[
              { id: 1, text: "選擇你的球隊" },
              { id: 2, text: "點擊方向射門" },
              { id: 3, text: "共有3次機會" },
              { id: 4, text: "獲得最高分數！" }
            ].map((rule) => (
              <div key={rule.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md">
                  {rule.id}
                </div>
                <span className="text-lg font-bold text-slate-700 tracking-tight">{rule.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-20 w-full pb-16 flex flex-col">
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
          <Zap className="w-4 h-4 text-yellow-500" />
        </div>

        <div className="relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent z-30 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/60 to-transparent z-30 pointer-events-none" />

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
                transition={{ delay: idx * 0.05 + 0.4 }}
                className="flex-shrink-0 snap-center"
              >
                <button
                  onClick={() => onStart(team)}
                  className="group relative flex flex-col items-center"
                >
                  <div className={`relative w-44 h-44 rounded-full p-1 bg-gradient-to-br ${team.gradient} shadow-[0_15px_50px_rgba(0,0,0,0.8)] group-active:scale-95 transition-transform overflow-hidden border-2 border-white/20`}>
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                      <img src={team.jerseyImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-7xl drop-shadow-2xl mb-1">{team.flagEmoji}</span>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">{team.nationality}</span>
                      </div>
                    </div>

                    <motion.div 
                      animate={{ left: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] pointer-events-none"
                    />
                  </div>

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
            <div className="flex-shrink-0 w-12" />
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-2 z-40 opacity-30 animate-pulse pointer-events-none">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-40 opacity-30 animate-pulse pointer-events-none">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </div>
        
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StartScreen;
