import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { RoadmapProvider, useRoadmap } from './context/RoadmapContext';
import RoadmapCanvas from './components/roadmap/RoadmapCanvas';
import RoadmapForm from './components/roadmap/RoadmapForm';
import MilestoneForm from './components/milestone/MilestoneForm';
import WelcomeScreen from './components/ui/WelcomeScreen';
import Header from './components/ui/Header';
import Sidebar from './components/ui/Sidebar';

// Main content component to handle the application logic
const MainContent: React.FC = () => {
  const { roadmaps, currentRoadmap } = useRoadmap();
  const [showRoadmapForm, setShowRoadmapForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);

  const handleCreateRoadmap = () => {
    setShowRoadmapForm(true);
  };

  const handleAddMilestone = () => {
    setShowMilestoneForm(true);
  };

  const handleClosePanels = () => {
    setShowRoadmapForm(false);
    setShowMilestoneForm(false);
  };

  if (roadmaps.length === 0 && !showRoadmapForm) {
    return <WelcomeScreen onCreateRoadmap={handleCreateRoadmap} />;
  }

  return (
    <>
      {showRoadmapForm && (
        <RoadmapForm onClose={handleClosePanels} />
      )}

      {showMilestoneForm && (
        <MilestoneForm onClose={handleClosePanels} />
      )}

      <div className="roadmap-toolbar">
        <div className="roadmap-actions">
          <button className="btn btn-primary" onClick={handleAddMilestone}>
            Add Milestone
          </button>
        </div>
      </div>

      {currentRoadmap ? (
        <RoadmapCanvas roadmap={currentRoadmap} onClosePanels={handleClosePanels} />
      ) : (
        <div className="select-roadmap-prompt">
          <h2>Select a roadmap from the sidebar or create a new one</h2>
          <button className="btn btn-primary" onClick={handleCreateRoadmap}>
            Create New Roadmap
          </button>
        </div>
      )}
    </>
  );
};

// Header components with RoadmapContext
const HeaderWithContext: React.FC = () => {
  const { currentRoadmap } = useRoadmap();
  return <Header roadmapTitle={currentRoadmap?.title} />;
};

// Sidebar with RoadmapContext
const SidebarWithContext: React.FC = () => {
  const { roadmaps, currentRoadmap, setCurrentRoadmap, toggleFavorite } = useRoadmap();
  
  return (
    <Sidebar
      roadmaps={roadmaps}
      currentRoadmapId={currentRoadmap?.id}
      onSelectRoadmap={setCurrentRoadmap}
      onToggleFavorite={toggleFavorite}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <RoadmapProvider>
        <div className="app">
          <HeaderWithContext />
          <div className="app-container">
            <SidebarWithContext />
            <div className="main-content">
              <MainContent />
            </div>
          </div>
        </div>
      </RoadmapProvider>
    </ThemeProvider>
  );
}

export default App; 