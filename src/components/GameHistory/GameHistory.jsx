import { useState } from 'react';
import './GameHistory.css';

function GameHistory({ history }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (history.length === 0) return null;
    
    return (
        <div className="game-history">
            <button 
                className="history-toggle" 
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? 'Hide History' : 'Show History'} ({history.length})
            </button>
            
            {isExpanded && (
                <div className="history-content">
                    <h3>Game History</h3>
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>
                                <span className="game-number">Game {index + 1}:</span> {entry}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default GameHistory;
