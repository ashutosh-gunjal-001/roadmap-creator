import React, { createContext, useState, useContext, useEffect } from 'react';
import { GamificationContextType, GamificationStats, Achievement, Reward, Challenge } from '../types';

// Create the context with default values
const GamificationContext = createContext<GamificationContextType>({
  stats: {
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    milestonesCompleted: 0,
    roadmapsCompleted: 0,
    streak: 0,
    achievements: [],
    rewards: [],
    challenges: [],
  },
  gainExperience: () => {},
  unlockAchievement: () => {},
  claimReward: () => {},
  startChallenge: () => {},
  completeChallenge: () => {},
  updateChallengeProgress: () => {},
  checkIn: () => {},
});

// Storage key
const GAMIFICATION_STORAGE_KEY = 'roadmap-creator-gamification';

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first-roadmap',
    title: 'Pathfinder',
    description: 'Create your first roadmap',
    icon: '🏆',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'first-milestone',
    title: 'First Step',
    description: 'Add your first milestone',
    icon: '🏆',
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'roadmap-master',
    title: 'Roadmap Master',
    description: 'Create 5 roadmaps',
    icon: '🏆',
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'milestone-master',
    title: 'Milestone Master',
    description: 'Complete 20 milestones',
    icon: '🏆',
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'streak-week',
    title: 'Consistent Planner',
    description: 'Maintain a 7-day streak',
    icon: '🏆',
    progress: 0,
    maxProgress: 7,
  },
];

// Initial rewards
const initialRewards: Reward[] = [
  {
    id: 'dark-theme',
    title: 'Dark Theme',
    description: 'Unlock the dark theme',
    icon: '🌙',
    claimed: false,
    type: 'theme',
  },
  {
    id: 'emoji-pack-1',
    title: 'Emoji Pack 1',
    description: 'Unlock additional emoji icons',
    icon: '😎',
    claimed: false,
    type: 'icon-pack',
  },
  {
    id: 'gradient-backgrounds',
    title: 'Gradient Backgrounds',
    description: 'Unlock gradient background options',
    icon: '🎨',
    claimed: false,
    type: 'background',
  },
];

// Initial challenges
const initialChallenges: Challenge[] = [
  {
    id: 'week-planner',
    title: 'Weekly Planner',
    description: 'Create a roadmap with at least 7 milestones',
    icon: '📅',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    completed: false,
    progress: 0,
    requiredProgress: 7,
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete all planned milestones for a week',
    icon: '✅',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    completed: false,
    progress: 0,
    requiredProgress: 1,
  },
];

