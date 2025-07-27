import React, { useState } from 'react';
import { Roadmap } from '../../types';

interface SidebarProps {
  roadmaps: Roadmap[];
  currentRoadmapId?: string;
  onSelectRoadmap: (roadmapId: string) => void;
  onToggleFavorite: (roadmapId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  roadmaps,
  currentRoadmapId,
  onSelectRoadmap,
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    if (filter === 'favorites') {
      return roadmap.favorited;
    }
    return true;
  });

  return (
    <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        {isExpanded ? (
          <>
            <h2 className="sidebar-title">My Roadmaps</h2>
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              title="Collapse sidebar"
            >
              ◀
            </button>
          </>
        ) : (
          <>
            <div className="sidebar-icon-only">🗺️</div>
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              title="Expand sidebar"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {isExpanded && (
        <>
          <div className="sidebar-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              Favorites
            </button>
          </div>

          <div className="sidebar-roadmaps">
            {filteredRoadmaps.length === 0 ? (
              <div className="no-roadmaps-message">
                {filter === 'favorites'
                  ? 'No favorite roadmaps yet'
                  : 'No roadmaps yet. Create your first one!'}
              </div>
            ) : (
              filteredRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className={`roadmap-item ${
                    roadmap.id === currentRoadmapId ? 'active' : ''
                  }`}
                  onClick={() => onSelectRoadmap(roadmap.id)}
                >
                  <div className="roadmap-item-content">
                    <h3 className="roadmap-item-title">{roadmap.title}</h3>
                    <div className="roadmap-item-meta">
                      <span>
                        {roadmap.milestones.length}{' '}
                        {roadmap.milestones.length === 1
                          ? 'milestone'
                          : 'milestones'}
                      </span>
                      <span>
                        {new Date(roadmap.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="favorite-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(roadmap.id);
                    }}
                    title={roadmap.favorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {roadmap.favorited ? '★' : '☆'}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar; 