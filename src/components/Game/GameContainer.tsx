import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from './GameScene';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';
import RegistrationScreen from './RegistrationScreen';
import TouchControls from './TouchControls';
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
      {gameState === 'playing' && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 70 }}>
          {/* <GameScene 
            onCollectSyringe={handleCollectSyringe}
            onCollectApple={handleCollectApple}
            onHitObstacle={handleHitObstacle}
            onGameOver={handleGameOver}
            lives={lives}
          /> */}
          <color attach="background" args={["#333"]} />
        </Canvas>
      )}

      {gameState === 'register' && (
        <RegistrationScreen onRegistrationComplete={handleRegistrationComplete} />
      )}

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
          username={username} 
        />
      )}

      {/* Enhanced touch controls instructions for mobile devices */}
      {isMobile && gameState === 'playing' && (
        <div className="fixed bottom-10 left-0 right-0 text-center text-white text-xl bg-black bg-opacity-80 py-4 z-50 mx-auto pointer-events-none animate-pulse-glow">
          Swipe left or right to move
        </div>
      )}
    </div>
  );
};

export default GameContainer;
