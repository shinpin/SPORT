
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  GameRole, KickResult, StrikerAnimation,
  BallPosition, GoalkeeperState, BallShadowPosition, GameStats,
} from '../types';
import { GOAL_POSITIONS } from '../constants';

const DEFAULT_BALL: BallPosition = { x: 0, y: 0, scale: 1, rotate: 0, blur: 0, opacity: 1 };
const DEFAULT_SHADOW: BallShadowPosition = { x: 0, y: 0, scale: 1 };
const DEFAULT_KEEPER: GoalkeeperState = { x: 0, y: 0, rotate: 0, scale: 1, isSaving: false };

interface UseGameEngineOptions {
  onGameEnd: (stats: GameStats) => void;
  autoTest: boolean;
}

export function useGameEngine({ onGameEnd, autoTest }: UseGameEngineOptions) {
  // Core game state
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45);
  const [gameRole, setGameRole] = useState<GameRole>('striker');
  const [attemptsInPhase, setAttemptsInPhase] = useState(0);
  const [score, setScore] = useState(0);
  const [totalShots, setTotalShots] = useState(0);
  const [goalsScored, setGoalsScored] = useState(0);
  const [savesMade, setSavesMade] = useState(0);

  // Striker charging
  const [power, setPower] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isKicking, setIsKicking] = useState(false);
  const [kickResult, setKickResult] = useState<KickResult | null>(null);

  // Visual/animation state
  const [ballPos, setBallPos] = useState<BallPosition>(DEFAULT_BALL);
  const [ballShadowPos, setBallShadowPos] = useState<BallShadowPosition>(DEFAULT_SHADOW);
  const [goalkeeperState, setGoalkeeperState] = useState<GoalkeeperState>(DEFAULT_KEEPER);
  const [isShaking, setIsShaking] = useState(false);
  const [showRoleSwap, setShowRoleSwap] = useState(false);
  const [activeGrid, setActiveGrid] = useState<number | null>(null);
  const [netRipple, setNetRipple] = useState(false);
  const [strikerAnim, setStrikerAnim] = useState<StrikerAnimation>('idle');

  // Refs
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const powerDirectionRef = useRef(1);
  const isChargingRef = useRef(false);

  // Derived
  const isPerfectZone = useMemo(() => power >= 88 && power <= 95, [power]);
  const chargeIntensity = useMemo(() => power / 100, [power]);

  // ── End game ──
  const endGame = useCallback(() => {
    onGameEnd({ score, totalShots, goalsScored, savesMade });
  }, [onGameEnd, score, totalShots, goalsScored, savesMade]);

  // ── Countdown ──
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
    }
  }, [countdown]);

  // ── Game timer ──
  useEffect(() => {
    if (!gameStarted || showRoleSwap) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, showRoleSwap]);

  // End game when timer hits 0
  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      onGameEnd({ score, totalShots, goalsScored, savesMade });
    }
  }, [timeLeft, gameStarted]);

  // ── Power charging oscillation ──
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

  // ── Role swap ──
  const swapRole = useCallback(() => {
    if (gameRole === 'striker') {
      setShowRoleSwap(true);
      setTimeout(() => {
        setGameRole('goalie');
        setAttemptsInPhase(0);
        setShowRoleSwap(false);
        setStrikerAnim('idle');
        setBallPos(DEFAULT_BALL);
        setBallShadowPos(DEFAULT_SHADOW);
      }, 2500);
    } else {
      onGameEnd({ score, totalShots, goalsScored, savesMade });
    }
  }, [gameRole, onGameEnd, score, totalShots, goalsScored, savesMade]);

  // ── Start charging ──
  const handleStartCharging = useCallback(() => {
    if (isKicking || !gameStarted || gameRole !== 'striker' || showRoleSwap) return;
    setIsCharging(true);
    isChargingRef.current = true;
    if (navigator.vibrate) navigator.vibrate(10);
  }, [isKicking, gameStarted, gameRole, showRoleSwap]);

  // ── Player shoot ──
  const handlePlayerShoot = useCallback(() => {
    if (!isChargingRef.current && !isCharging) return;
    const finalPower = power;
    setIsCharging(false);
    isChargingRef.current = false;
    setIsKicking(true);
    setStrikerAnim('kick');
    setTotalShots(prev => prev + 1);

    const targetIdx = Math.floor(Math.random() * GOAL_POSITIONS.length);
    const target = GOAL_POSITIONS[targetIdx];

    const goalieTargetIdx = Math.random() < 0.25
      ? targetIdx
      : Math.floor(Math.random() * 9);
    const goalieTarget = GOAL_POSITIONS[goalieTargetIdx];

    const ballTargetX = (target.x - 50) * 4.5;
    const ballTargetY = -550 - (target.y * 2.5);
    const goalieTargetX = (goalieTarget.x - 50) * 3;
    const goalieTargetY = (goalieTarget.y - 40) * 1.5;

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
        transition: { duration: flightDuration, ease: isPerfect ? "circIn" : "easeOut" },
      });

      setBallShadowPos({ x: ballTargetX * 0.5, y: -50, scale: 0.5 });

      setTimeout(() => {
        setGoalkeeperState({
          x: goalieTargetX,
          y: goalieTargetY,
          rotate: goalieTargetX > 0 ? 60 : goalieTargetX < 0 ? -60 : 0,
          scale: 1.2,
          isSaving: isBlocked,
        });
      }, 10);

      setTimeout(() => {
        const result: KickResult = isBlocked ? 'saved' : (isPerfect ? 'perfect' : 'success');
        setKickResult(result);

        if (result !== 'saved') {
          setGoalsScored(prev => prev + 1);
          setNetRipple(true);
          setIsShaking(true);
          setTimeout(() => setNetRipple(false), 400);
          setTimeout(() => setIsShaking(false), isPerfect ? 400 : 250);
          setScore(prev => prev + (result === 'perfect' ? 25 : 10));
          if (navigator.vibrate) navigator.vibrate(result === 'perfect' ? [200, 50, 200] : 80);
        } else {
          setBallPos({
            x: ballTargetX + (Math.random() * 160 - 80),
            y: ballTargetY + 200,
            scale: 0.7,
            rotate: 2400,
            blur: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 120 },
          });
          if (navigator.vibrate) navigator.vibrate(60);
        }

        setTimeout(() => {
          setKickResult(null);
          setBallPos(DEFAULT_BALL);
          setBallShadowPos(DEFAULT_SHADOW);
          setGoalkeeperState(DEFAULT_KEEPER);
          setIsKicking(false);
          setPower(0);
          setStrikerAnim('idle');

          setAttemptsInPhase(prev => {
            const next = prev + 1;
            if (next >= 3) {
              // Use timeout to avoid updating state during render triggered by setAttemptsInPhase
              setTimeout(() => swapRole(), 0);
            }
            return next;
          });
        }, 1500);
      }, flightDuration * 1000);
    }, 60);
  }, [isCharging, power, swapRole]);

  // ── Player defend ──
  const handlePlayerDefend = useCallback((goalIdx: number) => {
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
      isSaving: true,
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
        transition: { duration: 0.5 },
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
          setBallPos(DEFAULT_BALL);
          setBallShadowPos(DEFAULT_SHADOW);
          setGoalkeeperState(DEFAULT_KEEPER);
          setIsKicking(false);
          setActiveGrid(null);

          setAttemptsInPhase(prev => {
            const next = prev + 1;
            if (next >= 3) {
              setTimeout(() => onGameEnd({ score, totalShots, goalsScored, savesMade }), 0);
            }
            return next;
          });
        }, 1500);
      }, 450);
    }, 120);
  }, [isKicking, gameStarted, gameRole, showRoleSwap, onGameEnd, score, totalShots, goalsScored, savesMade]);

  // ── AI Auto-test ──
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
  }, [autoTest, gameStarted, isKicking, gameRole, showRoleSwap, handleStartCharging, handlePlayerShoot, handlePlayerDefend]);

  return {
    // Core state
    gameStarted, countdown, timeLeft, gameRole, attemptsInPhase,
    score, totalShots, goalsScored, savesMade,

    // Striker
    power, isCharging, isKicking, kickResult,
    isPerfectZone, chargeIntensity, strikerAnim,

    // Visual
    ballPos, ballShadowPos, goalkeeperState,
    isShaking, showRoleSwap, activeGrid, netRipple,

    // Actions
    handleStartCharging, handlePlayerShoot, handlePlayerDefend,
  };
}
