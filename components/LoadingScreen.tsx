
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Trophy, Star } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* 背景圖片 */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/pdtQsR1c/mainpage.png" 
          className="w-full h-full object-cover opacity-80"
          alt="Loading Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* 載入內容 */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center mt-auto pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10 text-center"
        >
          {/* 從 StartScreen 移過來的品牌元素 */}
          <div className="mb-4">
            <Trophy className="w-16 h-16 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          </div>
          
          <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-4 leading-none">
            踢球PK大挑戰
          </h1>

          <div className="flex gap-2">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse delay-75" />
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse delay-150" />
          </div>
        </motion.div>

        <div className="w-full h-32 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isReady ? (
              <motion.div 
                key="loading-bar"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 mb-4">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between w-full px-1">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
                    球場準備中...
                  </span>
                  <span className="text-[10px] font-black text-white italic tabular-nums">
                    {progress}%
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="enter-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
                className="group relative w-full h-16 bg-white text-black rounded-2xl font-black italic text-xl uppercase flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.3)] overflow-hidden"
              >
                <motion.div 
                  animate={{ left: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-blue-200/40 to-transparent skew-x-[-25deg] pointer-events-none"
                />
                
                <div className="bg-black rounded-full p-1.5 group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
                </div>
                進入球場
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center gap-2 opacity-30">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">
            {isReady ? '系統就緒' : '載入資源中'}
          </span>
          <Zap className="w-3 h-3 text-yellow-400" />
        </div>
      </div>

      <motion.div 
        animate={{ left: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] pointer-events-none"
      />
    </div>
  );
};

export default LoadingScreen;
