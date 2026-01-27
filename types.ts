
export type GameState = 'start' | 'pairing' | 'playing' | 'result' | 'redeem' | 'leaderboard';

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
