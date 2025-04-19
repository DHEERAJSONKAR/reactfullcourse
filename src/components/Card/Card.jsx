import Icon from '../Icon/Icon';
import './Card.css';

function Card({ player, onClick, isWinningCell, gameOver, animationDelay, computerThinking }) {
    let icon = <Icon />
    if (player === 'x') {
        icon = <Icon name="Cross" />
    } else if (player === 'o') {
        icon = <Icon name="Circle" />
    }
    
    return (
        <div 
            className={`card ${player ? `card-${player}` : ''} 
                ${isWinningCell ? 'winning' : ''} 
                ${gameOver && !isWinningCell ? 'game-over' : ''}
                ${computerThinking ? 'thinking' : ''}`}
            onClick={onClick}
            style={{ animationDelay }}
        >
            <div className="card-content">
                {icon}
                {computerThinking && (
                    <div className="thinking-container">
                        <div className="thinking-indicator"></div>
                        <div className="thinking-indicator delay-1"></div>
                        <div className="thinking-indicator delay-2"></div>
                    </div>
                )}
            </div>
        </div>
    ) 
}

export default Card;