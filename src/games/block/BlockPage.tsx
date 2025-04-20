import React, { useEffect, useState } from "react";
import "./App.css";

const ROWS = 20;
const COLS = 10;

const createEmptyGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// ブロック形状（シンプルに1x1、2x1、1x2）
const SHAPES = [
  [[1]], // 小ブロック
  [[1, 1]], // 横2
  [[1], [1]], // 縦2
];

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentBlock, setCurrentBlock] = useState(generateBlock());

  // ブロック生成
  function generateBlock() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, x: 4, y: 0 };
  }

  // ブロックを落とす処理
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlock((prev) => {
        const { shape, x, y } = prev;
        if (checkCollision(shape, x, y + 1)) {
          // ブロックを固定
          const newGrid = placeBlock(grid, shape, x, y);
          const cleared = clearFullRows(newGrid);
          setGrid(cleared);
          return generateBlock();
        } else {
          return { ...prev, y: y + 1 };
        }
      });
    }, 500);
    return () => clearInterval(interval);
  }, [grid]);

  function checkCollision(shape, x, y) {
    return shape.some((row, dy) =>
      row.some(
        (cell, dx) =>
          cell &&
          (grid[y + dy]?.[x + dx] === 1 || y + dy >= ROWS || x + dx < 0 || x + dx >= COLS)
      )
    );
  }

  function placeBlock(grid, shape, x, y) {
    const newGrid = grid.map((row) => [...row]);
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) newGrid[y + dy][x + dx] = 1;
      });
    });
    return newGrid;
  }

  function clearFullRows(grid) {
    const newGrid = grid.filter((row) => row.some((cell) => cell === 0));
    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(0));
    }
    return newGrid;
  }

  // 表示用グリッドを合成（落下中ブロック + 固定済み）
  const displayGrid = grid.map((row) => [...row]);
  currentBlock.shape.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      if (cell && currentBlock.y + dy < ROWS && currentBlock.x + dx < COLS) {
        displayGrid[currentBlock.y + dy][currentBlock.x + dx] = 2;
      }
    });
  });

  return (
    <div className="App">
      <h2>🧱 React ブロック落下ゲーム</h2>
      <div className="grid">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`cell ${cell === 1 ? "fixed" : cell === 2 ? "falling" : ""}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
