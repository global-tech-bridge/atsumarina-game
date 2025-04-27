import React, { useEffect, useRef, useState } from "react";

const DinoGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLDivElement>(null);

  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // ジャンプ処理
  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);

    let position = 0;
    const upInterval = setInterval(() => {
      if (position >= 100) {
        clearInterval(upInterval);
        const downInterval = setInterval(() => {
          if (position <= 0) {
            clearInterval(downInterval);
            setIsJumping(false);
          } else {
            position -= 5;
            if (dinoRef.current) {
              dinoRef.current.style.bottom = `${position}px`;
            }
          }
        }, 10);
      } else {
        position += 5;
        if (dinoRef.current) {
          dinoRef.current.style.bottom = `${position}px`;
        }
      }
    }, 10);
  };

  // キー入力
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isGameOver) {
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, isJumping]);

  const scoreRef = useRef(0); // ★ スコア用のrefを追加！


  // サボテンの移動と衝突判定
  useEffect(() => {
    let cactusPosition = 600;
    let animationFrame: number;
    let passed = false; // ★ 通過したかどうかのフラグを追加
  
    const moveCactus = () => {
      if (!cactusRef.current || !dinoRef.current || isGameOver) return;
  
      cactusPosition -= 5;
      cactusRef.current.style.right = `${600 - cactusPosition}px`;
  
      const dinoBottom = parseInt(window.getComputedStyle(dinoRef.current).getPropertyValue("bottom"));
  
      // 衝突判定
      if (cactusPosition < 90 && cactusPosition > 50 && dinoBottom < 40) {
        setIsGameOver(true);
        return;
      }
  
      // ★ 通過判定
      if (cactusPosition < 50 && !passed) {
        scoreRef.current += 1;       // ★ 最新スコアをrefで更新
        setScore(scoreRef.current);  // ★ 画面描画用にstateも更新
        console.log("Score: ", scoreRef.current);
        passed = true;
      }

      if (cactusPosition < -20) {
        cactusPosition = 600;
        passed = false; // 新しいサボテンに向けてリセット
      }
  
      animationFrame = requestAnimationFrame(moveCactus);
    };
  
    animationFrame = requestAnimationFrame(moveCactus);
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver, score]);
  
  return (
    <div
      ref={gameRef}
      style={{
        width: 600,
        height: 200,
        border: "2px solid #333",
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        margin: "0 auto",
      }}
    >
      <div
        ref={dinoRef}
        style={{
          width: 40,
          height: 40,
          backgroundColor: "green",
          position: "absolute",
          bottom: 0,
          left: 50,
          transition: "bottom 0.1s",
        }}
      />
      <div
        ref={cactusRef}
        style={{
          width: 20,
          height: 40,
          backgroundColor: "red",
          position: "absolute",
          bottom: 0,
          right: -20,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 10,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        Score: {score}
      </div>
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 24,
            fontWeight: "bold",
            color: "red",
          }}
        >
          ゲームオーバー
        </div>
      )}
    </div>
  );
};

export default DinoGame;