// Calculate experience for next level
const calculateExperienceToNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const GamificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Initialize stats from localStorage or default
  const [stats, setStats] = useState<GamificationStats>(() => {
    const savedStats = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      
      // Convert string dates back to Date objects
      return {
        ...parsedStats,
        lastActive: parsedStats.lastActive ? new Date(parsedStats.lastActive) : undefined,
        achievements: parsedStats.achievements.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
        })),
        rewards: parsedStats.rewards.map((reward: any) => ({
          ...reward,
          claimedAt: reward.claimedAt ? new Date(reward.claimedAt) : undefined,
        })),
        challenges: parsedStats.challenges.map((challenge: any) => ({
          ...challenge,
          startDate: new Date(challenge.startDate),
          endDate: new Date(challenge.endDate),
        })),
      };
    }
    
    // Default stats
    return {
      level: 1,
      experience: 0,
      experienceToNextLevel: calculateExperienceToNextLevel(1),
      milestonesCompleted: 0,
      roadmapsCompleted: 0,
      streak: 0,
      lastActive: new Date(),
      achievements: initialAchievements,
      rewards: initialRewards,
      challenges: initialChallenges,
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  // Check for streak updates on component mount
  useEffect(() => {
    checkStreak();
  }, []);

  // Function to gain experience points
  const gainExperience = (amount: number) => {
    setStats(prevStats => {
      let newExperience = prevStats.experience + amount;
      let newLevel = prevStats.level;
      let experienceToNext = prevStats.experienceToNextLevel;
      
      // Level up if enough experience
      while (newExperience >= experienceToNext) {
        newExperience -= experienceToNext;
        newLevel++;
        experienceToNext = calculateExperienceToNextLevel(newLevel);
      }
      
      return {
        ...prevStats,
        level: newLevel,
        experience: newExperience,
        experienceToNextLevel: experienceToNext,
      };
    });
  };

  // Function to unlock an achievement
  const unlockAchievement = (achievementId: string) => {
    setStats(prevStats => {
      const newAchievements = prevStats.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlockedAt) {
          // If achievement not already unlocked
          gainExperience(50); // Grant experience for achievement
          return {
            ...achievement,
            progress: achievement.maxProgress,
            unlockedAt: new Date(),
          };
        }
        return achievement;
      });
      
      return {
        ...prevStats,
        achievements: newAchievements,
      };
    });
  };

  // Function to claim a reward
  const claimReward = (rewardId: string) => {
    setStats(prevStats => {
      const newRewards = prevStats.rewards.map(reward => {
        if (reward.id === rewardId && !reward.claimed) {
          return {
            ...reward,
            claimed: true,
            claimedAt: new Date(),
          };
        }
        return reward;
      });
      
      return {
        ...prevStats,
        rewards: newRewards,
      };
    });
  };

  // Function to start a challenge
  const startChallenge = (challengeId: string) => {
    setStats(prevStats => {
      const newChallenges = prevStats.challenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          return {
            ...challenge,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            progress: 0,
          };
        }
        return challenge;
      });
      
      return {
        ...prevStats,
        challenges: newChallenges,
      };
    });
  };

  // Function to complete a challenge
  const completeChallenge = (challengeId: string) => {
    setStats(prevStats => {
      const newChallenges = prevStats.challenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          gainExperience(100); // Grant experience for completing challenge
          return {
            ...challenge,
            completed: true,
            progress: challenge.requiredProgress,
          };
        }
        return challenge;
      });
      
      return {
        ...prevStats,
        challenges: newChallenges,
      };
    });
  };

  // Function to update challenge progress
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setStats(prevStats => {
      const newChallenges = prevStats.challenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          const newProgress = Math.min(challenge.requiredProgress, progress);
          
          // Auto-complete if reached required progress
          if (newProgress >= challenge.requiredProgress && !challenge.completed) {
            completeChallenge(challengeId);
          }
          
          return {
            ...challenge,
            progress: newProgress,
          };
        }
        return challenge;
      });
      
      return {
        ...prevStats,
        challenges: newChallenges,
      };
    });
  };

  // Function to check in daily for streak
  const checkIn = () => {
    const now = new Date();
    
    setStats(prevStats => {
      // If last active was yesterday, increase streak
      const lastActive = prevStats.lastActive || new Date();
      const lastActiveDate = new Date(lastActive);
      
      const isYesterday = 
        now.getDate() - lastActiveDate.getDate() === 1 ||
        (now.getDate() === 1 && 
          new Date(now.getFullYear(), now.getMonth(), 0).getDate() === lastActiveDate.getDate() &&
          (now.getMonth() - lastActiveDate.getMonth() === 1 || 
            (now.getMonth() === 0 && lastActiveDate.getMonth() === 11)));
      
      const isSameDay = 
        now.getDate() === lastActiveDate.getDate() &&
        now.getMonth() === lastActiveDate.getMonth() &&
        now.getFullYear() === lastActiveDate.getFullYear();
      
      let newStreak = prevStats.streak;
      
      if (isYesterday) {
        newStreak += 1;
        gainExperience(10); // Small XP bonus for maintaining streak
      } else if (!isSameDay) {
        newStreak = 1; // Reset streak if more than a day has passed
      }
      
      // Check for streak achievements
      if (newStreak >= 7) {
        const streakAchievement = prevStats.achievements.find(a => a.id === 'streak-week');
        if (streakAchievement && !streakAchievement.unlockedAt) {
          unlockAchievement('streak-week');
        }
      }
      
      return {
        ...prevStats,
        streak: newStreak,
        lastActive: now,
      };
    });
  };

  // Helper function to check streak on app load
  const checkStreak = () => {
    const now = new Date();
    const lastActive = stats.lastActive || new Date();
    
    const daysSinceLastActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastActive > 1) {
      // Reset streak if more than a day has passed
      setStats(prevStats => ({
        ...prevStats,
        streak: 0,
        lastActive: now,
      }));
    } else if (daysSinceLastActive === 1) {
      // If it's been exactly one day, continue the streak
      checkIn();
    }
  };

  return (
    <GamificationContext.Provider
      value={{
        stats,
        gainExperience,
        unlockAchievement,
        claimReward,
        startChallenge,
        completeChallenge,
        updateChallengeProgress,
        checkIn,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

// Custom hook to use the gamification context
export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export default GamificationContext; 