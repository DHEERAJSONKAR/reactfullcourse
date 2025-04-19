import './ScoreBoard.css';

function ScoreBoard({ scores, vsComputer }) {
    return (
        <div className="scoreboard">
            <div className="score-item player-x">
                <span className="player-label">{vsComputer ? 'You (X)' : 'X'}</span>
                <span className="score-value">{scores.x}</span>
            </div>
            <div className="score-item player-draw">
                <span className="player-label">Draw</span>
                <span className="score-value">{scores.draw}</span>
            </div>
            <div className="score-item player-o">
                <span className="player-label">{vsComputer ? 'Computer (O)' : 'O'}</span>
                <span className="score-value">{scores.o}</span>
            </div>
        </div>
    );
}

export default ScoreBoard;
