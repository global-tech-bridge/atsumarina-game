import React, { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 20;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 10;

const ShooterPage = () => {
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [bullets, setBullets] = useState([]);
  const [enemyY, setEnemyY] = useState(0);
  const [enemyX, setEnemyX] = useState(GAME_WIDTH / 2 - ENEMY_WIDTH / 2);
  const [enemyAlive, setEnemyAlive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  // キー操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerX((x) => Math.max(0, x - 10));
      } else if (e.key === 'ArrowRight') {
        setPlayerX((x) => Math.min(GAME_WIDTH - PLAYER_WIDTH, x + 10));
      } else if (e.key === ' ') {
        setBullets((prev) => [
          ...prev,
          { x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: GAME_HEIGHT - PLAYER_HEIGHT - BULLET_HEIGHT }
        ]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX]);

  // 弾と敵の移動処理
  useEffect(() => {
    if (gameOver || !enemyAlive) return;
    const interval = setInterval(() => {
      // 弾の移動
      setBullets((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - 10 }))
          .filter((b) => b.y > 0)
      );

      // 敵の移動
      setEnemyY((y) => y + 2);
      setEnemyX((x) => {
        const direction = Math.random() < 0.5 ? -1 : 1;
        let nextX = x + direction * 5;
        if (nextX < 0) nextX = 0;
        if (nextX > GAME_WIDTH - ENEMY_WIDTH) nextX = GAME_WIDTH - ENEMY_WIDTH;
        return nextX;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver, enemyAlive]);

  // 衝突判定
  useEffect(() => {
    if (!enemyAlive || gameOver) return;

    // 弾と敵の衝突
    bullets.forEach((bullet) => {
      if (
        bullet.x < enemyX + ENEMY_WIDTH &&
        bullet.x + BULLET_WIDTH > enemyX &&
        bullet.y < enemyY + ENEMY_HEIGHT &&
        bullet.y + BULLET_HEIGHT > enemyY
      ) {
        setEnemyAlive(false);
      }
    });

    // 自機と敵の衝突
    const playerY = GAME_HEIGHT - PLAYER_HEIGHT;
    if (
      enemyX < playerX + PLAYER_WIDTH &&
      enemyX + ENEMY_WIDTH > playerX &&
      enemyY + ENEMY_HEIGHT > playerY
    ) {
      setGameOver(true);
    }
  }, [bullets, enemyY, enemyX, enemyAlive, playerX, gameOver]);

  return (
    <div>
      <h1>シューティングゲーム</h1>
      {gameOver && <h2 style={{ color: 'red' }}>ゲームオーバー！</h2>}
      <div
        ref={gameRef}
        style={{
          position: 'relative',
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        {/* 自機 */}
        <div
          style={{
            position: 'absolute',
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
            backgroundColor: 'lime',
            bottom: 0,
            left: playerX,
          }}
        />

        {/* 敵機 */}
        {enemyAlive && (
          <div
            style={{
              position: 'absolute',
              width: ENEMY_WIDTH,
              height: ENEMY_HEIGHT,
              backgroundColor: 'red',
              top: enemyY,
              left: enemyX,
            }}
          />
        )}

        {/* 弾 */}
        {bullets.map((bullet, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: BULLET_WIDTH,
              height: BULLET_HEIGHT,
              backgroundColor: 'white',
              left: bullet.x,
              top: bullet.y,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ShooterPage;
