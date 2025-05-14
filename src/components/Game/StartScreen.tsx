
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Rocket } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StartScreenProps {
  onStartGame: () => void;
  highScore: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, highScore }) => {
  const isMobile = useIsMobile();
  // Handle start game with safer approach to prevent clone errors
  const handleStartGame = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Use requestAnimationFrame for safer state transitions
    // This prevents DataCloneError by ensuring DOM updates complete
    // before complex state transitions occur
    requestAnimationFrame(() => {
      try {
        onStartGame();
      } catch (error) {
        console.error("Error starting game:", error);
      }
    });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-game-dark to-black bg-opacity-80">
      <Card className="w-[350px] bg-game-dark border-game-primary">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-game-primary">
            CHOCO DASH
          </CardTitle>
          <CardDescription className="text-center text-game-light">
            Dodge chocolate, collect syringes, set high scores!
          </CardDescription>
        </CardHeader>
        
        {/* Enhanced touch controls instructions for mobile devices */}
        {isMobile  && (
          <div className="fixed bottom-10 left-0 right-0 text-center text-white text-xl bg-black bg-opacity-80 py-4 z-50 mx-auto pointer-events-none animate-pulse-glow">
            Swipe left or right to move
          </div>
        )}
        <CardContent className="text-center space-y-4">
          <div className="my-4 flex flex-col items-center">
            <p className="text-game-light mb-2">Controls:</p>
            <p className="text-gray-300">← → Arrow Keys or A/D to move</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-game-light">High Score: {highScore}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleStartGame}
            className="w-full bg-game-primary hover:bg-game-secondary text-white flex items-center justify-center gap-2"
          >
            <Rocket className="h-5 w-5" />
            START GAME
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StartScreen;
