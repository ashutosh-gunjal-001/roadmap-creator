import { v4 as uuidv4 } from 'uuid';
import { Milestone, Roadmap } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return uuidv4();
};

// Format date to a readable string
export const formatDate = (date: Date | undefined): string => {
  if (!date) return 'No date';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Calculate the completion percentage of a roadmap
export const calculateCompletionPercentage = (milestones: Milestone[]): number => {
  if (milestones.length === 0) return 0;
  
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === 'completed'
  );
  
  return Math.round((completedMilestones.length / milestones.length) * 100);
};

// Calculate experience points based on milestone difficulty and other factors
export const calculateExperiencePoints = (
  milestone: Milestone,
  timeFactor: number = 1
): number => {
  const baseXP = 50;
  const progressFactor = milestone.progress / 100;
  const tagsBonus = milestone.tags.includes('priority') ? 1.5 : 1;
  
  return Math.round(baseXP * progressFactor * tagsBonus * timeFactor);
};

// Get the level based on experience points
export const calculateLevel = (experience: number): number => {
  // Simple level calculation: Every 1000 XP is a level
  return Math.floor(experience / 1000) + 1;
};

// Calculate XP required for the next level
export const calculateExperienceToNextLevel = (currentLevel: number): number => {
  return 1000; // Fixed 1000 XP per level for simplicity
};

// Generate a random color from a predefined palette
export const generateRandomColor = (): string => {
  const colors = [
    '#6a3de8', // Primary
    '#3bc9db', // Secondary
    '#ff7b7b', // Accent
    '#4cd964', // Success
    '#ffcc00', // Warning
    '#5ac8fa', // Info
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get default position for a new milestone
export const getDefaultMilestonePosition = (
  existingMilestones: Milestone[],
  layout: Roadmap['layout']
): { x: number; y: number } => {
  const basePosition = { x: 100, y: 100 };
  
  if (existingMilestones.length === 0) {
    return basePosition;
  }
  
  const lastMilestone = existingMilestones[existingMilestones.length - 1];
  
  switch (layout) {
    case 'linear':
      // For linear layout, offset to the right with consistent Y position
      return {
        x: lastMilestone.position.x + 150,
        y: lastMilestone.position.y,
      };
    
    case 'tree':
      // For tree layout, position in a hierarchical pattern
      return {
        x: lastMilestone.position.x + 150,
        y: lastMilestone.position.y + (Math.random() * 100 - 50),
      };
    
    case 'network':
      // For network layout, position in a more randomized pattern
      return {
        x: lastMilestone.position.x + (Math.random() * 150 + 50),
        y: lastMilestone.position.y + (Math.random() * 150 - 75),
      };
    
    default:
      return {
        x: lastMilestone.position.x + 150,
        y: lastMilestone.position.y,
      };
  }
};

// Get the path between two milestones based on the layout
export const getMilestonePath = (
  source: Milestone,
  target: Milestone,
  layout: Roadmap['layout']
): string => {
  const { x: x1, y: y1 } = source.position;
  const { x: x2, y: y2 } = target.position;
  
  switch (layout) {
    case 'linear':
      // Create a straight path with a slight curve
      const controlX = (x1 + x2) / 2;
      const controlY = (y1 + y2) / 2 - 30;
      return `M${x1},${y1} Q${controlX},${controlY} ${x2},${y2}`;
    
    case 'tree':
      // For tree layout, use right angles
      return `M${x1},${y1} L${(x1 + x2) / 2},${y1} L${(x1 + x2) / 2},${y2} L${x2},${y2}`;
    
    case 'network':
      // For network layout, use curved paths
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveFactor = distance / 3;
      
      const perpX = -dy / distance;
      const perpY = dx / distance;
      
      const controlPointX = midX + perpX * curveFactor;
      const controlPointY = midY + perpY * curveFactor;
      
      return `M${x1},${y1} Q${controlPointX},${controlPointY} ${x2},${y2}`;
    
    default:
      // Default to a straight line
      return `M${x1},${y1} L${x2},${y2}`;
  }
};

// Export as PDF
export const exportAsPdf = (elementId: string, filename: string): void => {
  // Implementation would use the jspdf library
  console.log('Exporting as PDF:', elementId, filename);
};

// Export as Image
export const exportAsImage = (elementId: string, filename: string): void => {
  // Implementation would use html-to-image library
  console.log('Exporting as Image:', elementId, filename);
};

// Export as JSON
export const exportAsJson = (roadmap: Roadmap, filename: string): void => {
  const dataStr = JSON.stringify(roadmap, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `${filename}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Import from JSON
export const importFromJson = (jsonString: string): Roadmap | null => {
  try {
    const roadmap = JSON.parse(jsonString) as Roadmap;
    
    // Convert string dates back to Date objects
    roadmap.createdAt = new Date(roadmap.createdAt);
    roadmap.updatedAt = new Date(roadmap.updatedAt);
    
    roadmap.milestones = roadmap.milestones.map(milestone => ({
      ...milestone,
      dueDate: milestone.dueDate ? new Date(milestone.dueDate) : undefined,
      completedDate: milestone.completedDate ? new Date(milestone.completedDate) : undefined,
    }));
    
    return roadmap;
  } catch (error) {
    console.error('Error importing from JSON:', error);
    return null;
  }
}; 