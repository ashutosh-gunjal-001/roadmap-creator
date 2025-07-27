/**
 * Utility functions for the Roadmap Creator app
 */

import { RoadmapLayout } from './types';

/**
 * Generates a random color in hex format
 * Used for milestone colors when creating new milestones
 */
export const generateRandomColor = (): string => {
  // Generate pastel colors that are visually pleasing
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20); // Between 65-85%
  const lightness = 65 + Math.floor(Math.random() * 15); // Between 65-80%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

/**
 * Format a date to a human-readable string
 */
export const formatDate = (date?: Date): string => {
  if (!date) return 'No due date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Calculate the progress color based on percentage
 */
export const getProgressColor = (progress: number): string => {
  if (progress < 25) return 'var(--danger-color)';
  if (progress < 75) return 'var(--warning-color)';
  return 'var(--success-color)';
};

/**
 * Get status badge styling
 */
export const getStatusStyles = (status: string): { color: string; background: string } => {
  switch (status) {
    case 'completed':
      return { color: '#fff', background: 'var(--success-color)' };
    case 'in-progress':
      return { color: '#fff', background: 'var(--warning-color)' };
    case 'not-started':
    default:
      return { color: '#fff', background: 'var(--neutral-color)' };
  }
};

/**
 * Create a debounced function that delays invoking the provided function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Generate a path between two milestones based on the roadmap layout
 */
export const getMilestonePath = (
  source: { position: { x: number, y: number }, id?: string },
  target: { position: { x: number, y: number }, id?: string },
  layout: RoadmapLayout
): string => {
  const sourceX = source.position.x + 110; // Half of milestone width
  const sourceY = source.position.y + 30; // Half of milestone height
  const targetX = target.position.x + 110;
  const targetY = target.position.y + 30;
  
  // Calculate midpoints for curved paths
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  switch (layout) {
    case 'linear':
      // Straight line with slight curve
      return `M ${sourceX} ${sourceY} Q ${midX} ${midY - 30} ${targetX} ${targetY}`;
    
    case 'tree':
      // Tree-like structure with 90-degree angles
      return `M ${sourceX} ${sourceY} H ${midX} V ${targetY} H ${targetX}`;
    
    case 'network':
      // Curved path with control points that create a more organic flow
      const dx = targetX - sourceX;
      const dy = targetY - sourceY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const curveFactor = Math.min(distance * 0.4, 100);
      
      // Calculate control points
      const controlX1 = sourceX + dx / 3 + (Math.random() - 0.5) * curveFactor;
      const controlY1 = sourceY + dy / 3 + (Math.random() - 0.5) * curveFactor;
      const controlX2 = sourceX + 2 * dx / 3 + (Math.random() - 0.5) * curveFactor;
      const controlY2 = sourceY + 2 * dy / 3 + (Math.random() - 0.5) * curveFactor;
      
      return `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;
    
    default:
      // Default to a simple curved line
      return `M ${sourceX} ${sourceY} Q ${midX} ${midY - 20} ${targetX} ${targetY}`;
  }
}; 