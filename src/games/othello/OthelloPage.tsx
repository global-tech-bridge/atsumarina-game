// src/games/othello/OthelloPage.tsx

import React, { useState } from 'react';

const BOARD_SIZE = 8;

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

const OthelloPage = () => {
  const createInitialBoard = () => {
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    return board;
  };

  const [board, setBoard] = useState(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);

  const isValid = (x: number, y: number, dx: number, dy: number, player: number) => {
    let i = x + dx;
    let j = y + dy;
    let foundOpponent = false;
    while (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE) {
      if (board[i][j] === EMPTY) return false;
      if (board[i][j] !== player) {
        foundOpponent = true;
      } else {
        return foundOpponent;
      }
      i += dx;
      j += dy;
    }
    return false;
  };

  const flipPieces = (x: number, y: number, dx: number, dy: number, player: number, newBoard: number[][]) => {
    let i = x + dx;
    let j = y + dy;
    while (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE && newBoard[i][j] !== player) {
      newBoard[i][j] = player;
      i += dx;
      j += dy;
    }
  };

  const handleClick = (x: number, y: number) => {
    if (board[x][y] !== EMPTY) return;

    let valid = false;
    const newBoard = board.map(row => [...row]);
    directions.forEach(([dx, dy]) => {
      if (isValid(x, y, dx, dy, currentPlayer)) {
        flipPieces(x, y, dx, dy, currentPlayer, newBoard);
        valid = true;
      }
    });

    if (valid) {
      newBoard[x][y] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  };

  const getColor = (cell: number) => {
    if (cell === BLACK) return 'black';
    if (cell === WHITE) return 'white';
    return 'transparent';
  };

  return (
    <div>
      <h1>オセロ</h1>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)` }}>
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleClick(i, j)}
              style={{
                width: 40,
                height: 40,
                backgroundColor: 'green',
                border: '1px solid black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: getColor(cell),
              }} />
            </div>
          ))
        )}
      </div>
      <h2 style={{ marginTop: '1rem' }}>次の手: {currentPlayer === BLACK ? '黒' : '白'}</h2>
    </div>
  );
};

export default OthelloPage;
