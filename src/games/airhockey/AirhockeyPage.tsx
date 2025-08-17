import React, { useEffect, useRef, useState } from "react";

type Difficulty = "easy" | "normal" | "hard";

const AirHockeyGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null); // ← 難易度選択状態

  const handleSelectDifficulty = (level: Difficulty) => {
    setDifficulty(level);
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {!difficulty ? (
        <>
          <h2>エアホッケー：モード選択</h2>
          <button onClick={() => handleSelectDifficulty("easy")}>かんたん</button>
          <button onClick={() => handleSelectDifficulty("normal")}>ふつう</button>
          <button onClick={() => handleSelectDifficulty("hard")}>むずかしい</button>
        </>
      ) : (
        <AirHockey difficulty={difficulty} />
      )}
    </div>
  );
};

const AirHockey: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const playerScoreRef = useRef(0);
  const aiScoreRef = useRef(0);

  const width = 600;
  const height = 400;

  const paddleRadius = 30;
  const puckRadius = 15;
  
  const player = useRef({ x: width / 2, y: height - 50 });
  const ai = useRef({ x: width / 2, y: 50 });
  

  const puck = useRef({
    x: width / 2,
    y: height / 2,
    vx: 3,
    vy: 3,
  });

  const keys = { ArrowLeft: false, ArrowRight: false };

  // 難易度に応じた AI のスピード
  const aiSpeed =
    difficulty === "easy" ? 0.02 : difficulty === "normal" ? 0.05 : 0.09;

const getPuckSpeed = () => {
  switch (difficulty) {
    case "easy":
      return 2;
    case "normal":
      return 3;
    case "hard":
      return 5;
    default:
      return 3;
  }
};

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys[e.key] = true;
    if (e.code === "Space") setIsRunning(true);
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") keys[e.key] = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  let animationId: number;
  const loop = () => {
    gameLoop();
    animationId = requestAnimationFrame(loop);
  };
  animationId = requestAnimationFrame(loop); // 無限ループで呼び続ける

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    cancelAnimationFrame(animationId);
  };
}, []);

useEffect(() => {
  if (!isRunning) return;

  let animationId: number;

  const loop = () => {
    gameLoop();
    animationId = requestAnimationFrame(loop);
  };
  animationId = requestAnimationFrame(loop);

  return () => cancelAnimationFrame(animationId);
}, [isRunning]); // ← isRunning が true の時だけループ開始


const resetPuck = () => {
  const speed = getPuckSpeed();
  puck.current.x = width / 2;
  puck.current.y = height / 2;
  const angle = Math.random() * Math.PI * 2;
  puck.current.vx = Math.cos(angle) * speed;
  puck.current.vy = Math.sin(angle) * speed;

  setIsRunning(false); // ← 次のスペースキーまで待つ
};

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#0a0";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(player.current.x, player.current.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.arc(ai.current.x, ai.current.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(puck.current.x, puck.current.y, puckRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`あなた: ${playerScoreRef.current}`, 20, height - 20);
    ctx.fillText(`AI: ${aiScoreRef.current}`, 20, 30);
  };
  const checkCollision = (cx: number, cy: number) => {
    const dx = puck.current.x - cx;
    const dy = puck.current.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < paddleRadius + puckRadius) {
      const angle = Math.atan2(dy, dx);
      const speed = getPuckSpeed();
      puck.current.vx = speed * Math.cos(angle);
      puck.current.vy = speed * Math.sin(angle);
    }
  };  

  const gameLoop = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
  
    ctx.clearRect(0, 0, width, height);
  
    // フィールドを描画（常に描画）
    draw(ctx);
  
    // プレイ中の処理（isRunning が true のときだけ）
    if (isRunning) {
      // プレイヤー操作
      if (keys.ArrowLeft) player.current.x -= 5;
      if (keys.ArrowRight) player.current.x += 5;
      player.current.x = Math.max(paddleRadius, Math.min(width - paddleRadius, player.current.x));

      ai.current.x += (puck.current.x - ai.current.x) * aiSpeed;
      ai.current.x = Math.max(paddleRadius, Math.min(width - paddleRadius, ai.current.x));

      // パックの移動
      puck.current.x += puck.current.vx;
      puck.current.y += puck.current.vy;
  
      // 壁の反射
      if (puck.current.x < puckRadius || puck.current.x > width - puckRadius)
        puck.current.vx *= -1;
  
      // ゴール判定
      if (puck.current.y < 0) {
        playerScoreRef.current += 1;
        setPlayerScore(playerScoreRef.current);
        resetPuck();
        return;
      } else if (puck.current.y > height) {
        aiScoreRef.current += 1;
        setAiScore(aiScoreRef.current);
        resetPuck();
        return;
      }
  
      // パドルとの当たり判定
      checkCollision(player.current.x, player.current.y);
      checkCollision(ai.current.x, ai.current.y);      
    } else {
      // 一時停止中のテキスト表示
      ctx.fillStyle = "#fff";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("スペースキーでスタート", width / 2, height / 2);
    }
  
    requestAnimationFrame(gameLoop);
  };
  
  // Removed duplicate gameLoop declaration
  


  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>エアホッケー（{difficulty === "easy" ? "かんたん" : difficulty === "normal" ? "ふつう" : "むずかしい"}）</h2>
      <canvas ref={canvasRef} width={width} height={height} />
      <p>← → キーで操作</p>
    </div>
  );
};

export default AirHockeyGame;
