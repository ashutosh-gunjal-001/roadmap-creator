import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  roadmapTitle?: string;
}

const Header: React.FC<HeaderProps> = ({ roadmapTitle }) => {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo">🗺️</div>
        <h1 className="app-title">Roadmap Creator</h1>
      </div>
      
      {roadmapTitle && (
        <div className="roadmap-info">
          <h2>{roadmapTitle}</h2>
        </div>
      )}
      
      <div className="header-actions">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

export default Header; 