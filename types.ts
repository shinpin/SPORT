
export type GameState = 'start' | 'pairing' | 'playing' | 'result' | 'redeem' | 'leaderboard';

export type GameRole = 'striker' | 'goalie';

export type KickResult = 'success' | 'fail' | 'perfect' | 'saved';

export type StrikerAnimation = 'idle' | 'prepare' | 'kick' | 'followthrough';

export interface Team {
  id: string;
  name: string;
  nationality: string;
  flagEmoji: string;
  starPlayer: string;
  color: string;
  gradient: string;
  jerseyImage: string;
}

export interface Prize {
  id: string;
  name: string;
  type: 'gold' | 'silver' | 'bronze';
  couponCode: string;
}

export interface GoalPosition {
  id: number;
  x: number;
  y: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  goals: number;
  matches: number;
  teamId: string;
  avatar: string;
}

export interface GameStats {
  score: number;
  totalShots: number;
  goalsScored: number;
  savesMade: number;
}

export interface BallPosition {
  x: number | number[];
  y: number | number[];
  scale: number | number[];
  rotate: number | number[];
  blur: number | number[];
  opacity: number;
  transition?: Record<string, unknown>;
}

export interface GoalkeeperState {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  isSaving: boolean;
}

export interface BallShadowPosition {
  x: number;
  y: number;
  scale: number;
}

export interface AutoTestConfig {
  enabled: boolean;
  rounds: number;
}
