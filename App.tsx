
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import StartScreen from './components/StartScreen';
import PairingScreen from './components/PairingScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import RedeemScreen from './components/RedeemScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BackstagePanel from './components/BackstagePanel';
import { Team, Prize, GameStats } from './types';
import { Volume2, VolumeX } from 'lucide-react';

// 使用提供的最新 BGM URL
const BGM_URL = "https://github.com/shinpin/SPORT/raw/refs/heads/main/BGM_footballtest.mp3"; 

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState('start');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showBackstage, setShowBackstage] = useState(false);
  const [autoTestConfig, setAutoTestConfig] = useState({ enabled: false, rounds: 1 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [userId] = useState<string>(() => {
    return 'U' + Math.random().toString(36).substring(2, 9).toUpperCase();
  });
  
  const [finalStats, setFinalStats] = useState<GameStats>({
    score: 0,
    totalShots: 0,
    goalsScored: 0,
    savesMade: 0
  });
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);

  // 初始化音頻
  useEffect(() => {
    const audio = new Audio();
    audio.src = BGM_URL;
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audio.muted = isMuted;
    
    audio.onerror = (e) => {
      console.error("背景音樂加載失敗：", BGM_URL, e);
    };

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleEnterGame = () => {
    setIsLoading(false);
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("自動播放受限", err);
      });
    }

    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        audioRef.current.play().catch(() => {});
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setGameState('pairing');
  };

  const handleStartMatch = () => {
    setGameState('playing');
  };

  const handleGameEnd = (stats: GameStats) => {
    setFinalStats(stats);
    setGameState('result');
  };

  const handleRedeem = (prize: Prize) => {
    setSelectedPrize(prize);
    setGameState('redeem');
  };

  const handleRestart = () => {
    setGameState('start');
    setSelectedTeam(null);
    setFinalStats({
      score: 0,
      totalShots: 0,
      goalsScored: 0,
      savesMade: 0
    });
    setSelectedPrize(null);
  };

  const handleShowLeaderboard = () => {
    setGameState('leaderboard');
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleEnterGame} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-blue-500/30 relative">
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-6 right-6 z-[200] p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full active:scale-90 transition-transform shadow-2xl"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-white/50" /> : <Volume2 className="w-5 h-5 text-blue-400 animate-pulse" />}
      </button>

      <AnimatePresence>
        {showBackstage && (
          <BackstagePanel 
            onClose={() => setShowBackstage(false)} 
            config={autoTestConfig}
            onUpdateConfig={setAutoTestConfig}
          />
        )}
      </AnimatePresence>

      {gameState === 'start' && (
        <StartScreen 
          onStart={handleSelectTeam} 
          onShowLeaderboard={handleShowLeaderboard} 
          onOpenBackstage={() => setShowBackstage(true)}
        />
      )}
      {gameState === 'pairing' && selectedTeam && (
        <PairingScreen team={selectedTeam} onStartMatch={handleStartMatch} />
      )}
      {gameState === 'playing' && selectedTeam && (
        <GameScreen 
          userId={userId} 
          team={selectedTeam} 
          onGameEnd={handleGameEnd}
          autoTest={autoTestConfig.enabled}
        />
      )}
      {gameState === 'result' && (
        <ResultScreen 
          stats={finalStats} 
          onRedeem={handleRedeem} 
          onRestart={handleRestart}
          onShowLeaderboard={handleShowLeaderboard}
        />
      )}
      {gameState === 'redeem' && selectedPrize && selectedTeam && (
        <RedeemScreen 
          prize={selectedPrize} 
          team={selectedTeam}
          score={finalStats.score} 
          userId={userId}
          onRestart={handleRestart}
          onBack={() => setGameState('result')}
        />
      )}
      {gameState === 'leaderboard' && (
        <LeaderboardScreen 
          onBack={() => setGameState('start')} 
          currentUser={{ id: userId, score: finalStats.score, teamId: selectedTeam?.id || 'blue' }}
        />
      )}
    </div>
  );
};

export default App;
