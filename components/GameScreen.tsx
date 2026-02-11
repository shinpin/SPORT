
import React from 'react';
import { motion } from 'framer-motion';
import { Team, GameStats } from '../types';
import { useGameEngine } from '../hooks/useGameEngine';
import StadiumBackground from './game/StadiumBackground';
import GameHUD from './game/GameHUD';
import GoalArea from './game/GoalArea';
import RoleSwapOverlay from './game/RoleSwapOverlay';
import StrikerControls from './game/StrikerControls';
import GoalieControls from './game/GoalieControls';

interface GameScreenProps {
  userId: string;
  team: Team;
  onGameEnd: (stats: GameStats) => void;
  autoTest?: boolean;
}

const GameScreen: React.FC<GameScreenProps> = ({ team, onGameEnd, autoTest = false }) => {
  const engine = useGameEngine({ onGameEnd, autoTest });

  return (
    <motion.div
      animate={{
        x: engine.isShaking ? [-10, 10, -8, 8, 0] : 0,
        y: engine.isShaking ? [-10, 10, -8, 8, 0] : 0,
      }}
      className="relative h-full w-full flex flex-col bg-[#050b15] overflow-hidden"
    >
      <StadiumBackground />
      <RoleSwapOverlay show={engine.showRoleSwap} team={team} />
      <GameHUD score={engine.score} timeLeft={engine.timeLeft} gameRole={engine.gameRole} />

      <GoalArea
        goalkeeperState={engine.goalkeeperState}
        gameRole={engine.gameRole}
        activeGrid={engine.activeGrid}
        netRipple={engine.netRipple}
        kickResult={engine.kickResult}
        ballPos={engine.ballPos}
      />

      <div className="relative z-30 p-4 w-full flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-8">
        {engine.gameRole === 'striker' ? (
          <StrikerControls
            team={team}
            power={engine.power}
            isCharging={engine.isCharging}
            isKicking={engine.isKicking}
            gameStarted={engine.gameStarted}
            isPerfectZone={engine.isPerfectZone}
            chargeIntensity={engine.chargeIntensity}
            strikerAnim={engine.strikerAnim}
            attemptsInPhase={engine.attemptsInPhase}
            ballPos={engine.ballPos}
            onStartCharging={engine.handleStartCharging}
            onShoot={engine.handlePlayerShoot}
          />
        ) : (
          <GoalieControls
            isKicking={engine.isKicking}
            onDefend={engine.handlePlayerDefend}
          />
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
