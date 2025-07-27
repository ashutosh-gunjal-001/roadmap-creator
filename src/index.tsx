import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RoadmapProvider } from './context/RoadmapContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <GamificationProvider>
        <RoadmapProvider>
          <App />
        </RoadmapProvider>
      </GamificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals(); 