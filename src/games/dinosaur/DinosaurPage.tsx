import React, { useEffect, useRef, useState } from "react";

const DinoGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);


  const [isJumping, setIsJumping] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [obstacles, setObstacles] = useState<
  { id: number; type: "cactus" | "bird"; left: number; height: number }[]
  >([]);


  // ジャンプ処理
  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);

    let position = 0;
    const upInterval = setInterval(() => {
      if (position >= 130) {
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
    }, 1);
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

  useEffect(() => {
    if (isGameOver) return;
  
    const spawnInterval = setInterval(() => {
      const id = Date.now();
      const type = Math.random() < 0.5 ? "cactus" : "bird";
      const height = type === "bird" ? (Math.random() < 0.5 ? 80 : 120) : 0;
  
      setObstacles((prev) => [
        ...prev,
        { id, type, left: 600, height },
      ]);
    }, Math.random() * 2000 + 1000); // ★ ランダムな間隔（1000ms〜3000ms）
  
    return () => clearInterval(spawnInterval);
  }, [isGameOver]);  


  // サボテンの移動と衝突判定
  useEffect(() => {
    let cactusPosition = 600 + Math.floor(Math.random() * 400); // 600〜1000 のランダムな開始位置
    let animationFrame: number;
    let passed = false; // ★ 通過したかどうかのフラグを追加

    if (cactusPosition < -20) {
      cactusPosition = 600 + Math.floor(Math.random() * 400);
      passed = false;
    }
  
    const moveCactus = () => {
      console.log("true判定", !cactusRef.current || !dinoRef.current || isGameOver);
      if (!cactusRef.current || !dinoRef.current || isGameOver) return;
  
      cactusPosition -= 5;
      console.log("Cactus Position: ", cactusPosition);
      cactusRef.current.style.left = `${cactusPosition}px`;
  
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
        cactusPosition = 100;
        passed = false; // 新しいサボテンに向けてリセット
      }
  
      animationFrame = requestAnimationFrame(moveCactus);
    };
  
    animationFrame = requestAnimationFrame(moveCactus);
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver, score]);

  // useEffect で鳥の移動処理を追加
  useEffect(() => {
    let birdPosition = 600;
    let animationFrame: number;
    let passed = false;

    const moveBird = () => {
      if (!birdRef.current || !dinoRef.current || isGameOver) return;

      birdPosition -= 5;
      console.log("Bird Position: ", birdPosition);
      birdRef.current.style.right = `${600 - birdPosition}px`;

      const dinoBottom = parseInt(window.getComputedStyle(dinoRef.current).getPropertyValue("bottom"));

      // 衝突判定（鳥は上空を飛ぶ。例えば高さ100px前後）
      if (birdPosition < 90 && birdPosition > 50 && dinoBottom > 60) {
        setIsGameOver(true);
        return;
      }

      // 通過判定（得点加算）
      if (birdPosition < 50 && !passed) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        passed = true;
      }

      if (birdPosition < -40) {
        birdPosition = 600;
        passed = false;
      }

      animationFrame = requestAnimationFrame(moveBird);
    };

    animationFrame = requestAnimationFrame(moveBird);
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver]);

  
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
      <img
        src="/dinosaur.jpg"
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
      <img
        src="/cactus.png"
        ref={cactusRef}
        style={{
          width: 60,
          height: 40,
          position: "absolute",
          bottom: 0,
          right: -20,
        }}
        alt="Cactus"
      />
      <img
        src="/bird.png"
        ref={birdRef}
        style={{
          width: 30,
          height: 30,
          position: "absolute",
          bottom: 100, // ← 高さ（ジャンプで回避）
          right: -70,
          borderRadius: "50%",
        }}
        alt="Bird"
      />
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 10,
          fontSize: 16,
          fontWeight: "bold",
          color: "black",
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
