import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from './GameScene';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';
import RegistrationScreen from './RegistrationScreen';
import TouchControls from './TouchControls';
import BackgroundMusic from './BackgroundMusic';
import { useIsMobile } from '@/hooks/use-mobile';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'register' | 'start' | 'playing' | 'gameover'>('register');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [username, setUsername] = useState("");
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const isMobile = useIsMobile();
  const gameStateRef = useRef<'register' | 'start' | 'playing' | 'gameover'>('register');
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  
  // Player movement controls - referenced by TouchControls
  const [moveLeft, setMoveLeft] = useState<() => void>(() => () => {});
  const [moveRight, setMoveRight] = useState<() => void>(() => () => {});

  useEffect(() => {
    // Keep gameStateRef in sync with gameState to avoid stale closures
    gameStateRef.current = gameState;
  }, [gameState]);

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

  const handleRegistrationComplete = (registeredUsername: string) => {
    setUsername(registeredUsername);
    setGameState('start');
  };

  const handleStartGame = () => {
    // Reset game state before transitioning
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    
    // Use setTimeout to ensure state updates complete before game starts
    // This helps prevent potential DataCloneError during state transition
    setTimeout(() => {
      setGameState('playing');
      console.log("Game state changed to playing");
    }, 50); // Small delay to ensure clean transitions
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

  // Render canvas only when playing to avoid memory issues during transitions
  return (
    <div className="w-full h-screen relative">
      {/* Background Music - plays on all screens */}
      <BackgroundMusic
        url="/sounds/best-game-console-301284.mp3"
        playing={isMusicEnabled}
        volume={0.4}
      />

      {gameState === "playing" && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 70 }}>
          <GameScene
            onCollectSyringe={handleCollectSyringe}
            onCollectApple={handleCollectApple}
            onHitObstacle={handleHitObstacle}
            onGameOver={handleGameOver}
            lives={lives}
            setMoveLeft={setMoveLeft}
            setMoveRight={setMoveRight}
          />
        </Canvas>
      )}

      {gameState === "register" && (
        <RegistrationScreen
          onRegistrationComplete={handleRegistrationComplete}
        />
      )}

      {gameState === "start" && (
        <StartScreen onStartGame={handleStartGame} highScore={highScore} />
      )}

      {gameState === "playing" && (
        <>
          <HUD score={score} highScore={highScore} lives={lives} />
          {isMobile && (
            <TouchControls onSwipeLeft={moveLeft} onSwipeRight={moveRight} />
          )}
        </>
      )}

      {gameState === "gameover" && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          onRestart={handleStartGame}
          username={username}
        />
      )}
    </div>
  );
};

export default GameContainer;
