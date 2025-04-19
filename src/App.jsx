import './App.css'
import Grid from './components/Grid/Grid'
import { useState, useEffect, useRef } from 'react'
import ScoreBoard from './components/ScoreBoard/ScoreBoard'
import GameControls from './components/GameControls/GameControls'
import GameHistory from './components/GameHistory/GameHistory'
import Confetti from './components/Confetti/Confetti'
import GameModeSelector from './components/GameModeSelector/GameModeSelector'

function App() {
  const [gameState, setGameState] = useState({
    isXTurn: true,
    gameOver: false,
    winner: null
  });

  const [scores, setScores] = useState({
    x: 0,
    o: 0,
    draw: 0
  });

  const [history, setHistory] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [theme, setTheme] = useState('light');
  const [vsComputer, setVsComputer] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('medium'); // easy, medium, hard

  // Add a ref to track the previous difficulty
  const prevDifficultyRef = useRef(aiDifficulty);

  // Use a notification message state
  const [notification, setNotification] = useState(null);

  // Add a ref to track if we need to force reset the board
  const forceResetRef = useRef(false);

  // Update scores when game ends - add better messaging for computer wins/losses
  useEffect(() => {
    if (gameState.gameOver) {
      if (gameState.winner) {
        setScores(prev => ({
          ...prev,
          [gameState.winner]: prev[gameState.winner] + 1
        }));
        
        const winMessage = gameState.winner === 'x' 
          ? (vsComputer ? "You won!" : "Player X won!")
          : (vsComputer ? "Computer won!" : "Player O won!");
          
        setHistory(prev => [...prev, winMessage]);
        
        // Only show confetti when player wins against computer, or for any win in 2-player mode
        if (gameState.winner === 'x' || !vsComputer) {
          setShowConfetti(true);
        }
      } else {
        setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
        setHistory(prev => [...prev, "Game ended in a draw"]);
      }
    }
  }, [gameState.gameOver, gameState.winner, vsComputer]);

  // Hide confetti after 3 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Function to properly reset the game with all necessary state
  const resetGame = () => {
    setGameState({
      isXTurn: true, // Always start with player X
      gameOver: false,
      winner: null
    });
    setShowConfetti(false);
    
    // Set this flag to tell Grid component to reset completely
    forceResetRef.current = true;
    // Allow a brief delay before clearing the flag
    setTimeout(() => {
      forceResetRef.current = false;
    }, 50);
  };

  const resetScores = () => {
    setScores({ x: 0, o: 0, draw: 0 });
    setHistory([]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.body.className = theme === 'light' ? 'dark-theme' : '';
  };

  const handleGameModeChange = (isVsComputer) => {
    setVsComputer(isVsComputer);
    resetGame();
    setNotification(isVsComputer ? "Switched to VS Computer mode" : "Switched to 2 Players mode");
    
    // Clear notification after 2 seconds
    setTimeout(() => setNotification(null), 2000);
  };

  const handleDifficultyChange = (difficulty) => {
    if (difficulty === aiDifficulty) return; // No change needed
    
    setAiDifficulty(difficulty);
    resetGame();
    
    // Show notification
    setNotification(`Difficulty changed to ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`);
    
    // Clear notification after 2 seconds
    setTimeout(() => setNotification(null), 2000);
  };

  // Display text for current player with custom text for computer's turn
  const getCurrentPlayerText = () => {
    if (gameState.isXTurn) {
      return vsComputer ? 'Your turn (X)' : 'Player X';
    } else {
      return vsComputer ? 'Computer is thinking...' : 'Player O';
    }
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      {showConfetti && <Confetti />}

      <header className="game-header">
        <h1>Tic Tac Toe</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <GameModeSelector 
        vsComputer={vsComputer} 
        onModeChange={handleGameModeChange} 
        difficulty={aiDifficulty}
        onDifficultyChange={handleDifficultyChange}
      />

      {vsComputer && (
        <div className="game-mode-info">
          You are playing as X against the Computer (O) - {aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)} difficulty
        </div>
      )}
      
      {notification && (
        <div className="notification-message">
          {notification}
        </div>
      )}

      <ScoreBoard 
        scores={scores} 
        vsComputer={vsComputer}
      />

      {gameState.gameOver && (
        <div className={`game-over ${gameState.winner ? 'winner' : 'draw'}`}>
          <h2>
            {gameState.winner 
              ? `${gameState.winner.toUpperCase() === 'X' 
                  ? (vsComputer ? 'You' : 'Player X') 
                  : (vsComputer ? 'Computer' : 'Player O')} Won!` 
              : "It's a Draw!"}
          </h2>
        </div>
      )}

      {!gameState.gameOver && (
        <div className="game-info">
          <h2>
            Current Player: <span className={gameState.isXTurn ? 'player-x' : 'player-o'}>
              {getCurrentPlayerText()}
            </span>
          </h2>
        </div>
      )}

      <Grid 
        numberOfCards={9} 
        isXTurn={gameState.isXTurn} 
        gameOver={gameState.gameOver}
        setGameState={setGameState}
        winner={gameState.winner}
        vsComputer={vsComputer}
        aiDifficulty={aiDifficulty}
        forceReset={forceResetRef.current}
      />

      <GameControls 
        resetGame={resetGame} 
        resetScores={resetScores} 
        gameOver={gameState.gameOver}
        vsComputer={vsComputer}
      />

      <GameHistory history={history} />
    </div>
  )
}

export default App;
