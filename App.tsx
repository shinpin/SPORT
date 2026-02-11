
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { GameProvider, useGameContext } from './context/GameContext';
import { useAudioManager } from './hooks/useAudioManager';
import LoadingScreen from './components/LoadingScreen';
import StartScreen from './components/StartScreen';
import PairingScreen from './components/PairingScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import RedeemScreen from './components/RedeemScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import BackstagePanel from './components/BackstagePanel';

const AppContent: React.FC = () => {
  const {
    gameState, setGameState,
    userId, selectedTeam, finalStats, selectedPrize,
    isMuted, toggleMute,
    showBackstage, setShowBackstage,
    autoTestConfig, setAutoTestConfig,
    handleSelectTeam, handleStartMatch, handleGameEnd,
    handleRedeem, handleRestart, handleShowLeaderboard,
  } = useGameContext();

  const audio = useAudioManager(isMuted);
  const [isLoading, setIsLoading] = useState(true);

  const handleEnterGame = () => {
    setIsLoading(false);
    audio.play();
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleEnterGame} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-blue-500/30 relative">
      <button
        onClick={toggleMute}
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

const App: React.FC = () => (
  <GameProvider>
    <AppContent />
  </GameProvider>
);

export default App;
