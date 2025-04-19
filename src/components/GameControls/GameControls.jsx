import './GameControls.css';

function GameControls({ resetGame, resetScores, gameOver, vsComputer }) {
    return (
        <div className="game-controls">
            <button 
                className={`btn ${gameOver ? 'primary' : 'secondary'}`} 
                onClick={resetGame}
            >
                {gameOver ? 'Play Again' : 'Restart Game'}
            </button>
            
            <button 
                className="btn reset-scores" 
                onClick={resetScores}
            >
                Reset Scores
            </button>
            
            {vsComputer && !gameOver && (
                <button 
                    className="btn hint-btn"
                    onClick={() => alert("Tip: Try to take the center and corners first!")}
                >
                    Get Tip
                </button>
            )}
        </div>
    );
}

export default GameControls;
