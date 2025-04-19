import Card from "../Card/Card";
import { useState, useEffect, useRef } from "react";
import './Grid.css';

function Grid({ 
  numberOfCards, 
  isXTurn, 
  gameOver, 
  setGameState, 
  winner, 
  vsComputer, 
  aiDifficulty,
  forceReset
}) {
    const [board, setBoard] = useState(Array(numberOfCards).fill(""));
    const [winningCells, setWinningCells] = useState([]);
    const [computerThinking, setComputerThinking] = useState(false);
    
    // Track previous values to detect changes
    const prevModeRef = useRef(vsComputer);
    const prevDifficultyRef = useRef(aiDifficulty);
    const computerTimeoutRef = useRef(null);
    
    // Check for win or draw
    useEffect(() => {
        const result = checkWinner(board);
        const isDraw = !result.winner && board.every(cell => cell !== "");
        
        if (result.winner) {
            setGameState(prev => ({
                ...prev,
                gameOver: true,
                winner: result.winner
            }));
            setWinningCells(result.winningCells);
        } else if (isDraw) {
            setGameState(prev => ({
                ...prev,
                gameOver: true,
                winner: null
            }));
        }
    }, [board, setGameState]);
    
    // Reset board when game resets
    useEffect(() => {
        if (!gameOver) {
            setBoard(Array(numberOfCards).fill(""));
            setWinningCells([]);
        }
    }, [gameOver, numberOfCards]);
    
    // Force reset board when requested by parent
    useEffect(() => {
        if (forceReset) {
            // Cancel any pending computer moves
            if (computerTimeoutRef.current) {
                clearTimeout(computerTimeoutRef.current);
            }
            setBoard(Array(numberOfCards).fill(""));
            setWinningCells([]);
            setComputerThinking(false);
        }
    }, [forceReset, numberOfCards]);
    
    // Detect changes in game mode or difficulty
    useEffect(() => {
        // Only handle if something actually changed
        if (prevModeRef.current !== vsComputer || prevDifficultyRef.current !== aiDifficulty) {
            // Cancel any pending computer moves
            if (computerTimeoutRef.current) {
                clearTimeout(computerTimeoutRef.current);
                computerTimeoutRef.current = null;
            }
            
            // Reset thinking state if needed
            if (computerThinking) {
                setComputerThinking(false);
            }
            
            // Update refs
            prevModeRef.current = vsComputer;
            prevDifficultyRef.current = aiDifficulty;
        }
    }, [vsComputer, aiDifficulty, computerThinking]);
    
    // Computer move logic
    useEffect(() => {
        // Only run if it's computer's turn and no thinking already in progress
        if (vsComputer && !isXTurn && !gameOver && !computerThinking) {
            setComputerThinking(true);
            
            // Add a slight delay to make it feel more natural
            const thinkingTime = Math.random() * 800 + 700; // 700-1500ms
            
            // Store timeout reference for cleanup
            computerTimeoutRef.current = setTimeout(() => {
                // Check if the game is still in progress before making a move
                if (!gameOver) {
                    makeComputerMove();
                }
                setComputerThinking(false);
                computerTimeoutRef.current = null;
            }, thinkingTime);
            
            return () => {
                if (computerTimeoutRef.current) {
                    clearTimeout(computerTimeoutRef.current);
                    computerTimeoutRef.current = null;
                }
            };
        }
        
        // Clean up when component unmounts or dependencies change
        return () => {
            if (computerTimeoutRef.current) {
                clearTimeout(computerTimeoutRef.current);
                computerTimeoutRef.current = null;
            }
        };
    }, [vsComputer, isXTurn, gameOver, board, aiDifficulty]);
    
    const makeComputerMove = () => {
        // Double-check if the move is still valid to make
        if (gameOver || isXTurn || !vsComputer) return;
        
        // Copy the board for analysis
        const boardCopy = [...board];
        let moveIndex;
        
        // Different difficulty logic
        switch(aiDifficulty) {
            case 'hard':
                moveIndex = findBestMove(boardCopy);
                break;
            case 'medium':
                // 75% chance to make the best move, 25% to make a random move
                if (Math.random() < 0.75) {
                    moveIndex = findBestMove(boardCopy);
                } else {
                    moveIndex = findRandomEmptyCell(boardCopy);
                }
                break;
            case 'easy':
            default:
                // 25% chance to make the best move, 75% to make a random move
                if (Math.random() < 0.25) {
                    moveIndex = findBestMove(boardCopy);
                } else {
                    moveIndex = findRandomEmptyCell(boardCopy);
                }
                break;
        }
        
        // Apply the move if valid and the game is still active
        if (moveIndex !== -1 && !gameOver) {
            const newBoard = [...board];
            newBoard[moveIndex] = "o";
            setBoard(newBoard);
            
            // Toggle turn
            setGameState(prev => ({
                ...prev,
                isXTurn: true
            }));
        }
    };
    
    // Improved random cell finder - prioritize strategic positions
    const findRandomEmptyCell = (boardCopy) => {
        const emptyCells = boardCopy
            .map((cell, index) => (cell === "" ? index : -1))
            .filter(index => index !== -1);
        
        if (emptyCells.length === 0) return -1;
        
        // Prioritize center and corners slightly even in random mode
        if (emptyCells.includes(4) && Math.random() < 0.4) {
            return 4; // Center position
        }
        
        const corners = [0, 2, 6, 8].filter(idx => emptyCells.includes(idx));
        if (corners.length > 0 && Math.random() < 0.3) {
            return corners[Math.floor(Math.random() * corners.length)];
        }
        
        // Otherwise truly random
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    };
    
    // Enhanced Minimax algorithm for hard difficulty
    const findBestMove = (boardCopy) => {
        // First check if AI can win in one move
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i] === "") {
                boardCopy[i] = "o";
                if (checkWinner(boardCopy).winner === "o") {
                    return i; // Winning move found
                }
                boardCopy[i] = ""; // Undo move
            }
        }
        
        // Then check if player can win in one move and block
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i] === "") {
                boardCopy[i] = "x";
                if (checkWinner(boardCopy).winner === "x") {
                    return i; // Blocking move found
                }
                boardCopy[i] = ""; // Undo move
            }
        }
        
        // Try to take the center if available
        if (boardCopy[4] === "") {
            return 4;
        }
        
        // Try to take the corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => boardCopy[i] === "");
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
        
        // Take any available side
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(i => boardCopy[i] === "");
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }
        
        // Add fork detection - look for moves that create two winning paths
        const forkMove = findForkMove(boardCopy, "o"); // Look for AI fork
        if (forkMove !== -1) {
            return forkMove;
        }
        
        // Block opponent's potential fork
        const blockForkMove = findForkMove(boardCopy, "x");
        if (blockForkMove !== -1) {
            return blockForkMove;
        }
        
        // If no move found, pick a random cell (fallback)
        return findRandomEmptyCell(boardCopy);
    };
    
    // New function to find fork opportunities
    const findForkMove = (boardCopy, player) => {
        // For each empty cell, check if playing there would create a fork
        for (let i = 0; i < boardCopy.length; i++) {
            if (boardCopy[i] === "") {
                boardCopy[i] = player;
                // Count potential winning lines after this move
                const winningLines = countPotentialWins(boardCopy, player);
                boardCopy[i] = "";
                
                // If this creates 2+ winning paths, it's a fork
                if (winningLines >= 2) {
                    return i;
                }
            }
        }
        return -1;
    };
    
    // Helper to count potential winning lines
    const countPotentialWins = (boardCopy, player) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        let count = 0;
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            // Count lines where player has 2 positions and 3rd is empty
            const playerCells = [boardCopy[a], boardCopy[b], boardCopy[c]].filter(cell => cell === player).length;
            const emptyCells = [boardCopy[a], boardCopy[b], boardCopy[c]].filter(cell => cell === "").length;
            
            if (playerCells === 2 && emptyCells === 1) {
                count++;
            }
        }
        return count;
    };
    
    const handleCardClick = (idx) => {
        // Don't allow moves if:
        // - game is over
        // - cell already filled 
        // - it's computer's turn in VS Computer mode
        // - computer is currently "thinking"
        if (gameOver || board[idx] !== "" || (vsComputer && !isXTurn) || computerThinking) {
            return;
        }
        
        // Make player's move
        const newBoard = [...board];
        newBoard[idx] = isXTurn ? "x" : "o";
        setBoard(newBoard);
        
        // Toggle turn
        setGameState(prev => ({
            ...prev,
            isXTurn: !prev.isXTurn
        }));
    };
    
    const checkWinner = (boardState) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return { winner: boardState[a], winningCells: pattern };
            }
        }
        
        return { winner: null, winningCells: [] };
    };
    
    return (
        <div className="grid">
            {board.map((player, idx) => (
                <Card 
                    key={idx} 
                    player={player} 
                    onClick={() => handleCardClick(idx)}
                    isWinningCell={winningCells.includes(idx)}
                    gameOver={gameOver}
                    animationDelay={`${idx * 0.1}s`}
                    computerThinking={computerThinking && !player && !isXTurn}
                />
            ))}
        </div>
    );
}

export default Grid;