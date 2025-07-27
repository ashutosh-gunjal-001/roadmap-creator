import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoadmap } from '../../context/RoadmapContext';
import { useTheme } from '../../context/ThemeContext';
import { RoadmapLayout } from '../../types';

interface RoadmapFormProps {
  onClose: () => void;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ onClose }) => {
  const { createRoadmap } = useRoadmap();
  const { isDarkMode } = useTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState<RoadmapLayout>('linear');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    createRoadmap({
      title,
      description,
      layout,
      milestones: [],
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
          <h2>Create New Roadmap</h2>
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
              placeholder="Enter roadmap title"
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
              placeholder="Enter roadmap description"
              className="form-control"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Layout Style</label>
            <div className="layout-options">
              <div className="layout-option">
                <input
                  type="radio"
                  id="linear"
                  name="layout"
                  value="linear"
                  checked={layout === 'linear'}
                  onChange={() => setLayout('linear')}
                />
                <label htmlFor="linear">
                  <div className="layout-preview linear-preview">
                    <span>Linear Path</span>
                    <div className="layout-preview-icon">🛣️</div>
                  </div>
                </label>
              </div>
              
              <div className="layout-option">
                <input
                  type="radio"
                  id="tree"
                  name="layout"
                  value="tree"
                  checked={layout === 'tree'}
                  onChange={() => setLayout('tree')}
                />
                <label htmlFor="tree">
                  <div className="layout-preview tree-preview">
                    <span>Tree View</span>
                    <div className="layout-preview-icon">🌳</div>
                  </div>
                </label>
              </div>
              
              <div className="layout-option">
                <input
                  type="radio"
                  id="network"
                  name="layout"
                  value="network"
                  checked={layout === 'network'}
                  onChange={() => setLayout('network')}
                />
                <label htmlFor="network">
                  <div className="layout-preview network-preview">
                    <span>Network</span>
                    <div className="layout-preview-icon">🕸️</div>
                  </div>
                </label>
              </div>
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
              Create Roadmap
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RoadmapForm; 