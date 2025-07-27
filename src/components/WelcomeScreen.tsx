import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onCreateRoadmap: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onCreateRoadmap }) => {
  // Animation variants for the container and items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Features of the roadmap creator
  const features = [
    {
      icon: '🗺️',
      title: 'Create Roadmaps',
      description: 'Design beautiful roadmaps with different layouts to visualize your projects and goals.'
    },
    {
      icon: '📌',
      title: 'Track Milestones',
      description: 'Break down your roadmap into achievable milestones and track your progress.'
    },
    {
      icon: '🔄',
      title: 'Flexible Layouts',
      description: 'Choose from linear, tree, or network layouts to best represent your project structure.'
    },
    {
      icon: '🎨',
      title: 'Customizable',
      description: 'Customize colors, icons, and styles to create a roadmap that matches your vision.'
    }
  ];

  return (
    <motion.div 
      className="welcome-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="welcome-screen-title" variants={itemVariants}>
        Welcome to Roadmap Creator
      </motion.h1>
      
      <motion.p className="welcome-screen-subtitle" variants={itemVariants}>
        Plan, visualize, and track your projects with beautiful interactive roadmaps
      </motion.p>
      
      <motion.div className="features-container" variants={itemVariants}>
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            className="feature-card"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.button 
        className="btn btn-primary start-button"
        variants={itemVariants}
        onClick={onCreateRoadmap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Create Your First Roadmap
      </motion.button>
    </motion.div>
  );
};

export default WelcomeScreen; 