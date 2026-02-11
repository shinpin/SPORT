
import React from 'react';
import { Timer } from 'lucide-react';
import { GameRole } from '../../types';

interface GameHUDProps {
  score: number;
  timeLeft: number;
  gameRole: GameRole;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, timeLeft, gameRole }) => (
  <div className="relative z-30 pt-12 px-6 w-full flex justify-between items-start">
    <div className="flex flex-col bg-blue-950/80 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl w-24 shadow-2xl">
      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">分數</span>
      <div className="text-3xl font-black italic tabular-nums text-white leading-none">{score}</div>
    </div>
    <div className="flex flex-col items-center bg-blue-950/80 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-1.5 text-blue-400 mb-1">
        <Timer className="w-3.5 h-3.5 animate-spin-slow" />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">比賽時間</span>
      </div>
      <span className="text-2xl font-black italic tracking-widest tabular-nums text-yellow-400 leading-none">{timeLeft}s</span>
    </div>
    <div className="flex flex-col bg-blue-950/80 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl items-end w-24 shadow-2xl">
      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">身份</span>
      <div className="text-lg font-black italic text-white uppercase truncate flex items-center gap-1 leading-none">
        {gameRole === 'striker' ? '前鋒' : '守門員'}
      </div>
    </div>
  </div>
);

export default GameHUD;
