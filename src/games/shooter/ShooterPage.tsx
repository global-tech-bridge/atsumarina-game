import React, { useEffect, useRef, useState } from "react";

const Game = () => {
  const canvasRef = useRef(null);
  const [playerX, setPlayerX] = useState(200);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [hearts, setHearts] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(3);
  const [lastShotTime, setLastShotTime] = useState(0);
  const [boss, setBoss] = useState(null);
  const [bossBullets, setBossBullets] = useState([]);
  const [gameClear, setGameClear] = useState(false);

  const canvasWidth = 400;
  const canvasHeight = 600;
  const shotCooldown = 300;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((prev) => Math.max(prev - 20, 0));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((prev) => Math.min(prev + 20, canvasWidth - 40));
      } else if (e.key === " ") {
        const now = Date.now();
        if (now - lastShotTime >= shotCooldown) {
          setBullets((prev) => [...prev, { x: playerX + 15, y: 500 }]);
          setLastShotTime(now);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerX, lastShotTime]);

  useEffect(() => {
    if (score >= 1000 && !boss) {
      setBoss({ x: 150, y: 50, hp: 10, direction: 1 });
    }
  }, [score, boss]);

  useEffect(() => {
    const bossFireInterval = setInterval(() => {
      if (boss && isRunning && !gameClear) {
        setBossBullets((prev) => [
          ...prev,
          { x: boss.x + 45, y: boss.y + 50 },
        ]);
      }
    }, 1500);
    return () => clearInterval(bossFireInterval);
  }, [boss, isRunning, gameClear]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning || life <= 0 || gameClear) return;

      setBullets((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 10 })).filter((b) => b.y > 0)
      );

      setBossBullets((prevBullets) => {
        const updated = [];
        for (const bullet of prevBullets) {
          const newY = bullet.y + 5;
          const hitPlayer =
            newY + 10 > 520 &&
            newY < 560 &&
            bullet.x + 5 > playerX &&
            bullet.x < playerX + 40;

          if (hitPlayer) {
            setLife((prev) => {
              const newLife = prev - 1;
              if (newLife <= 0) setIsRunning(false);
              return Math.max(0, newLife);
            });
            continue;
          }

          if (newY < canvasHeight) {
            updated.push({ x: bullet.x, y: newY });
          }
        }
        return updated;
      });

      setEnemies((prev) => {
        const updated = [];
        for (const e of prev) {
          const newY = e.y + 5;
          const hitPlayer =
            newY + 30 > 520 && newY < 560 && e.x + 30 > playerX && e.x < playerX + 40;
          if (hitPlayer || newY > canvasHeight) {
            setLife((prevLife) => {
              const newLife = prevLife - 1;
              if (newLife <= 0) setIsRunning(false);
              return Math.max(0, newLife);
            });
            continue;
          }
          updated.push({ ...e, y: newY });
        }
        return updated;
      });

      if (boss) {
        setBoss((prev) => {
          let newX = prev.x + prev.direction * 2;
          let newDir = prev.direction;
          if (newX < 0 || newX > canvasWidth - 100) {
            newDir *= -1;
            newX = Math.max(0, Math.min(newX, canvasWidth - 100));
          }
          return { ...prev, x: newX, direction: newDir };
        });
      }

      setBullets((prevBullets) => {
        const updatedBullets = [];
        let updatedEnemies = [...enemies];
        for (const bullet of prevBullets) {
          let hit = false;
          for (let i = 0; i < updatedEnemies.length; i++) {
            const enemy = updatedEnemies[i];
            if (
              bullet.x < enemy.x + 30 &&
              bullet.x + 5 > enemy.x &&
              bullet.y < enemy.y + 30 &&
              bullet.y + 10 > enemy.y
            ) {
              updatedEnemies.splice(i, 1);
              setEnemies(updatedEnemies);
              setScore((prev) => prev + 100);
              hit = true;
              break;
            }
          }

          if (!hit) {
            if (boss &&
              bullet.x < boss.x + 100 &&
              bullet.x + 5 > boss.x &&
              bullet.y < boss.y + 50 &&
              bullet.y + 10 > boss.y) {
              setBoss((prev) => {
                const newHp = prev.hp - 1;
                if (newHp <= 0) {
                  setScore((s) => s + 1000);
                  setGameClear(true);
                  setIsRunning(false);
                  return null;
                }
                return { ...prev, hp: newHp };
              });
              continue;
            }
            updatedBullets.push(bullet);
          }
        }
        return updatedBullets;
      });

      setHearts((prev) => {
        const updated = [];
        for (const heart of prev) {
          const newY = heart.y + 4;
          const collected =
            newY + 20 > 520 &&
            newY < 560 &&
            heart.x + 20 > playerX &&
            heart.x < playerX + 40;
          if (collected) {
            setLife((prev) => Math.min(prev + 1, 3));
            continue;
          }
          if (newY <= canvasHeight) updated.push({ ...heart, y: newY });
        }
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [enemies, isRunning, life, playerX, boss, gameClear]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (isRunning && life > 0 && !gameClear) {
        setEnemies((prev) => [
          ...prev,
          { x: Math.random() * (canvasWidth - 30), y: 0 },
        ]);
      }
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [isRunning, life, gameClear]);

  useEffect(() => {
    const heartInterval = setInterval(() => {
      if (isRunning && Math.random() < 0.3 && !gameClear) {
        setHearts((prev) => [
          ...prev,
          { x: Math.random() * (canvasWidth - 20), y: 0 },
        ]);
      }
    }, 5000);
    return () => clearInterval(heartInterval);
  }, [isRunning, gameClear]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, 520, 40, 40);
    ctx.fillStyle = "red";
    bullets.forEach((b) => ctx.fillRect(b.x, b.y, 5, 10));
    ctx.fillStyle = "green";
    enemies.forEach((e) => ctx.fillRect(e.x, e.y, 30, 30));
    ctx.fillStyle = "pink";
    hearts.forEach((h) => ctx.fillRect(h.x, h.y, 20, 20));
    ctx.fillStyle = "orange";
    bossBullets.forEach((b) => ctx.fillRect(b.x, b.y, 5, 10));
    if (boss) {
      ctx.fillStyle = "purple";
      ctx.fillRect(boss.x, boss.y, 100, 50);
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(`HP: ${boss.hp}`, boss.x + 25, boss.y + 30);
    }
  });

  const resetGame = () => {
    setPlayerX(200);
    setBullets([]);
    setEnemies([]);
    setHearts([]);
    setBossBullets([]);
    setIsRunning(true);
    setScore(0);
    setLife(3);
    setLastShotTime(0);
    setBoss(null);
    setGameClear(false);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="text-lg font-bold mb-2">
        スコア: {score} / ライフ: {life}
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "2px solid black" }}
      />

      {gameClear ? (
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-green-600">🎉 ゲームクリア 🎉</div>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            もう一度プレイ
          </button>
        </div>
      ) : !isRunning && life <= 0 ? (
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-red-600">ゲームオーバー</div>
          <button
            onClick={resetGame}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            リスタート
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="mt-2 px-4 py-2 bg-gray-300 rounded"
        >
          {isRunning ? "停止" : "再開"}
        </button>
      )}
    </div>
  );
};

export default Game;