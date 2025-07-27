import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Roadmap, Milestone } from '../../types';
import { getMilestonePath } from '../../utils';
import MilestoneNode from '../milestone/MilestoneNode';

interface RoadmapCanvasProps {
  roadmap: Roadmap;
  onClosePanels: () => void;
}

const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({ roadmap, onClosePanels }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  // Reset position when roadmap changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  }, [roadmap.id]);

  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(2, scale + delta));
    setScale(newScale);
  };

  // Handle canvas drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle canvas drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  // Handle canvas drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle milestone click
  const handleMilestoneClick = (milestoneId: string) => {
    setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
  };

  // Get the appropriate canvas layout class based on roadmap layout
  const getCanvasLayoutClass = () => {
    switch (roadmap.layout) {
      case 'tree':
        return 'canvas-layout-tree';
      case 'network':
        return 'canvas-layout-network';
      default:
        return 'canvas-layout-linear';
    }
  };

  return (
    <div
      className="roadmap-canvas"
      onClick={onClosePanels}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="canvas-controls">
        <button 
          className="canvas-control-btn"
          onClick={(e) => {
            e.stopPropagation();
            setScale(scale + 0.1);
          }}
        >
          +
        </button>
        <button 
          className="canvas-control-btn"
          onClick={(e) => {
            e.stopPropagation();
            setScale(Math.max(0.5, scale - 0.1));
          }}
        >
          -
        </button>
        <button 
          className="canvas-control-btn"
          onClick={(e) => {
            e.stopPropagation();
            setPosition({ x: 0, y: 0 });
            setScale(1);
          }}
        >
          Reset
        </button>
      </div>

      <div
        ref={canvasRef}
        className={`canvas-content ${getCanvasLayoutClass()} ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      >
        {/* Draw connection paths between milestones */}
        <svg className="connections-layer">
          {roadmap.milestones.map((milestone) =>
            milestone.connections.map((connection) => {
              const targetMilestone = roadmap.milestones.find((m) => m.id === connection.to);
              if (!targetMilestone) return null;

              return (
                <motion.path
                  key={`${milestone.id}-${connection.to}`}
                  d={getMilestonePath(milestone, targetMilestone, roadmap.layout)}
                  stroke={milestone.color}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={roadmap.layout === 'network' ? '5,5' : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="milestone-connection"
                />
              );
            })
          )}
        </svg>

        {/* Render milestone nodes */}
        <div className="milestones-layer">
          {roadmap.milestones.map((milestone) => (
            <MilestoneNode
              key={milestone.id}
              milestone={milestone}
              isSelected={milestone.id ? selectedMilestone === milestone.id : false}
              onClick={() => milestone.id && handleMilestoneClick(milestone.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapCanvas; 