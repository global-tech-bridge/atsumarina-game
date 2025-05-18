import React, { useEffect, useState } from "react";
import "./App.css";

const ROWS = 20;
const COLS = 10;

const createEmptyGrid = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// ブロック形状（シンプルに1x1、2x1、1x2）
const SHAPES = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
];

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentBlock, setCurrentBlock] = useState(generateBlock());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // 追加：スコア

  // ブロック生成
  function generateBlock() {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, x: 4, y: 0 };
  }

  // ブロックを落とす処理
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveBlock(0, 1); // 毎回1マス下に動かす
    }, 500);

    return () => clearInterval(interval);
  }, [grid, gameOver]);

  // キー操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      if (e.key === "a") {
        moveBlock(-1, 0); // 左
      } else if (e.key === "d") {
        moveBlock(1, 0); // 右
      } else if (e.key === "s") {
        moveBlock(0, 1); // 下
      } else if (e.key === "w") {
        rotateBlock(); // 回転
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, currentBlock, grid]);

  function moveBlock(dx, dy) {
    setCurrentBlock((prev) => {
      const { shape, x, y } = prev;
      const newX = x + dx;
      const newY = y + dy;

      if (!checkCollision(shape, newX, newY)) {
        return { ...prev, x: newX, y: newY };
      } else if (dy === 1) {
        // 下に落とせない場合 → 固定
        const newGrid = placeBlock(grid, shape, x, y);
        const { clearedGrid, linesCleared } = clearFullRows(newGrid);
        console.log("Cleared Rows:", linesCleared); // 追加：クリアした行数を表示
        if (linesCleared > 0) {
          console.log("Score:", linesCleared * 100); // 追加：スコアを表示
          setScore((prevScore) => prevScore + linesCleared * 100); // 追加：スコア加算
        }

        setGrid(clearedGrid);

        const nextBlock = generateBlock();
        if (checkCollision(nextBlock.shape, nextBlock.x, nextBlock.y)) {
          setGameOver(true); // 新しいブロック置けなかったらゲームオーバー
          return prev;
        } else {
          return nextBlock;
        }
      }

      return prev;
    });
  }

  function rotateBlock() {
    setCurrentBlock((prev) => {
      const rotatedShape = rotate(prev.shape);
      if (!checkCollision(rotatedShape, prev.x, prev.y)) {
        return { ...prev, shape: rotatedShape };
      }
      return prev;
    });
  }

  function rotate(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array.from({ length: cols }, (_, x) =>
      Array.from({ length: rows }, (_, y) => shape[rows - 1 - y][x])
    );
    return rotated;
  }

  function checkCollision(shape, x, y) {
    return shape.some((row, dy) =>
      row.some(
        (cell, dx) =>
          cell &&
          (grid[y + dy]?.[x + dx] === 1 ||
            y + dy >= ROWS ||
            x + dx < 0 ||
            x + dx >= COLS)
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
    let linesCleared = 0;
    const newGrid = grid.filter((row) => {
      const full = row.every((cell) => cell === 1);
      if (full) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newGrid.length < ROWS) {
      newGrid.unshift(Array(COLS).fill(0));
    }

    return { clearedGrid: newGrid, linesCleared };
  }

  // 表示用グリッド
  const displayGrid = grid.map((row) => [...row]);
  if (!gameOver) {
    currentBlock.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (
          cell &&
          currentBlock.y + dy < ROWS &&
          currentBlock.x + dx >= 0 &&
          currentBlock.x + dx < COLS
        ) {
          displayGrid[currentBlock.y + dy][currentBlock.x + dx] = 2;
        }
      });
    });
  }

  return (
    <div className="App">
      <h2>🧱 React ブロック落下ゲーム</h2>
      <h3>🏆 スコア: {score}</h3>
      {gameOver && <h3 style={{ color: "red" }}>🎮 GAME OVER 🎮</h3>}
      <div className="grid">
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`cell ${
                cell === 1 ? "fixed" : cell === 2 ? "falling" : ""
              }`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
