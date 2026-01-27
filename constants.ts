
import { Team, Prize, GoalPosition, LeaderboardEntry } from './types';

export const TEAMS: Team[] = [
  { 
    id: 'red', 
    name: '西班牙', 
    nationality: 'Spain', 
    flagEmoji: '🇪🇸',
    starPlayer: 'Lamine Yamal',
    color: 'bg-red-600', 
    gradient: 'from-red-600 to-red-900',
    jerseyImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'blue', 
    name: '阿根廷', 
    nationality: 'Argentina', 
    flagEmoji: '🇦🇷',
    starPlayer: 'Lionel Messi',
    color: 'bg-sky-500', 
    gradient: 'from-sky-400 to-blue-700',
    jerseyImage: 'https://images.unsplash.com/photo-1644310972589-643a2099d946?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'green', 
    name: '巴西', 
    nationality: 'Brazil', 
    flagEmoji: '🇧🇷',
    starPlayer: 'Vinícius Jr.',
    color: 'bg-green-600', 
    gradient: 'from-green-500 to-yellow-600',
    jerseyImage: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'white', 
    name: '德國', 
    nationality: 'Germany', 
    flagEmoji: '🇩🇪',
    starPlayer: 'Jamal Musiala',
    color: 'bg-slate-200', 
    gradient: 'from-slate-100 to-slate-400',
    jerseyImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'darkblue', 
    name: '日本', 
    nationality: 'Japan', 
    flagEmoji: '🇯🇵',
    starPlayer: 'Kaoru Mitoma',
    color: 'bg-blue-900', 
    gradient: 'from-blue-900 to-indigo-950',
    jerseyImage: 'https://images.unsplash.com/photo-1518005020250-68594f214612?q=80&w=300&auto=format&fit=crop' 
  },
  { 
    id: 'yellow', 
    name: '葡萄牙', 
    nationality: 'Portugal', 
    flagEmoji: '🇵🇹',
    starPlayer: 'Cristiano Ronaldo',
    color: 'bg-red-700', 
    gradient: 'from-red-800 to-green-800',
    jerseyImage: 'https://images.unsplash.com/photo-1518005020250-68594f214612?q=80&w=300&auto=format&fit=crop' 
  },
];

export const PRIZES: Prize[] = [
  { id: '1', name: '金獎 - 免費飲料券', type: 'gold', couponCode: 'GOLD2025' },
  { id: '2', name: '銀獎 - 9折優惠券', type: 'silver', couponCode: 'SILVER2025' },
  { id: '3', name: '銅獎 - 小禮品兌換券', type: 'bronze', couponCode: 'BRONZE2025' },
];

export const GOAL_POSITIONS: GoalPosition[] = [
  { id: 0, x: 20, y: 15 }, { id: 1, x: 50, y: 15 }, { id: 2, x: 80, y: 15 },
  { id: 3, x: 20, y: 40 }, { id: 4, x: 50, y: 40 }, { id: 5, x: 80, y: 40 },
  { id: 6, x: 20, y: 65 }, { id: 7, x: 50, y: 65 }, { id: 8, x: 80, y: 65 },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'L1', name: 'HAALAND', goals: 13, matches: 10, teamId: 'blue', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { id: 'L2', name: 'SEMENYO', goals: 6, matches: 10, teamId: 'red', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop' },
  { id: 'L3', name: 'WELBECK', goals: 6, matches: 10, teamId: 'blue', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: 'L4', name: 'MATETA', goals: 6, matches: 10, teamId: 'blue', avatar: 'https://images.unsplash.com/photo-1552058544-1271d756418b?w=200&h=200&fit=crop' },
  { id: 'L5', name: 'THIAGO', goals: 6, matches: 10, teamId: 'red', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop' },
];
