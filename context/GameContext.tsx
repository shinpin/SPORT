
import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, Team, Prize, GameStats, AutoTestConfig } from '../types';

interface GameContextValue {
  // Navigation state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Player
  userId: string;
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;

  // Game results
  finalStats: GameStats;
  setFinalStats: (stats: GameStats) => void;
  selectedPrize: Prize | null;
  setSelectedPrize: (prize: Prize | null) => void;

  // Audio
  isMuted: boolean;
  toggleMute: () => void;

  // Backstage
  showBackstage: boolean;
  setShowBackstage: (show: boolean) => void;
  autoTestConfig: AutoTestConfig;
  setAutoTestConfig: (config: AutoTestConfig) => void;

  // Navigation actions
  handleSelectTeam: (team: Team) => void;
  handleStartMatch: () => void;
  handleGameEnd: (stats: GameStats) => void;
  handleRedeem: (prize: Prize) => void;
  handleRestart: () => void;
  handleShowLeaderboard: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const INITIAL_STATS: GameStats = {
  score: 0,
  totalShots: 0,
  goalsScored: 0,
  savesMade: 0,
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [finalStats, setFinalStats] = useState<GameStats>(INITIAL_STATS);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showBackstage, setShowBackstage] = useState(false);
  const [autoTestConfig, setAutoTestConfig] = useState<AutoTestConfig>({ enabled: false, rounds: 1 });

  const [userId] = useState<string>(() => {
    return 'U' + Math.random().toString(36).substring(2, 9).toUpperCase();
  });

  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  const handleSelectTeam = useCallback((team: Team) => {
    setSelectedTeam(team);
    setGameState('pairing');
  }, []);

  const handleStartMatch = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleGameEnd = useCallback((stats: GameStats) => {
    setFinalStats(stats);
    setGameState('result');
  }, []);

  const handleRedeem = useCallback((prize: Prize) => {
    setSelectedPrize(prize);
    setGameState('redeem');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('start');
    setSelectedTeam(null);
    setFinalStats(INITIAL_STATS);
    setSelectedPrize(null);
  }, []);

  const handleShowLeaderboard = useCallback(() => {
    setGameState('leaderboard');
  }, []);

  return (
    <GameContext.Provider value={{
      gameState, setGameState,
      userId,
      selectedTeam, setSelectedTeam,
      finalStats, setFinalStats,
      selectedPrize, setSelectedPrize,
      isMuted, toggleMute,
      showBackstage, setShowBackstage,
      autoTestConfig, setAutoTestConfig,
      handleSelectTeam, handleStartMatch, handleGameEnd,
      handleRedeem, handleRestart, handleShowLeaderboard,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
