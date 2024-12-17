import React, { useState, useEffect } from 'react';
import './TicTacToe.css';

type Player = 'X' | 'O' | null;

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [gameMode, setGameMode] = useState<'human' | 'robot'>('robot');
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [robotSymbol, setRobotSymbol] = useState<Player>('O');
  const [isDraw, setIsDraw] = useState(false);

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  useEffect(() => {
    // Reset board when game mode changes
    resetGame();
  }, [gameMode]);

  useEffect(() => {
    // Trigger robot move when in robot mode and it's robot's turn
    if (gameMode === 'robot' && currentPlayer !== playerSymbol && !winner && !isDraw) {
      const robotSquare = robotMove();
      handleRobotMove(robotSquare);
    }
  }, [currentPlayer, gameMode, winner, isDraw]);

  const checkWinner = (board: Player[]): Player | 'draw' => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'draw';
  };

  const robotMove = () => {
    // Smart robot with some randomness
    const emptySquares = board.reduce((acc: number[], curr, idx) => 
      curr === null ? [...acc, idx] : acc, []);

    // 70% chance of strategic move, 30% random
    if (Math.random() < 0.7) {
      // Try to win
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === robotSymbol && board[b] === robotSymbol && board[c] === null) return c;
        if (board[a] === robotSymbol && board[c] === robotSymbol && board[b] === null) return b;
        if (board[b] === robotSymbol && board[c] === robotSymbol && board[a] === null) return a;
      }

      // Block player
      for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === playerSymbol && board[b] === playerSymbol && board[c] === null) return c;
        if (board[a] === playerSymbol && board[c] === playerSymbol && board[b] === null) return b;
        if (board[b] === playerSymbol && board[c] === playerSymbol && board[a] === null) return a;
      }
    }

    // Center or random square
    if (board[4] === null) return 4;
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const handleRobotMove = (robotSquare: number) => {
    const newBoard = [...board];
    newBoard[robotSquare] = robotSymbol;
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result === 'draw') {
      setIsDraw(true);
    } else if (result) {
      setWinner(result);
    } else {
      setCurrentPlayer(playerSymbol);
    }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    
    // Human's turn
    if (gameMode === 'human' || currentPlayer === playerSymbol) {
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result === 'draw') {
        setIsDraw(true);
        return;
      } else if (result) {
        setWinner(result);
        return;
      }

      // Switch players in human mode
      if (gameMode === 'human') {
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      } else {
        // In robot mode, set current player to robot
        setCurrentPlayer(robotSymbol);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  const handleSymbolChange = (symbol: Player) => {
    if (gameMode === 'robot') {
      setPlayerSymbol(symbol);
      setRobotSymbol(symbol === 'X' ? 'O' : 'X');
      resetGame();
    }
  };

  const getCurrentTurnText = () => {
    if (winner) {
      if (gameMode === 'human') {
        return `Player ${winner} Wins!`;
      }
      return winner === playerSymbol ? 'You Win! ' : 'Robot Wins! ';
    }
    
    if (isDraw) {
      return 'It\'s a Tie!';
    }
    
    if (gameMode === 'human') {
      return `Player ${currentPlayer}'s Turn`;
    }
    
    return currentPlayer === playerSymbol ? "Your Turn" : "Robot's Turn";
  };

  return (
    <div className="game-container">
      <div className="mode-selector">
        <button 
          onClick={() => setGameMode('human')}
          className={gameMode === 'human' ? 'active' : ''}
        >
          2 Players
        </button>
        <button 
          onClick={() => setGameMode('robot')}
          className={gameMode === 'robot' ? 'active' : ''}
        >
          vs Robot
        </button>
      </div>

      {gameMode === 'robot' && (
        <div className="symbol-selector">
          <button 
            onClick={() => handleSymbolChange('X')}
            className={playerSymbol === 'X' ? 'active' : ''}
          >
            Play as X
          </button>
          <button 
            onClick={() => handleSymbolChange('O')}
            className={playerSymbol === 'O' ? 'active' : ''}
          >
            Play as O
          </button>
        </div>
      )}

      <div className="turn-display">{getCurrentTurnText()}</div>

      <div className="board">
        {board.map((square, index) => (
          <div 
            key={index} 
            className={`square ${square === 'X' ? 'x-player' : square === 'O' ? 'o-player' : ''}`}
            onClick={() => handleClick(index)}
          >
            {square}
          </div>
        ))}
      </div>

      {(winner || isDraw) && (
        <div className="winner-banner">
          {winner ? 
            (gameMode === 'human' 
              ? `Player ${winner} Wins!` 
              : (winner === playerSymbol ? 'You Win! ' : 'Robot Wins! ')) : 
            'It\'s a Tie!'
          }
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default TicTacToe;
