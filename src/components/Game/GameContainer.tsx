import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import GameScene from './GameScene';
import HUD from './HUD';
import GameOverScreen from './GameOverScreen';
import StartScreen from './StartScreen';
import RegistrationScreen from './RegistrationScreen';
import { useIsMobile } from '@/hooks/use-mobile';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'register' | 'start' | 'playing' | 'gameover'>('register');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [username, setUsername] = useState("");
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [canvasLoaded, setCanvasLoaded] = useState(false);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const isMobile = useIsMobile();
  const gameStateRef = useRef<'register' | 'start' | 'playing' | 'gameover'>('register');
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep gameStateRef in sync with gameState to avoid stale closures
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    // Log device information for debugging
    console.log("Device:", {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
      isMobile,
      userAgent: navigator.userAgent
    });
    
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('chocoDashHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, [isMobile]);

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
    setCanvasError(null);
    setCanvasLoaded(false);
    
    // Use setTimeout to ensure state updates complete before game starts
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

  const handleCanvasCreated = (state: any) => {
    console.log("Canvas created:", state);
    setCanvasLoaded(true);
  };

  const handleCanvasError = (error: any) => {
    console.error("Canvas error:", error);
    setCanvasError(error.message || "Failed to initialize 3D canvas");
  };

  // Render canvas only when playing to avoid memory issues during transitions
  return (
    <div className="w-full h-screen relative overflow-hidden" ref={canvasContainerRef}>
      {gameState === 'playing' && (
        <>
          <Canvas 
            shadows 
            camera={{ position: [0, 5, 10], fov: 70 }} 
            onCreated={handleCanvasCreated}
            onError={handleCanvasError}
            style={{ 
              width: '100%', 
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              touchAction: 'none'
            }}
          >
            <GameScene 
              onCollectSyringe={handleCollectSyringe}
              onCollectApple={handleCollectApple}
              onHitObstacle={handleHitObstacle}
              onGameOver={handleGameOver}
              lives={lives}
            /> 
            <color attach="background" args={["#333"]} />
          </Canvas>

          {!canvasLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="text-white text-lg">Loading game scene...</div>
            </div>
          )}
          
          {canvasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
              <div className="text-red-500 text-lg mb-4">Error: {canvasError}</div>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => setGameState('start')}
              >
                Return to Menu
              </button>
            </div>
          )}
        </>
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
