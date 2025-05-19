
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
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import DiabetesCheckDialog from './DiabetesCheckDialog';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<'register' | 'start' | 'playing' | 'gameover' | 'paused'>('register');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [username, setUsername] = useState("");
  const scoreRef = useRef(0);
  const isMobile = useIsMobile();
  const gameStateRef = useRef<'register' | 'start' | 'playing' | 'gameover' | 'paused'>('register');
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [musicInitialized, setMusicInitialized] = useState(false);
  const backgroundMusicRef = useRef<any>(null);
  const initAudioRef = useRef<(() => void) | null>(null);
  const [showDiabetesCheck, setShowDiabetesCheck] = useState(false);
  const diabetesCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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

  // Set up diabetes check timer when the game is playing
  useEffect(() => {
    if (gameState === 'playing') {
      // Clear any existing timer
      if (diabetesCheckTimerRef.current) {
        clearTimeout(diabetesCheckTimerRef.current);
      }
      
      // Set new timer for 60 seconds (60000ms)
      diabetesCheckTimerRef.current = setTimeout(() => {
        // Pause the game and show diabetes check dialog
        setGameState('paused');
        setShowDiabetesCheck(true);
      }, 60000);
    }
    
    // Clean up timer when game state changes
    return () => {
      if (diabetesCheckTimerRef.current) {
        clearTimeout(diabetesCheckTimerRef.current);
        diabetesCheckTimerRef.current = null;
      }
    };
  }, [gameState]);

  const handleRegistrationComplete = (registeredUsername: string) => {
    setUsername(registeredUsername);
    setGameState('start');
  };

  const handleStartGame = () => {
    // Reset game state before transitioning
    setScore(0);
    scoreRef.current = 0;
    
    // Use setTimeout to ensure state updates complete before game starts
    // This helps prevent potential DataCloneError during state transition
    setTimeout(() => {
      setGameState('playing');
      console.log("Game state changed to playing");
    }, 50); // Small delay to ensure clean transitions
    
    // Initialize music on first user interaction
    if (!musicInitialized && initAudioRef.current) {
      initAudioRef.current();
      setMusicInitialized(true);
    }
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };
  
  // Updated handlers to match the new scoring system
  const handleCollectSyringe = () => {
    // Syringe now adds 20 points
    setScore(prevScore => prevScore + 20);
  };
  
  const handleCollectApple = () => {
    // Apple still adds 10 points
    setScore(prevScore => prevScore + 10);
  };

  const handleHitObstacle = () => {
    // Chocolate now removes 5 points
    setScore(prevScore => prevScore - 5);
  };

  // Attempt to initialize music when any user interaction occurs
  useEffect(() => {
    const initMusic = () => {
      if (!musicInitialized && initAudioRef.current) {
        console.log("Initializing music from user interaction");
        initAudioRef.current();
        setMusicInitialized(true);
        
        // Remove listeners after initialization
        window.removeEventListener('click', initMusic);
        window.removeEventListener('keydown', initMusic);
        window.removeEventListener('touchstart', initMusic);
      }
    };
    
    // Add listeners for user interaction
    window.addEventListener('click', initMusic);
    window.addEventListener('keydown', initMusic);
    window.addEventListener('touchstart', initMusic);
    
    return () => {
      window.removeEventListener('click', initMusic);
      window.removeEventListener('keydown', initMusic);
      window.removeEventListener('touchstart', initMusic);
    };
  }, [musicInitialized]);

  const toggleMusic = () => {
    // Toggle music state
    setIsMusicEnabled(!isMusicEnabled);
    
    // Initialize if first time
    if (!musicInitialized && initAudioRef.current) {
      initAudioRef.current();
      setMusicInitialized(true);
    }
  };

  const handleMusicInit = (initFn: () => void) => {
    initAudioRef.current = initFn;
  };

  const handleDiabetesCheckComplete = (bloodGlucose: string) => {
    setShowDiabetesCheck(false);
    
    // Resume game
    setTimeout(() => {
      setGameState('playing');
      
      // Reset the diabetes check timer
      if (diabetesCheckTimerRef.current) {
        clearTimeout(diabetesCheckTimerRef.current);
      }
      
      diabetesCheckTimerRef.current = setTimeout(() => {
        setGameState('paused');
        setShowDiabetesCheck(true);
      }, 60000);
    }, 50);
  };

  // Extract the music toggle button to a separate constant to be used across all screens
  // Updated positioning and z-index to ensure visibility on mobile devices
  const MusicToggleButton = () => (
    <div className="fixed top-4 right-4 z-[100]">
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-gray-800 bg-opacity-70 hover:bg-gray-700 shadow-md"
        onClick={toggleMusic}
      >
        {isMusicEnabled ? (
          <Volume2 className="h-4 w-4 text-white" />
        ) : (
          <VolumeX className="h-4 w-4 text-white" />
        )}
      </Button>
    </div>
  );

  // Render canvas only when playing to avoid memory issues during transitions
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background Music - plays on all screens */}
      <BackgroundMusic
        url="/sounds/best-game-console-301284.mp3"
        playing={isMusicEnabled && gameState !== 'paused'}
        volume={0.4}
        onInit={handleMusicInit}
      />

      {/* Music toggle button - now visible on all screens */}
      <MusicToggleButton />

      {/* Diabetes Check Dialog */}
      {showDiabetesCheck && (
        <DiabetesCheckDialog 
          open={showDiabetesCheck}
          onComplete={handleDiabetesCheckComplete}
          username={username}
        />
      )}

      {(gameState === "playing" || gameState === "paused") && (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 70 }}>
          <GameScene
            onCollectSyringe={handleCollectSyringe}
            onCollectApple={handleCollectApple}
            onHitObstacle={handleHitObstacle}
            setMoveLeft={setMoveLeft}
            setMoveRight={setMoveRight}
            isPaused={gameState === 'paused'}
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

      {(gameState === "playing" || gameState === "paused") && (
        <>
          <HUD score={score} highScore={highScore} />
          {isMobile && gameState === "playing" && (
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
