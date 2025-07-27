import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoadmap } from '../../context/RoadmapContext';
import { MilestoneTag, MilestoneStatus } from '../../types';
import { generateRandomColor } from '../../utils';

interface MilestoneFormProps {
  onClose: () => void;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({ onClose }) => {
  const { addMilestone } = useRoadmap();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState(generateRandomColor());
  const [status, setStatus] = useState<MilestoneStatus>('not-started');
  const [progress, setProgress] = useState(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [tags, setTags] = useState<MilestoneTag[]>([]);
  
  // Common icons for milestone types
  const commonIcons = ['🎯', '📌', '🏆', '📝', '🚀', '💡', '📚', '⚙️', '🔍', '📊', '🎨', '💻'];
  
  // Common tags for milestones
  const availableTags: MilestoneTag[] = ['priority', 'optional', 'in-progress', 'blocked', 'completed'];
  
  const handleTagToggle = (tag: MilestoneTag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    addMilestone({
      title,
      description,
      status,
      icon,
      color,
      progress: status === 'completed' ? 100 : status === 'not-started' ? 0 : progress,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      connections: [],
      position: { x: 0, y: 0 }, // Will be positioned automatically by the roadmap
    });
    
    onClose();
  };
  
  return (
    <div className="modal-content">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h2>Add New Milestone</h2>
          <button
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter milestone title"
              required
              className="form-control"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter milestone description"
              className="form-control"
              rows={3}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group form-group-half">
              <label htmlFor="icon">Icon</label>
              <div className="icon-selector">
                <div 
                  className="selected-icon"
                  style={{
                    backgroundColor: color,
                    fontSize: '24px',
                  }}
                >
                  {icon}
                </div>
                <div className="icon-options">
                  {commonIcons.map((iconOption) => (
                    <button
                      key={iconOption}
                      type="button"
                      className={`icon-option ${icon === iconOption ? 'active' : ''}`}
                      onClick={() => setIcon(iconOption)}
                    >
                      {iconOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-group form-group-half">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="form-control color-picker"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
              className="form-control"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {status === 'in-progress' && (
            <div className="form-group">
              <label htmlFor="progress">Progress ({progress}%)</label>
              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="form-control progress-slider"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="dueDate">Due Date (Optional)</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tags-container">
              {availableTags.map((tag) => (
                <div 
                  key={tag}
                  className={`tag-option ${tags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              Add Milestone
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MilestoneForm; 