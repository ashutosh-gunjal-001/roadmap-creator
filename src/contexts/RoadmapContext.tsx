import React, { createContext, useContext, useState, useEffect } from 'react';
import { Roadmap, RoadmapContextType, Milestone, Connection } from '../types';
import { generateId } from '../utils';

// Create the context with default values
const RoadmapContext = createContext<RoadmapContextType>({
  roadmaps: [],
  currentRoadmap: null,
  loading: false,
  error: null,
  createRoadmap: () => {},
  updateRoadmap: () => {},
  deleteRoadmap: () => {},
  setCurrentRoadmap: () => {},
  addMilestone: () => {},
  updateMilestone: () => {},
  deleteMilestone: () => {},
  connectMilestones: () => {},
  toggleFavorite: () => {},
});

// Storage keys
const ROADMAPS_STORAGE_KEY = 'roadmap-creator-roadmaps';
const CURRENT_ROADMAP_STORAGE_KEY = 'roadmap-creator-current-roadmap';

export const RoadmapProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [currentRoadmap, setCurrentRoadmapState] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load roadmaps from localStorage on initial mount
  useEffect(() => {
    try {
      const storedRoadmaps = localStorage.getItem(ROADMAPS_STORAGE_KEY);
      if (storedRoadmaps) {
        const parsedRoadmaps = JSON.parse(storedRoadmaps);
        
        // Convert string dates back to Date objects
        const processedRoadmaps = parsedRoadmaps.map((roadmap: any) => ({
          ...roadmap,
          createdAt: new Date(roadmap.createdAt),
          updatedAt: new Date(roadmap.updatedAt),
          milestones: roadmap.milestones.map((milestone: any) => ({
            ...milestone,
            dueDate: milestone.dueDate ? new Date(milestone.dueDate) : undefined,
            completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
          })),
        }));
        
        setRoadmaps(processedRoadmaps);
        
        // Load current roadmap if available
        const storedCurrentRoadmapId = localStorage.getItem(CURRENT_ROADMAP_STORAGE_KEY);
        if (storedCurrentRoadmapId) {
          const currentRoadmap = processedRoadmaps.find(
            (r: Roadmap) => r.id === storedCurrentRoadmapId
          );
          if (currentRoadmap) {
            setCurrentRoadmapState(currentRoadmap);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load roadmaps from localStorage:', err);
      setError('Failed to load your roadmaps. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save roadmaps to localStorage whenever they change
  useEffect(() => {
    if (roadmaps.length > 0) {
      try {
        localStorage.setItem(ROADMAPS_STORAGE_KEY, JSON.stringify(roadmaps));
      } catch (err) {
        console.error('Failed to save roadmaps to localStorage:', err);
        setError('Failed to save your roadmaps. Please check your browser storage settings.');
      }
    }
  }, [roadmaps]);

  // Save current roadmap ID to localStorage
  useEffect(() => {
    if (currentRoadmap) {
      localStorage.setItem(CURRENT_ROADMAP_STORAGE_KEY, currentRoadmap.id);
    } else {
      localStorage.removeItem(CURRENT_ROADMAP_STORAGE_KEY);
    }
  }, [currentRoadmap]);

  // Create a new roadmap
  const createRoadmap = (roadmapData: Partial<Roadmap>) => {
    const now = new Date();
    const newRoadmap: Roadmap = {
      id: generateId(),
      title: roadmapData.title || 'Untitled Roadmap',
      description: roadmapData.description || '',
      milestones: [],
      createdAt: now,
      updatedAt: now,
      layout: roadmapData.layout || 'linear',
      favorited: false,
    };

    setRoadmaps([...roadmaps, newRoadmap]);
    setCurrentRoadmapState(newRoadmap);
  };

  // Update an existing roadmap
  const updateRoadmap = (roadmapId: string, updates: Partial<Roadmap>) => {
    setRoadmaps(
      roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedRoadmap = {
            ...roadmap,
            ...updates,
            updatedAt: new Date(),
          };
          
          // If this is the current roadmap, update it as well
          if (currentRoadmap && currentRoadmap.id === roadmapId) {
            setCurrentRoadmapState(updatedRoadmap);
          }
          
          return updatedRoadmap;
        }
        return roadmap;
      })
    );
  };

  // Delete a roadmap
  const deleteRoadmap = (roadmapId: string) => {
    setRoadmaps(roadmaps.filter((roadmap) => roadmap.id !== roadmapId));
    
    // If the deleted roadmap is the current one, set current to null
    if (currentRoadmap && currentRoadmap.id === roadmapId) {
      setCurrentRoadmapState(null);
    }
  };

  // Set the current roadmap by ID
  const setCurrentRoadmap = (roadmapId: string) => {
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (roadmap) {
      setCurrentRoadmapState(roadmap);
    } else {
      setError(`Roadmap with ID ${roadmapId} not found.`);
    }
  };

  // Add a milestone to the current roadmap
  const addMilestone = (milestoneData: Partial<Milestone>) => {
    if (!currentRoadmap) {
      setError('No roadmap selected. Please select or create a roadmap first.');
      return;
    }

    const newMilestone: Milestone = {
      id: generateId(),
      title: milestoneData.title || 'Untitled Milestone',
      description: milestoneData.description || '',
      status: milestoneData.status || 'not-started',
      progress: milestoneData.progress !== undefined ? milestoneData.progress : 0,
      dueDate: milestoneData.dueDate,
      tags: milestoneData.tags || [],
      icon: milestoneData.icon || '📌',
      color: milestoneData.color || '#607d8b',
      position: milestoneData.position || { x: 0, y: 0 },
      connections: milestoneData.connections || [],
      completedDate: milestoneData.status === 'completed' ? new Date() : undefined,
    };

    const updatedMilestones = [...currentRoadmap.milestones, newMilestone];
    
    // Apply automatic positioning based on layout if position is (0,0)
    if (newMilestone.position.x === 0 && newMilestone.position.y === 0) {
      const updatedPositionMilestones = autoPositionMilestones(
        updatedMilestones,
        currentRoadmap.layout
      );
      
      updateRoadmap(currentRoadmap.id, {
        milestones: updatedPositionMilestones,
        updatedAt: new Date(),
      });
    } else {
      updateRoadmap(currentRoadmap.id, {
        milestones: updatedMilestones,
        updatedAt: new Date(),
      });
    }
  };

  // Helper function to automatically position milestones based on layout
  const autoPositionMilestones = (milestones: Milestone[], layout: Roadmap['layout']) => {
    const SPACING = 200; // Space between milestones
    
    switch (layout) {
      case 'linear':
        // Position milestones in a horizontal line
        return milestones.map((milestone, index) => ({
          ...milestone,
          position: milestone.position.x === 0 && milestone.position.y === 0
            ? { x: 100 + index * SPACING, y: 300 }
            : milestone.position
        }));
        
      case 'tree':
        // Position milestones in a tree-like structure
        return milestones.map((milestone, index) => {
          if (milestone.position.x === 0 && milestone.position.y === 0) {
            const level = Math.floor(index / 3);
            const position = index % 3;
            return {
              ...milestone,
              position: { 
                x: 100 + position * SPACING, 
                y: 100 + level * SPACING 
              }
            };
          }
          return milestone;
        });
        
      case 'network':
        // Position milestones in a circular network
        return milestones.map((milestone, index) => {
          if (milestone.position.x === 0 && milestone.position.y === 0) {
            const angle = (index * (2 * Math.PI)) / milestones.length;
            const radius = 250;
            return {
              ...milestone,
              position: {
                x: 400 + Math.cos(angle) * radius,
                y: 300 + Math.sin(angle) * radius,
              }
            };
          }
          return milestone;
        });
        
      default:
        return milestones;
    }
  };

  // Update an existing milestone
  const updateMilestone = (milestoneId: string, updates: Partial<Milestone>) => {
    if (!currentRoadmap) {
      setError('No roadmap selected. Please select a roadmap first.');
      return;
    }

    const updatedMilestones = currentRoadmap.milestones.map((milestone) => {
      if (milestone.id === milestoneId) {
        // If status is changing to completed, set completedDate
        const completedDate = 
          updates.status === 'completed' && milestone.status !== 'completed'
            ? new Date()
            : milestone.completedDate;
            
        return {
          ...milestone,
          ...updates,
          completedDate,
        };
      }
      return milestone;
    });

    updateRoadmap(currentRoadmap.id, {
      milestones: updatedMilestones,
      updatedAt: new Date(),
    });
  };

  // Delete a milestone
  const deleteMilestone = (milestoneId: string) => {
    if (!currentRoadmap) {
      setError('No roadmap selected. Please select a roadmap first.');
      return;
    }

    // Remove the milestone
    const updatedMilestones = currentRoadmap.milestones.filter(
      (milestone) => milestone.id !== milestoneId
    );

    // Remove any connections to this milestone
    const cleanedMilestones = updatedMilestones.map((milestone) => ({
      ...milestone,
      connections: milestone.connections.filter(
        (connection) => connection.to !== milestoneId
      ),
    }));

    updateRoadmap(currentRoadmap.id, {
      milestones: cleanedMilestones,
      updatedAt: new Date(),
    });
  };

  // Connect two milestones
  const connectMilestones = (fromId: string, toId: string, type: Connection['type'] = 'straight') => {
    if (!currentRoadmap) {
      setError('No roadmap selected. Please select a roadmap first.');
      return;
    }

    // Check if both milestones exist
    const fromMilestone = currentRoadmap.milestones.find((m) => m.id === fromId);
    const toMilestone = currentRoadmap.milestones.find((m) => m.id === toId);

    if (!fromMilestone || !toMilestone) {
      setError('One or both milestones not found.');
      return;
    }

    // Check if connection already exists
    const connectionExists = fromMilestone.connections.some((c) => c.to === toId);
    if (connectionExists) {
      return; // Connection already exists, nothing to do
    }

    // Add the connection
    const updatedMilestones = currentRoadmap.milestones.map((milestone) => {
      if (milestone.id === fromId) {
        return {
          ...milestone,
          connections: [...milestone.connections, { to: toId, type }],
        };
      }
      return milestone;
    });

    updateRoadmap(currentRoadmap.id, {
      milestones: updatedMilestones,
      updatedAt: new Date(),
    });
  };

  // Toggle favorite status of a roadmap
  const toggleFavorite = (roadmapId: string) => {
    setRoadmaps(
      roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedRoadmap = {
            ...roadmap,
            favorited: !roadmap.favorited,
            updatedAt: new Date(),
          };
          
          // If this is the current roadmap, update it as well
          if (currentRoadmap && currentRoadmap.id === roadmapId) {
            setCurrentRoadmapState(updatedRoadmap);
          }
          
          return updatedRoadmap;
        }
        return roadmap;
      })
    );
  };

  return (
    <RoadmapContext.Provider
      value={{
        roadmaps,
        currentRoadmap,
        loading,
        error,
        createRoadmap,
        updateRoadmap,
        deleteRoadmap,
        setCurrentRoadmap,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        connectMilestones,
        toggleFavorite,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
};

// Custom hook to use the roadmap context
export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};

export default RoadmapContext; 