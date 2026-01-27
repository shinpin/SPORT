
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, ShieldCheck, Swords, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, Circle, Star, Trophy, Flame, Sparkles } from 'lucide-react';
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
  
  const [ballPos, setBallPos] = useState<any>({ x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 });
  const [ballShadowPos, setBallShadowPos] = useState({ x: 0, y: 0, scale: 1 });
  const [goalkeeperState, setGoalkeeperState] = useState({ x: 0, y: 0, rotate: 0, scale: 1, isSaving: false });
  const [isShaking, setIsShaking] = useState(false);
  const [showRoleSwap, setShowRoleSwap] = useState(false);
  const [activeGrid, setActiveGrid] = useState<number | null>(null);
  const [netRipple, setNetRipple] = useState(false);
  
  const [strikerAnim, setStrikerAnim] = useState<'idle' | 'prepare' | 'kick' | 'followthrough'>('idle');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const powerDirectionRef = useRef(1);
  const isChargingRef = useRef(false);

  // Derived state for visual feedback
  const isPerfectZone = useMemo(() => power >= 88 && power <= 95, [power]);
  const chargeIntensity = useMemo(() => power / 100, [power]);

  // AI Auto-test logic
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
          }, 20);
        } else {
          const randomIdx = Math.floor(Math.random() * 9);
          handlePlayerDefend(randomIdx);
        }
      }, 1200);
      return () => clearTimeout(aiTimer);
    }
  }, [autoTest, gameStarted, isKicking, gameRole, showRoleSwap]);

  const endGame = () => {
    onGameEnd({ score, totalShots, goalsScored, savesMade });
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
          const speedMultiplier = prev > 70 ? 1.8 : 1.2;
          let next = prev + (5 * powerDirectionRef.current * speedMultiplier);
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
    if (navigator.vibrate) navigator.vibrate(10);
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
    if (!isChargingRef.current && !isCharging) return;
    const finalPower = power;
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

    // Strength settings
    const isPerfect = finalPower >= 88 && finalPower <= 95;
    const isPowerful = finalPower > 90;
    const isWeak = finalPower < 40;
    const isBlocked = goalieTargetIdx === targetIdx && !isPerfect;

    const flightDuration = isPerfect ? 0.3 : isPowerful ? 0.35 : isWeak ? 0.75 : 0.5;
    const peakBlur = isPerfect ? 40 : isPowerful ? 25 : isWeak ? 2 : 12;
    const arcHeight = isPerfect ? 20 : isPowerful ? 40 : isWeak ? 140 : 90;

    setTimeout(() => {
      setStrikerAnim('followthrough');
      
      setBallPos({ 
        x: [0, ballTargetX * 0.4, ballTargetX], 
        y: [0, ballTargetY - arcHeight, ballTargetY], 
        scale: [1, 0.6, 0.3], 
        rotate: [0, 1080, 2160], 
        blur: [0, peakBlur, peakBlur * 0.5], 
        opacity: 1,
        transition: { duration: flightDuration, ease: isPerfect ? "circIn" : "easeOut" }
      });

      setBallShadowPos({ x: ballTargetX * 0.5, y: -50, scale: 0.5 });
      
      setTimeout(() => {
        setGoalkeeperState({ 
          x: goalieTargetX, 
          y: goalieTargetY, 
          rotate: goalieTargetX > 0 ? 60 : goalieTargetX < 0 ? -60 : 0,
          scale: 1.2,
          isSaving: isBlocked
        });
      }, 10);

      setTimeout(() => {
        const result = isBlocked ? 'saved' : (isPerfect ? 'perfect' : 'success');
        setKickResult(result);
        
        if (result !== 'saved') {
          setGoalsScored(prev => prev + 1);
          setNetRipple(true);
          setIsShaking(true);
          
          setTimeout(() => setNetRipple(false), 400);
          setTimeout(() => setIsShaking(false), isPerfect ? 400 : 250);
          setScore(prev => prev + (result === 'perfect' ? 25 : 10));
          if (navigator.vibrate) navigator.vibrate(result === 'perfect' ? [200, 50, 200] : 80);
        } else if (result === 'saved') {
          setBallPos({ 
            x: ballTargetX + (Math.random() * 160 - 80), 
            y: ballTargetY + 200, 
            scale: 0.7, 
            rotate: 2400, 
            blur: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 120 }
          });
          if (navigator.vibrate) navigator.vibrate(60);
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
      }, flightDuration * 1000);
    }, 60);
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
      setBallPos({ 
        x: [0, ballTargetX * 0.4, ballTargetX], 
        y: [0, ballTargetY - 100, ballTargetY], 
        scale: [1, 0.6, 0.3], 
        rotate: [0, 720, 1440], 
        blur: [0, 8, 4], 
        opacity: 1,
        transition: { duration: 0.5 }
      });
      setBallShadowPos({ x: ballTargetX * 0.5, y: -50, scale: 0.6 });
      
      setTimeout(() => {
        const isSaved = aiTargetIdx === goalIdx;
        setKickResult(isSaved ? 'saved' : 'fail');
        
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
      }, 450);
    }, 120);
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
      animate={{ 
        x: isShaking ? [-10, 10, -8, 8, 0] : 0, 
        y: isShaking ? [-10, 10, -8, 8, 0] : 0 
      }}
      className="relative h-full w-full flex flex-col bg-[#050b15] overflow-hidden"
    >
      {/* Dynamic Stadium Lights */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.postimg.cc/m20zmy2V/qiu-chang02.png" 
          className="w-full h-full object-cover opacity-60"
          alt="Stadium Arena"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050b15]/70 via-transparent to-[#050b15]"></div>
        
        {/* Animated Light Beams */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-32 h-full bg-blue-400/20 blur-[100px] skew-x-[-30deg]"
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute top-0 right-1/4 w-40 h-full bg-blue-400/10 blur-[120px] skew-x-[30deg]"
        />
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
               transition={{ duration: 1.2, ease: "easeInOut" }}
               className={`absolute inset-0 bg-gradient-to-r ${team.gradient} opacity-90 z-[101] shadow-[0_0_100px_white]`}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.5 }}
               animate={{ opacity: 1, scale: 1.2 }}
               transition={{ delay: 0.3 }}
               className="relative z-[102] flex flex-col items-center"
             >
                <div className="bg-white/10 backdrop-blur-3xl p-10 rounded-[4rem] border border-white/20 shadow-[0_0_120px_rgba(255,255,255,0.4)]">
                  <ShieldCheck className="w-28 h-28 text-white mb-6 animate-bounce" />
                  <h2 className="text-7xl font-black italic text-white uppercase tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] text-center">攻守互換!</h2>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      <div className="relative flex-1 flex flex-col items-center justify-center pt-10 perspective-1000">
        <div className={`relative w-full max-w-[340px] aspect-[1.6/1] border-[16px] border-white rounded-t-2xl shadow-[0_-20px_120px_rgba(255,255,255,0.2)] bg-black/70 overflow-hidden transition-colors duration-500 ${netRipple ? 'bg-white/25' : ''}`}>
          <div className="absolute inset-0 bg-goal-net opacity-20"></div>
          <div className="absolute inset-0 z-10 grid grid-cols-3 grid-rows-3 gap-2 p-3">
            {GOAL_POSITIONS.map((pos) => (
              <div key={pos.id} className={`w-full h-full border border-white/5 rounded-xl transition-all duration-300 ${activeGrid === pos.id ? 'bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : ''}`}></div>
            ))}
          </div>
          <motion.div 
            animate={{ x: goalkeeperState.x, y: goalkeeperState.y, rotate: goalkeeperState.rotate, scale: goalkeeperState.scale }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-36 flex flex-col items-center z-20"
          >
            <div className={`w-15 h-15 rounded-full shadow-2xl border-4 border-black/20 ${gameRole === 'goalie' ? 'bg-blue-400' : 'bg-yellow-400'}`}></div>
            <div className={`w-22 h-30 rounded-t-[3rem] mt-1 relative overflow-hidden ${gameRole === 'goalie' ? 'bg-blue-600 shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]' : 'bg-yellow-500 shadow-[inset_0_5px_15px_rgba(0,0,0,0.3)]'}`}></div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <AnimatePresence>
            {kickResult && (
              <motion.div initial={{ opacity: 0, scale: 0.1 }} animate={{ opacity: 1, scale: 1.8 }} exit={{ opacity: 0, scale: 4 }} className="flex flex-col items-center gap-2">
                <span className={`font-black italic tracking-tighter uppercase leading-none text-center drop-shadow-[0_0_30px_rgba(0,0,0,1)] ${kickResult === 'perfect' ? 'text-yellow-400 text-6xl' : kickResult === 'saved' ? 'text-blue-400 text-4xl' : 'text-green-500 text-5xl'}`}>
                  {kickResult === 'perfect' ? '完美進球!' : kickResult === 'saved' ? '被擋下了!' : '成功得分!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 p-4 w-full flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-8">
        {gameRole === 'striker' && (
          <motion.div 
            initial={{ x: -250, opacity: 0 }}
            animate={{ 
              x: isCharging ? [-2, 2, -1, 1, 0] : 0, 
              opacity: 1, 
              scale: isCharging ? [1.02, 1, 1.02] : strikerAnim === 'kick' ? 0.85 : strikerAnim === 'followthrough' ? 1.1 : 1,
              rotate: isCharging ? (chargeIntensity * -12) : strikerAnim === 'followthrough' ? -15 : 0,
              y: isCharging ? [0, -4, 0] : 0
            }}
            transition={isCharging ? { repeat: Infinity, duration: 0.12 - (chargeIntensity * 0.08) } : { type: 'spring', damping: 12 }}
            className="absolute bottom-16 left-2 z-[25] pointer-events-none flex flex-col items-center"
          >
            {/* Visual Accumulation Feedback */}
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

            {/* Perfect State Glow */}
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
        )}

        {gameRole === 'striker' ? (
          <>
            {/* Redesigned Power Energy Gauge */}
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
                {/* Gauge Segments Background */}
                <div className="absolute inset-0 flex">
                   <div className="flex-1 border-r border-white/5" />
                   <div className="flex-1 border-r border-white/5" />
                   <div className="flex-1 border-r border-white/5" />
                   <div className="flex-1 border-r border-white/5" />
                </div>
                
                {/* Heat Gradient Layer */}
                <div className="absolute inset-1.5 rounded-full bg-gradient-to-r from-blue-700 via-green-400 to-red-600 opacity-20" />
                
                <motion.div 
                  animate={{ 
                    width: `${power}%`,
                    backgroundColor: isPerfectZone ? '#fbbf24' : '#3b82f6',
                    boxShadow: isPerfectZone ? '0 0 30px rgba(251, 191, 36, 1)' : '0 0 15px rgba(59, 130, 246, 0.5)'
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
                
                {/* Perfect Window Highlight */}
                <div className="absolute top-0 bottom-0 left-[88%] w-[7%] bg-yellow-400/10 border-x-2 border-yellow-400/40 z-20" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-8 relative w-full pt-4">
              <div className="relative z-40">
                <motion.button
                  onMouseDown={handleStartCharging}
                  onMouseUp={handlePlayerShoot}
                  onTouchStart={handleStartCharging}
                  onTouchEnd={handlePlayerShoot}
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

                {/* Energy Gathering Ring */}
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
                     filter: `blur(${ballPos.blur}px)` 
                   }} 
                   transition={ballPos.transition || { type: "spring", damping: 12 }}
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
        ) : (
          <div className="w-full flex flex-col items-center gap-8 pb-10">
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-white font-black italic uppercase tracking-[0.2em] text-sm flex flex-col items-center gap-4"
            >
              <div className="p-5 bg-blue-600 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.7)] border-2 border-white/20">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
              點擊網格防禦射門!
            </motion.div>
            <div className="grid grid-cols-3 gap-5 bg-black/40 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                <button 
                  key={id} 
                  onClick={() => handlePlayerDefend(id)} 
                  disabled={isKicking} 
                  className="w-18 h-18 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400 active:scale-90 active:bg-blue-600 active:text-white transition-all shadow-2xl"
                >
                  {getDirectionIcon(id)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .bg-goal-net { background-image: radial-gradient(circle, #fff 1.5px, transparent 1.5px); background-size: 16px 16px; }
        .perspective-1000 { perspective: 1000px; }
        .animate-spin-slow { animation: spin 5s linear infinite; }
        .w-15 { width: 3.75rem; } .h-15 { height: 3.75rem; }
        .w-18 { width: 4.5rem; } .h-18 { height: 4.5rem; }
        .w-22 { width: 5.5rem; } .h-22 { height: 5.5rem; }
        .w-30 { width: 7.5rem; } .h-30 { height: 7.5rem; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};

export default GameScreen;
