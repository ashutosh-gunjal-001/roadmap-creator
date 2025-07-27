// Milestone Types
export type MilestoneStatus = 'not-started' | 'in-progress' | 'completed';
export type MilestoneTag = 'priority' | 'optional' | 'in-progress' | 'blocked' | 'completed' | string;

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate?: Date;
  completedDate?: Date;
  tags: MilestoneTag[];
  icon: string;
  color: string;
  progress: number; // 0-100
  position: {
    x: number;
    y: number;
  };
  connections: string[]; // Array of milestone IDs that this milestone connects to
}

// Roadmap Types
export type RoadmapLayout = 'linear' | 'tree' | 'network';

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  milestones: Milestone[];
  layout: RoadmapLayout;
  themeId: string;
  completionPercentage: number;
}

// Theme Types
export type ThemeVariant = 'light' | 'dark';
export type ThemeStyle = 'futuristic' | 'neon' | 'minimal' | 'adventure' | 'space';

export interface Theme {
  id: string;
  name: string;
  variant: ThemeVariant;
  style: ThemeStyle;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

// Gamification Types
export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  reward: Reward;
  completed: boolean;
  expiresAt?: Date;
}

export interface GamificationState {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  rewards: Reward[];
  challenges: Challenge[];
}

// Context Types
export interface RoadmapContextProps {
  roadmaps: Roadmap[];
  currentRoadmap: Roadmap | null;
  setCurrentRoadmap: (roadmap: Roadmap | null) => void;
  createRoadmap: (roadmap: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt' | 'completionPercentage'>) => void;
  updateRoadmap: (roadmap: Roadmap) => void;
  deleteRoadmap: (id: string) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (milestone: Milestone) => void;
  deleteMilestone: (id: string) => void;
  connectMilestones: (sourceId: string, targetId: string) => void;
  disconnectMilestones: (sourceId: string, targetId: string) => void;
  reorderMilestones: (milestoneIds: string[]) => void;
}

export interface ThemeContextProps {
  currentTheme: Theme;
  themeVariant: ThemeVariant;
  availableThemes: Theme[];
  setTheme: (theme: Theme) => void;
  toggleThemeVariant: () => void;
}

export interface GamificationContextProps {
  state: GamificationState;
  completeMilestone: (milestoneId: string) => void;
  unlockReward: (rewardId: string) => void;
  progressChallenge: (challengeId: string, amount: number) => void;
  completeChallenge: (challengeId: string) => void;
} 