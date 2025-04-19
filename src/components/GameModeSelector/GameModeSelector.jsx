import { useState, useEffect, useRef } from 'react';
import './GameModeSelector.css';

function GameModeSelector({ vsComputer, onModeChange, difficulty, onDifficultyChange }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const difficultyMenuRef = useRef(null);
  
  // Add animation state for buttons
  const [activeButton, setActiveButton] = useState(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (difficultyMenuRef.current && !difficultyMenuRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add debouncing to prevent rapid changes
  const handleDifficultyChange = (newDifficulty) => {
    // Don't do anything if it's the same difficulty
    if (difficulty === newDifficulty) {
      setIsExpanded(false);
      return;
    }
    
    // Visual feedback for button click
    setActiveButton(newDifficulty);
    
    // Clear after animation
    setTimeout(() => {
      setActiveButton(null);
    }, 500);
    
    // Close dropdown
    setIsExpanded(false);
    
    // Notify parent component
    onDifficultyChange(newDifficulty);
  };
  
  return (
    <div className="game-mode-selector">
      <div className="mode-toggle">
        <button 
          className={`mode-button ${!vsComputer ? 'active' : ''}`}
          onClick={() => onModeChange(false)}
        >
          👥 2 Players
        </button>
        <button 
          className={`mode-button ${vsComputer ? 'active' : ''}`}
          onClick={() => onModeChange(true)}
        >
          🤖 VS Computer
        </button>
      </div>
      
      {vsComputer && (
        <div className="difficulty-selector" ref={difficultyMenuRef}>
          <button 
            className="difficulty-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {isExpanded ? '▲' : '▼'}
          </button>
          
          {isExpanded && (
            <div className="difficulty-options">
              <button 
                className={`difficulty-option ${difficulty === 'easy' ? 'active' : ''} ${activeButton === 'easy' ? 'clicked' : ''}`}
                onClick={() => handleDifficultyChange('easy')}
              >
                Easy 😊
              </button>
              <button 
                className={`difficulty-option ${difficulty === 'medium' ? 'active' : ''} ${activeButton === 'medium' ? 'clicked' : ''}`}
                onClick={() => handleDifficultyChange('medium')}
              >
                Medium 🧠
              </button>
              <button 
                className={`difficulty-option ${difficulty === 'hard' ? 'active' : ''} ${activeButton === 'hard' ? 'clicked' : ''}`}
                onClick={() => handleDifficultyChange('hard')}
              >
                Hard 😈
              </button>
            </div>
          )}
        </div>
      )}
      
      {vsComputer && (
        <div className="difficulty-indicators">
          <span 
            className={`difficulty-indicator ${difficulty === 'easy' ? 'active' : ''}`} 
            title="Easy"
            onClick={() => handleDifficultyChange('easy')}
          ></span>
          <span 
            className={`difficulty-indicator ${difficulty === 'medium' ? 'active' : ''}`} 
            title="Medium"
            onClick={() => handleDifficultyChange('medium')}
          ></span>
          <span 
            className={`difficulty-indicator ${difficulty === 'hard' ? 'active' : ''}`} 
            title="Hard"
            onClick={() => handleDifficultyChange('hard')}
          ></span>
        </div>
      )}
    </div>
  );
}

export default GameModeSelector;
