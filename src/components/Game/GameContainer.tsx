
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GameScene from './GameScene';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('chocoDashHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('chocoDashHighScore', score.toString());
    }
    
    // Update scoreRef to keep it in sync with score state
    scoreRef.current = score;
  }, [score, highScore]);

  useEffect(() => {
    // Update livesRef to keep it in sync with lives state
    livesRef.current = lives;
    
    // End game if lives reach zero
    if (lives <= 0 && gameState === 'playing') {
      setGameState('gameover');
    }
  }, [lives, gameState]);

  const handleStartGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const handleCollectSyringe = () => {
    // Restore 1 life, up to a maximum of 3
    setLives(prevLives => Math.min(3, prevLives + 1));
  };
  
  const handleCollectApple = () => {
    // Increase score by 10 points
    setScore(prevScore => prevScore + 10);
  };

  const handleHitObstacle = () => {
    setLives(prevLives => prevLives - 1);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 70 }}>
        {gameState === 'playing' && (
          <GameScene 
            onCollectSyringe={handleCollectSyringe}
            onCollectApple={handleCollectApple}
            onHitObstacle={handleHitObstacle}
            onGameOver={handleGameOver}
            lives={lives}
          />
        )}
      </Canvas>

      {gameState === 'start' && (
        <StartScreen onStartGame={handleStartGame} highScore={highScore} />
      )}

      {gameState === 'playing' && (
        <HUD score={score} highScore={highScore} lives={lives} />
      )}

      {gameState === 'gameover' && (
        <GameOverScreen 
          score={score} 
          highScore={highScore} 
          onRestart={handleStartGame} 
        />
      )}
    </div>
  );
};

export default GameContainer;
