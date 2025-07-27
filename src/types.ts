/**
 * Type definitions for the Roadmap Creator application
 */

export type MilestoneStatus = 'not-started' | 'in-progress' | 'completed';
export type MilestoneTag = 'priority' | 'optional' | 'in-progress' | 'blocked' | 'completed';
export type RoadmapLayout = 'linear' | 'tree' | 'network';
export type Theme = 'light' | 'dark' | 'system';

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  to: string; // ID of the connected milestone
  type?: 'straight' | 'curved' | 'angled'; // Type of connection line
}

export interface Milestone {
  id?: string; // Generated ID
  title: string;
  description?: string;
  status: MilestoneStatus;
  progress: number; // 0-100
  dueDate?: Date;
  tags: MilestoneTag[];
  icon: string;
  color: string;
  position: Position;
  connections: Connection[];
  completedDate?: Date;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  layout: RoadmapLayout;
  favorited?: boolean;
}

export interface GamificationStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  milestonesCompleted: number;
  roadmapsCompleted: number;
  streak: number;
  lastActive?: Date;
  achievements: Achievement[];
  rewards: Reward[];
  challenges: Challenge[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  claimed: boolean;
  claimedAt?: Date;
  type: 'theme' | 'icon-pack' | 'background' | 'badge';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
  reward?: Reward;
  progress: number; // 0-100
  requiredProgress: number;
}

// Context types
export interface RoadmapContextType {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  loading: boolean;
  error: string | null;
  createRoadmap: (roadmap: Partial<Roadmap>) => void;
  updateRoadmap: (roadmapId: string, updates: Partial<Roadmap>) => void;
  deleteRoadmap: (roadmapId: string) => void;
  setCurrentRoadmap: (roadmapId: string) => void;
  addMilestone: (milestone: Partial<Milestone>) => void;
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (milestoneId: string) => void;
  connectMilestones: (fromId: string, toId: string, type?: Connection['type']) => void;
  toggleFavorite: (roadmapId: string) => void;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export interface GamificationContextType {
  stats: GamificationStats;
  gainExperience: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  claimReward: (rewardId: string) => void;
  startChallenge: (challengeId: string) => void;
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  checkIn: () => void; // For streaks
} 