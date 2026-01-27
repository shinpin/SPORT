
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, ShieldCheck, Swords, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, Circle, Star, Trophy } from 'lucide-react';
import { Team, GameStats } from '../types';
import { GOAL_POSITIONS } from '../constants';

interface GameScreenProps {
  userId: string;
  team: Team;
  onGameEnd: (stats: GameStats) => void;
  autoTest?: boolean;
}

type GameRole = 'striker' | 'goalie';

const GameScreen: React.FC<GameScreenProps> = ({ team, onGameEnd, autoTest = false }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45); 
  const [gameRole, setGameRole] = useState<GameRole>('striker');
  const [attemptsInPhase, setAttemptsInPhase] = useState(0);
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [goalsScored, setGoalsScored] = useState(0);
  const [savesMade, setSavesMade] = useState(0);

  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [kickResult, setKickResult] = useState<'success' | 'fail' | 'perfect' | 'saved' | null>(null);
  const [ballPos, setBallPos] = useState({ x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 });
  const [ballShadowPos, setBallShadowPos] = useState({ x: 0, y: 0, scale: 1 });
  const [goalkeeperState, setGoalkeeperState] = useState({ x: 0, y: 0, rotate: 0, scale: 1, isSaving: false });
  const [isShaking, setIsShaking] = useState(false);
  const [showRoleSwap, setShowRoleSwap] = useState(false);
  const [activeGrid, setActiveGrid] = useState<number | null>(null);
  const [netRipple, setNetRipple] = useState(false);
  
  const [strikerAnim, setStrikerAnim] = useState<'idle' | 'prepare' | 'kick'>('idle');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const powerDirectionRef = useRef(1);
  const isChargingRef = useRef(false); // 使用 Ref 追蹤狀態，解決異步讀取問題

  // AI 自動測試邏輯
  useEffect(() => {
    if (autoTest && gameStarted && !isKicking && !showRoleSwap) {
      const aiTimer = setTimeout(() => {
        if (gameRole === 'striker') {
          handleStartCharging();
          const targetPower = 88 + Math.random() * 8;
          const checkInterval = setInterval(() => {
             setPower(current => {
                if (current >= targetPower) {
                    clearInterval(checkInterval);
                    handlePlayerShoot();
                }
                return current;
             });
          }, 30);
        } else {
          const randomIdx = Math.floor(Math.random() * 9);
          handlePlayerDefend(randomIdx);
        }
      }, 1500);
      return () => clearTimeout(aiTimer);
    }
  }, [autoTest, gameStarted, isKicking, gameRole, showRoleSwap]);

  const endGame = () => {
    onGameEnd({
      score,
      totalShots,
      goalsScored,
      savesMade
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (!gameStarted || showRoleSwap) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, score, totalShots, goalsScored, savesMade, showRoleSwap]);

  useEffect(() => {
    if (isCharging && gameRole === 'striker') {
      setStrikerAnim('prepare');
      intervalRef.current = setInterval(() => {
        setPower((prev) => {
          let next = prev + (6 * powerDirectionRef.current);
          if (next >= 100) { next = 100; powerDirectionRef.current = -1; }
          else if (next <= 0) { next = 0; powerDirectionRef.current = 1; }
          return next;
        });
      }, 16);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isCharging, gameRole]);

  const handleStartCharging = () => {
    if (isKicking || !gameStarted || gameRole !== 'striker' || showRoleSwap) return;
    setIsCharging(true);
    isChargingRef.current = true;
  };

  const swapRole = () => {
    if (gameRole === 'striker') {
      setShowRoleSwap(true);
      setTimeout(() => {
        setGameRole('goalie');
        setAttemptsInPhase(0);
        setShowRoleSwap(false);
        setStrikerAnim('idle');
        setBallPos({ x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 });
        setBallShadowPos({ x: 0, y: 0, scale: 1 });
      }, 2500);
    } else {
      endGame();
    }
  };

  const handlePlayerShoot = () => {
    // 即使 state 尚未更新，也透過 Ref 確保互動能繼續
    if (!isChargingRef.current && !isCharging) return;
    setIsCharging(false);
    isChargingRef.current = false;
    setIsKicking(true);
    setStrikerAnim('kick');
    setTotalShots(prev => prev + 1);

    const targetIdx = Math.floor(Math.random() * GOAL_POSITIONS.length);
    const target = GOAL_POSITIONS[targetIdx];
    
    const goalieChoices = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const goalieTargetIdx = Math.random() < 0.25 ? targetIdx : goalieChoices[Math.floor(Math.random() * 9)];
    const goalieTarget = GOAL_POSITIONS[goalieTargetIdx];

    const ballTargetX = (target.x - 50) * 4.5;
    const ballTargetY = -550 - (target.y * 2.5);
    
    const goalieTargetX = (goalieTarget.x - 50) * 3;
    const goalieTargetY = (goalieTarget.y - 40) * 1.5;

    // 定義 Perfect 區域：88-95
    const isPerfect = power >= 88 && power <= 95;
    const isBlocked = goalieTargetIdx === targetIdx && !isPerfect;

    setTimeout(() => {
      setBallPos({ x: ballTargetX, y: ballTargetY, scale: 0.3, rotate: 1440, blur: 12, opacity: 1 });
      setBallShadowPos({ x: ballTargetX * 0.5, y: -50, scale: 0.5 });
      
      setTimeout(() => {
        setGoalkeeperState({ 
          x: goalieTargetX, 
          y: goalieTargetY, 
          rotate: goalieTargetX > 0 ? 60 : goalieTargetX < 0 ? -60 : 0,
          scale: 1.2,
          isSaving: isBlocked
        });
      }, 50);

      setTimeout(() => {
        const result = isBlocked ? 'saved' : (isPerfect ? 'perfect' : 'success');
        setKickResult(result);
        setBallPos(prev => ({ ...prev, blur: 0 }));
        
        // Fix: result !== 'fail' is impossible here as result is restricted to 'saved' | 'perfect' | 'success'
        if (result !== 'saved') {
          setGoalsScored(prev => prev + 1);
          setNetRipple(true);
          setIsShaking(true);
          setTimeout(() => setNetRipple(false), 400);
          setTimeout(() => setIsShaking(false), 300);
          setScore(prev => prev + (result === 'perfect' ? 25 : 10));
          if (navigator.vibrate) navigator.vibrate(result === 'perfect' ? [100, 50, 100] : 60);
        } else if (result === 'saved') {
          setBallPos({ x: ballTargetX + (Math.random() * 100 - 50), y: ballTargetY + 200, scale: 0.8, rotate: 360, blur: 0, opacity: 1 });
          if (navigator.vibrate) navigator.vibrate(40);
        }

        setTimeout(() => {
          setKickResult(null);
          setBallPos({ x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 });
          setBallShadowPos({ x: 0, y: 0, scale: 1 });
          setGoalkeeperState({ x: 0, y: 0, rotate: 0, scale: 1, isSaving: false });
          setIsKicking(false);
          setPower(0);
          setStrikerAnim('idle');
          
          const nextAttempts = attemptsInPhase + 1;
          setAttemptsInPhase(nextAttempts);
          if (nextAttempts >= 3) swapRole();
        }, 1500);
      }, 500);
    }, 150);
  };

  const handlePlayerDefend = (goalIdx: number) => {
    if (isKicking || !gameStarted || gameRole !== 'goalie' || showRoleSwap) return;
    setIsKicking(true);
    setActiveGrid(goalIdx);

    const target = GOAL_POSITIONS[goalIdx];
    const playerGoalieX = (target.x - 50) * 3.5;
    const playerGoalieY = (target.y - 40) * 1.8;

    setGoalkeeperState({ 
      x: playerGoalieX, 
      y: playerGoalieY, 
      rotate: playerGoalieX > 0 ? 45 : playerGoalieX < 0 ? -45 : 0,
      scale: 1.3,
      isSaving: true
    });

    const aiTargetIdx = Math.floor(Math.random() * GOAL_POSITIONS.length);
    const aiTarget = GOAL_POSITIONS[aiTargetIdx];
    const ballTargetX = (aiTarget.x - 50) * 4.5;
    const ballTargetY = -550 - (aiTarget.y * 2.5);

    setTimeout(() => {
      setBallPos({ x: ballTargetX, y: ballTargetY, scale: 0.4, rotate: 720, blur: 8, opacity: 1 });
      setBallShadowPos({ x: ballTargetX * 0.5, y: -50, scale: 0.6 });
      
      setTimeout(() => {
        const isSaved = aiTargetIdx === goalIdx;
        setKickResult(isSaved ? 'saved' : 'fail');
        setBallPos(prev => ({ ...prev, blur: 0 }));
        
        if (isSaved) {
          setSavesMade(prev => prev + 1);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 200);
          setScore(prev => prev + 20);
          if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
          setBallPos({ x: ballTargetX, y: ballTargetY + 150, scale: 0.8, rotate: 180, blur: 0, opacity: 1 });
        } else {
          setNetRipple(true);
          setTimeout(() => setNetRipple(false), 400);
          if (navigator.vibrate) navigator.vibrate(20);
        }

        setTimeout(() => {
          setKickResult(null);
          setBallPos({ x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 });
          setBallShadowPos({ x: 0, y: 0, scale: 1 });
          setGoalkeeperState({ x: 0, y: 0, rotate: 0, scale: 1, isSaving: false });
          setIsKicking(false);
          setActiveGrid(null);
          
          const nextAttempts = attemptsInPhase + 1;
          setAttemptsInPhase(nextAttempts);
          if (nextAttempts >= 3) endGame();
        }, 1500);
      }, 400);
    }, 150);
  };

  const getDirectionIcon = (id: number) => {
    switch(id) {
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
  };

  return (
    <motion.div 
      animate={{ x: isShaking ? [-12, 12, -8, 8, 0] : 0, y: isShaking ? [-12, 12, -8, 8, 0] : 0 }}
      className="relative h-full w-full flex flex-col bg-[#050b15] overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/m20zmy2V/qiu-chang02.png" 
          className="w-full h-full object-cover opacity-50"
          alt="Stadium Arena"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b15]/60 via-transparent to-[#050b15]"></div>
      </div>

      <AnimatePresence>
        {showRoleSwap && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
             <motion.div 
               initial={{ x: '-150%', skewX: -45 }}
               animate={{ x: '150%' }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className={`absolute inset-0 bg-gradient-to-r ${team.gradient} opacity-90 z-[101]`}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1.2 }}
               transition={{ delay: 0.3 }}
               className="relative z-[102] flex flex-col items-center"
             >
                <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(59,130,246,0.5)]">
                  <ShieldCheck className="w-24 h-24 text-white mb-6 animate-pulse" />
                  <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter mb-2 drop-shadow-2xl text-center">攻守互換!</h2>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-30 pt-10 px-6 w-full flex justify-between items-start">
        <div className="flex flex-col bg-blue-950/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl w-24">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">分數</span>
          <div className="text-3xl font-black italic tabular-nums text-white">{score}</div>
        </div>
        <div className="flex flex-col items-center bg-blue-950/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
          <div className="flex items-center gap-1 text-blue-400 mb-1">
            <Timer className="w-3 h-3 animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest">比賽時間</span>
          </div>
          <span className="text-2xl font-black italic tracking-widest tabular-nums text-yellow-400">{timeLeft}s</span>
        </div>
        <div className="flex flex-col bg-blue-950/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl items-end w-24">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">身份</span>
          <div className="text-lg font-black italic text-white uppercase truncate flex items-center gap-1">
            {gameRole === 'striker' ? '前鋒' : '守門員'}
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center pt-10 perspective-1000">
        <div className={`relative w-full max-w-[340px] aspect-[1.6/1] border-[14px] border-white rounded-t-xl shadow-[0_-20px_100px_rgba(255,255,255,0.1)] bg-black/60 overflow-hidden transition-colors duration-500 ${netRipple ? 'bg-white/20' : ''}`}>
          <div className="absolute inset-0 bg-goal-net opacity-20"></div>
          <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 gap-2 p-3">
            {GOAL_POSITIONS.map((pos) => (
              <div key={pos.id} className={`w-full h-full border border-white/5 rounded-lg transition-all duration-300 ${activeGrid === pos.id ? 'bg-blue-500/30 border-blue-400' : ''}`}></div>
            ))}
          </div>
          <motion.div 
            animate={{ x: goalkeeperState.x, y: goalkeeperState.y, rotate: goalkeeperState.rotate, scale: goalkeeperState.scale }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-36 flex flex-col items-center z-20"
          >
            <div className={`w-14 h-14 rounded-full shadow-lg border-2 border-black/20 ${gameRole === 'goalie' ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
            <div className={`w-20 h-28 rounded-t-[2.5rem] mt-1 relative overflow-hidden ${gameRole === 'goalie' ? 'bg-blue-600' : 'bg-yellow-500'}`}></div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <AnimatePresence>
            {kickResult && (
              <motion.div initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 1, scale: 1.4 }} exit={{ opacity: 0, scale: 2 }} className="flex flex-col items-center gap-2">
                <span className={`font-black italic tracking-tighter uppercase leading-none text-center drop-shadow-2xl ${kickResult === 'perfect' ? 'text-yellow-400' : kickResult === 'saved' ? 'text-blue-400' : 'text-green-500'}`}>
                  {kickResult === 'perfect' ? '完美進球!' : kickResult === 'saved' ? '被擋下了!' : '成功得分!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 p-4 w-full flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        {gameRole === 'striker' && (
          <motion.div 
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1, scale: isCharging ? 0.95 : 1 }}
            className="absolute bottom-10 left-0 z-[25] pointer-events-none flex flex-col items-center"
          >
            <div className="mb-2 bg-blue-600/80 backdrop-blur-md px-6 py-1.5 rounded-full border-2 border-white/20 translate-x-12">
               <span className="text-[12px] font-black italic text-white uppercase tracking-widest">{team.starPlayer}</span>
            </div>
            <div className="relative w-48 h-64 rotate-[15deg]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#eec39a] rounded-full shadow-lg border-2 border-black/10 z-10"></div>
               <div className={`absolute top-14 left-1/2 -translate-x-1/2 w-32 h-44 bg-gradient-to-b ${team.gradient} rounded-t-[3.5rem] rounded-b-[1.5rem] shadow-2xl flex items-center justify-center`}>
                  <div className="text-7xl font-black italic text-white/10 select-none">10</div>
               </div>
            </div>
          </motion.div>
        )}

        {gameRole === 'striker' ? (
          <>
            <div className="w-full max-w-xs bg-blue-950/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 mb-2 relative z-40">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">射門力道</span>
              </div>
              <div className="relative h-6 w-full bg-white/5 rounded-full p-1 border border-white/10 overflow-hidden">
                <motion.div animate={{ width: `${power}%` }} className={`h-full rounded-full ${power >= 88 && power <= 95 ? 'bg-yellow-400' : 'bg-blue-500'}`} />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 relative w-full">
              <div className="relative z-40">
                <motion.button
                  onMouseDown={handleStartCharging}
                  onMouseUp={handlePlayerShoot}
                  onTouchStart={handleStartCharging}
                  onTouchEnd={handlePlayerShoot}
                  disabled={isKicking || !gameStarted}
                  className={`relative w-32 h-32 rounded-full border-[8px] flex flex-col items-center justify-center shadow-2xl transition-all ${isCharging ? 'border-yellow-400 bg-yellow-400/30' : 'border-white/10 bg-white/5'}`}
                >
                  <Zap className={`w-10 h-10 mb-1 ${isCharging ? 'text-yellow-400 animate-pulse' : 'text-blue-400'}`} />
                  <span className="text-[12px] font-black italic text-white uppercase tracking-tighter">射門</span>
                  <div className="absolute -bottom-2 flex gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border border-white/20">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-full ${i < (3 - attemptsInPhase) ? 'bg-white' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </motion.button>
              </div>
              <div className="relative">
                 <motion.div animate={{ x: ballPos.x, y: ballPos.y, scale: ballPos.scale, rotate: ballPos.rotate, filter: `blur(${ballPos.blur}px)` }} className="w-24 h-24 z-40">
                  <img src="https://i.postimg.cc/Dz9Mn9ZJ/ball.png" className="w-full h-full object-contain" alt="Football" />
                </motion.div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-6 pb-4">
            <div className="text-white/50 font-black italic uppercase tracking-widest text-sm animate-pulse flex flex-col items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
              點擊球門方格撲救!
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                <button key={id} onClick={() => handlePlayerDefend(id)} disabled={isKicking} className="w-14 h-14 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 active:bg-blue-600 active:text-white transition-all">
                  {getDirectionIcon(id)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bg-goal-net { background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 14px 14px; }
        .perspective-1000 { perspective: 1000px; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { rotate: 0deg; } to { rotate: 360deg; } }
      `}</style>
    </motion.div>
  );
};

export default GameScreen;
