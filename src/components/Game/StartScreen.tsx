
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
            CHOCO DODGE
          </CardTitle>
          <CardDescription className="text-center text-game-light">
            Dodge chocolate, collect syringes and apples, set high scores!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="my-4 flex flex-col items-center">
            <p className="text-game-light mb-2">keyboard controls:</p>
            <p className="text-gray-300 mb-2">← → Arrow Keys or A/D to move</p>
            <p className="text-gray-300 mb-2">Touch screen controls:</p>
            <p className="text-gray-300">Swipe left or right to move</p>
            <p className="text-gray-300 mt-2">Use the music toggle in the top-right corner</p>
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
