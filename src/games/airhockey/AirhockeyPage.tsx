import React, { useEffect, useRef, useState } from "react";

const AirhockeyGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);

const AirHockey: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const width = 600;
  const height = 400;

  const paddleRadius = 30;
  const puckRadius = 15;

  const player = { x: width / 2, y: height - 50 };
  const ai = { x: width / 2, y: 50 };
  const puck = {
    x: width / 2,
    y: height / 2,
    vx: 3,
    vy: 3,
  };

  const keys = { ArrowLeft: false, ArrowRight: false };

  const resetPuck = () => {
    puck.x = width / 2;
    puck.y = height / 2;
    puck.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
    puck.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    // Table
    ctx.fillStyle = "#0a0";
    ctx.fillRect(0, 0, width, height);

    // Center line
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Player paddle
    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(player.x, player.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    // AI paddle
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.arc(ai.x, ai.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Puck
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(puck.x, puck.y, puckRadius, 0, Math.PI * 2);
    ctx.fill();

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`You: ${playerScore}`, 20, height - 20);
    ctx.fillText(`AI: ${aiScore}`, 20, 30);
  };

  const gameLoop = () => {
    // Move player
    if (keys.ArrowLeft) player.x -= 5;
    if (keys.ArrowRight) player.x += 5;
    player.x = Math.max(paddleRadius, Math.min(width - paddleRadius, player.x));

    // AI follows puck
    ai.x += (puck.x - ai.x) * 0.05;
    ai.x = Math.max(paddleRadius, Math.min(width - paddleRadius, ai.x));

    // Move puck
    puck.x += puck.vx;
    puck.y += puck.vy;

    // Wall bounce
    if (puck.x < puckRadius || puck.x > width - puckRadius) puck.vx *= -1;

    // Goal
    if (puck.y < 0) {
      setPlayerScore((s) => s + 1);
      resetPuck();
    } else if (puck.y > height) {
      setAiScore((s) => s + 1);
      resetPuck();
    }

    // Collision with player
    const checkCollision = (cx: number, cy: number) => {
      const dx = puck.x - cx;
      const dy = puck.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < paddleRadius + puckRadius) {
        const angle = Math.atan2(dy, dx);
        puck.vx = 4 * Math.cos(angle);
        puck.vy = 4 * Math.sin(angle);
      }
    };
    checkCollision(player.x, player.y);
    checkCollision(ai.x, ai.y);

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);

    requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys[e.key] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys[e.key] = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Air Hockey</h2>
      <canvas ref={canvasRef} width={width} height={height} />
      <p>Use Left/Right arrows to move</p>
    </div>
  );
};

  return (
    <div ref={gameRef}>
      <AirHockey />
    </div>
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const width = 600;
  const height = 400;

  const paddleRadius = 30;
  const puckRadius = 15;

  const player = { x: width / 2, y: height - 50 };
  const ai = { x: width / 2, y: 50 };
  const puck = {
    x: width / 2,
    y: height / 2,
    vx: 3,
    vy: 3,
  };

  const keys = { ArrowLeft: false, ArrowRight: false };

  const resetPuck = () => {
    puck.x = width / 2;
    puck.y = height / 2;
    puck.vx = (Math.random() > 0.5 ? 1 : -1) * 3;
    puck.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    // Table
    ctx.fillStyle = "#0a0";
    ctx.fillRect(0, 0, width, height);

    // Center line
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Player paddle
    ctx.beginPath();
    ctx.fillStyle = "#00f";
    ctx.arc(player.x, player.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    // AI paddle
    ctx.beginPath();
    ctx.fillStyle = "#f00";
    ctx.arc(ai.x, ai.y, paddleRadius, 0, Math.PI * 2);
    ctx.fill();

    // Puck
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(puck.x, puck.y, puckRadius, 0, Math.PI * 2);
    ctx.fill();

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText(`You: ${playerScore}`, 20, height - 20);
    ctx.fillText(`AI: ${aiScore}`, 20, 30);
  };

  const gameLoop = () => {
    // Move player
    if (keys.ArrowLeft) player.x -= 5;
    if (keys.ArrowRight) player.x += 5;
    player.x = Math.max(paddleRadius, Math.min(width - paddleRadius, player.x));

    // AI follows puck
    ai.x += (puck.x - ai.x) * 0.05;
    ai.x = Math.max(paddleRadius, Math.min(width - paddleRadius, ai.x));

    // Move puck
    puck.x += puck.vx;
    puck.y += puck.vy;

    // Wall bounce
    if (puck.x < puckRadius || puck.x > width - puckRadius) puck.vx *= -1;

    // Goal
    if (puck.y < 0) {
      setPlayerScore((s) => s + 1);
      resetPuck();
    } else if (puck.y > height) {
      setAiScore((s) => s + 1);
      resetPuck();
    }

    // Collision with player
    const checkCollision = (cx: number, cy: number) => {
      const dx = puck.x - cx;
      const dy = puck.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < paddleRadius + puckRadius) {
        const angle = Math.atan2(dy, dx);
        puck.vx = 4 * Math.cos(angle);
        puck.vy = 4 * Math.sin(angle);
      }
    };
    checkCollision(player.x, player.y);
    checkCollision(ai.x, ai.y);

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);

    requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys[e.key] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keys[e.key] = false;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Air Hockey</h2>
      <canvas ref={canvasRef} width={width} height={height} />
      <p>Use Left/Right arrows to move</p>
    </div>
  );
};

export default AirhockeyGame;