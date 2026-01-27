
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Target, ShieldCheck, Star, Play, Zap } from 'lucide-react';
import { Team } from '../types';
import { TEAMS } from '../constants';

interface PairingScreenProps {
  team: Team;
  onStartMatch: () => void;
}

const PairingScreen: React.FC<PairingScreenProps> = ({ team, onStartMatch }) => {
  const [opponent, setOpponent] = useState<Team>(TEAMS[0]);
  const [venue] = useState(() => ['溫布利球場', '馬拉卡納球場', '諾坎普球場', '盧塞爾體育場'][Math.floor(Math.random() * 4)]);

  useEffect(() => {
    const others = TEAMS.filter(t => t.id !== team.id);
    setOpponent(others[Math.floor(Math.random() * others.length)]);
  }, [team]);

  return (
    <div className="relative h-full w-full bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* 動態背景層 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]"></div>
      
      {/* 背景裝飾光效 */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-40 bg-blue-600/10 blur-[100px] pointer-events-none"
      />
      
      {/* 標題 */}
      <div className="relative z-10 mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full mb-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
          <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">現場賽事預告</span>
        </motion.div>
        <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl">賽事前哨戰</h2>
      </div>

      {/* 對戰卡片容器 - 手機直屏優化佈局 */}
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        <div className="flex items-center justify-between relative px-2">
          {/* 玩家球隊 (左側) */}
          <motion.div 
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[44%] flex flex-col items-center"
          >
            <div className={`w-full aspect-[4/5] rounded-[2rem] bg-gradient-to-br ${team.gradient} border-2 border-white/20 p-4 flex flex-col justify-end shadow-2xl relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <img src={team.jerseyImage} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="text-3xl mb-1 drop-shadow-md">{team.flagEmoji}</div>
                <div className="text-lg font-black italic text-white uppercase leading-none truncate drop-shadow-lg">{team.nationality}</div>
                <div className="text-[9px] font-bold text-blue-100 mt-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {team.starPlayer}
                </div>
              </div>
            </div>
            <div className="mt-3 px-4 py-2 bg-blue-600 rounded-xl flex items-center gap-2 shadow-[0_8px_16px_rgba(37,99,235,0.4)] w-full justify-center">
              <Target className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-black italic uppercase tracking-wider text-white">前鋒</span>
            </div>
          </motion.div>

          {/* VS 圖標 - 全新樣式 */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: ["0 0 20px rgba(255,255,255,0.2)", "0 0 40px rgba(59,130,246,0.4)", "0 0 20px rgba(255,255,255,0.2)"]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center z-20 border-4 border-blue-900 shadow-2xl"
            >
              <span className="text-2xl font-black italic text-black tracking-tighter">VS</span>
            </motion.div>
            <div className="w-1 h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* 對手球隊 (右側) */}
          <motion.div 
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-[44%] flex flex-col items-center"
          >
            <div className={`w-full aspect-[4/5] rounded-[2rem] bg-gradient-to-br ${opponent.gradient} border-2 border-white/20 p-4 flex flex-col justify-end shadow-2xl relative overflow-hidden group`}>
              <div className="absolute inset-0 bg-black/30"></div>
              <img src={opponent.jerseyImage} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="text-3xl mb-1 drop-shadow-md text-right">{opponent.flagEmoji}</div>
                <div className="text-lg font-black italic text-white uppercase leading-none truncate text-right drop-shadow-lg">{opponent.nationality}</div>
                <div className="text-[9px] font-bold text-red-100 mt-2 flex items-center gap-1 justify-end">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  {opponent.starPlayer}
                </div>
              </div>
            </div>
            <div className="mt-3 px-4 py-2 bg-slate-800 rounded-xl flex items-center gap-2 shadow-[0_8px_16px_rgba(0,0,0,0.4)] w-full justify-center border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-black italic uppercase tracking-wider text-white">守門員</span>
            </div>
          </motion.div>
        </div>

        {/* 場地詳情 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col items-center shadow-2xl mx-2"
        >
          <div className="flex items-center gap-2 text-blue-400/60 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">比賽場地</span>
          </div>
          <div className="text-2xl font-black italic text-white uppercase tracking-tighter mb-4 drop-shadow-md">{venue}</div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="text-center border-r border-white/10">
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 opacity-70">濕度</div>
              <div className="text-xl font-black text-white tabular-nums">65%</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 opacity-70">溫度</div>
              <div className="text-xl font-black text-white tabular-nums">22°C</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 開始按鈕 */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 w-full max-w-md relative px-4"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-blue-500 blur-3xl -z-10 rounded-full"
        />

        <button 
          onClick={onStartMatch}
          className="w-full group relative h-16 bg-white text-black rounded-2xl font-black italic text-2xl uppercase tracking-tighter shadow-[0_20px_40px_rgba(59,130,246,0.3)] active:scale-95 hover:scale-[1.01] transition-all flex items-center justify-center overflow-hidden"
        >
          <motion.div 
            animate={{ left: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent skew-x-[-25deg] pointer-events-none"
          />

          <span className="relative z-10 flex items-center gap-3">
             <div className="bg-black rounded-full p-1.5 group-hover:scale-110 transition-transform">
               <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
             </div>
             比賽開始
          </span>

          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
           <Zap className="w-3 h-3 text-yellow-400" />
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">手機直屏優化模式</span>
           <Zap className="w-3 h-3 text-yellow-400" />
        </div>
      </motion.div>
    </div>
  );
};

export default PairingScreen;
