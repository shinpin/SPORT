
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star } from 'lucide-react';
import { MOCK_LEADERBOARD, TEAMS } from '../constants';

interface LeaderboardScreenProps {
  onBack: () => void;
  currentUser: { id: string; score: number; teamId: string };
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack, currentUser }) => {
  const displayData = [...MOCK_LEADERBOARD];
  if (currentUser.score > 0) {
    const userInList = displayData.find(d => d.id === currentUser.id);
    if (!userInList) {
      displayData.push({
        id: currentUser.id,
        name: '你',
        goals: currentUser.score,
        matches: 1,
        teamId: currentUser.teamId,
        avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=200&h=200&fit=crop'
      });
    }
  }
  
  const sortedData = displayData.sort((a, b) => b.goals - a.goals);

  return (
    <div className="h-full w-full bg-[#0b1527] overflow-y-auto pb-10">
      {/* 頂部標題 */}
      <div className="relative h-48 w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-600 to-[#0b1527]">
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-full active:scale-90 transition-transform z-20"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-2"
          >
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/80">2025/26 賽季</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            超級挑戰賽
          </h1>
          <p className="text-[12px] font-bold text-blue-200 uppercase tracking-widest mt-1">射手榜</p>
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/10 blur-3xl rounded-full"></div>
      </div>

      <div className="px-4 -mt-8 space-y-4 max-w-md mx-auto relative z-20">
        {sortedData.map((entry, idx) => {
          const team = TEAMS.find(t => t.id === entry.teamId);
          const isCurrentUser = entry.id === currentUser.id;
          
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative h-28 w-full rounded-2xl overflow-hidden border shadow-xl flex ${
                isCurrentUser 
                ? 'bg-gradient-to-r from-blue-600/80 to-blue-900/80 border-blue-400/50 scale-[1.02]' 
                : 'bg-gradient-to-r from-blue-500/40 to-blue-950/60 border-white/10'
              }`}
            >
              {/* 左側垂直姓名條 */}
              <div className={`w-8 h-full flex items-center justify-center flex-shrink-0 ${team?.color || 'bg-gray-600'}`}>
                <span className="text-[10px] font-black text-white uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                  {entry.name}
                </span>
              </div>

              {/* 球員頭像 */}
              <div className="relative w-28 h-full flex-shrink-0 overflow-hidden">
                 <img src={entry.avatar} className="w-full h-full object-cover grayscale-[30%]" alt={entry.name} />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b1527]/40"></div>
                 {idx === 0 && (
                   <div className="absolute top-2 left-2 p-1 bg-yellow-400 rounded-lg shadow-lg">
                      <Trophy className="w-3 h-3 text-black" />
                   </div>
                 )}
              </div>

              {/* 中間數據 */}
              <div className="flex-1 flex flex-col items-center justify-center gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic text-white drop-shadow-md">{entry.goals}</span>
                  <span className="text-[10px] font-black text-white/60 uppercase">進球數</span>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/5">
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-tighter">{entry.matches} 場比賽</span>
                </div>
              </div>

              {/* 右側球隊 Logo 區 */}
              <div className="w-20 h-full flex items-center justify-center bg-black/10 backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-full bg-white shadow-inner flex items-center justify-center p-1 border-2 ${
                  entry.teamId === 'red' ? 'border-red-500' : entry.teamId === 'blue' ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${team?.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-[8px] font-black`}>
                    {team?.name.substring(0, 1)}
                  </div>
                </div>
              </div>

              {/* 當前用戶標記 */}
              {isCurrentUser && (
                <div className="absolute top-0 right-0 p-1">
                   <div className="bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-tighter">你的分數</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 頁尾裝飾 */}
      <div className="mt-12 text-center px-10">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">超級挑戰賽官方排行榜</p>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
