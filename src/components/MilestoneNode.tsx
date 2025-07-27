import React from 'react';
import { motion } from 'framer-motion';
import { Milestone } from '../../types';
import { formatDate } from '../../utils';

interface MilestoneNodeProps {
  milestone: Milestone;
  isSelected: boolean;
  onClick: () => void;
}

const MilestoneNode: React.FC<MilestoneNodeProps> = ({ milestone, isSelected, onClick }) => {
  // Calculate milestone status styling
  const getStatusStyling = () => {
    switch (milestone.status) {
      case 'completed':
        return {
          border: '2px solid var(--success-color)',
          opacity: 0.8,
        };
      case 'in-progress':
        return {
          border: '2px solid var(--primary-color)',
          opacity: 1,
        };
      default:
        return {
          border: '2px solid var(--border-color)',
          opacity: 0.9,
        };
    }
  };

  return (
    <motion.div
      className={`milestone-node ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${milestone.position.x}px`,
        top: `${milestone.position.y}px`,
        backgroundColor: milestone.color,
        ...getStatusStyling(),
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: isSelected 
          ? `0 0 15px ${milestone.color}`
          : `0 3px 6px rgba(0, 0, 0, 0.2)`,
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: `0 0 10px ${milestone.color}`,
        zIndex: 10,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      onClick={(e) => {
        e.stopPropagation();
        if (milestone.id) {
          onClick();
        }
      }}
    >
      <div className="milestone-icon">{milestone.icon}</div>
      
      {/* Show progress indicator for in-progress milestones */}
      {milestone.status === 'in-progress' && (
        <div className="milestone-progress-wrapper">
          <div 
            className="milestone-progress-bar" 
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      )}
      
      {/* Show milestone details when selected */}
      {isSelected && (
        <motion.div 
          className="milestone-details"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="milestone-title">{milestone.title}</h3>
          
          {milestone.description && (
            <p className="milestone-description">{milestone.description}</p>
          )}
          
          <div className="milestone-metadata">
            {milestone.dueDate && (
              <div className="milestone-due-date">
                📅 {formatDate(milestone.dueDate)}
              </div>
            )}
            
            {milestone.tags.length > 0 && (
              <div className="milestone-tags">
                {milestone.tags.map((tag, i) => (
                  <span key={i} className={`milestone-tag tag-${tag}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="milestone-status-badge">
              {milestone.status === 'completed' && '✅ Completed'}
              {milestone.status === 'in-progress' && '🔄 In Progress'}
              {milestone.status === 'not-started' && '⏱️ Not Started'}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MilestoneNode; 