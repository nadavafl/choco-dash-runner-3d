
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Rocket } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score >= highScore;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <Card className="w-[350px] bg-game-dark border-game-primary animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-red-500">
            GAME OVER
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-game-light text-xl">Your Score</p>
            <p className="text-3xl font-bold text-game-primary">{score}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <p className="text-game-light text-xl">High Score</p>
            </div>
            <p className="text-2xl font-bold text-game-accent">{highScore}</p>
          </div>
          
          {isNewHighScore && (
            <div className="py-2 px-4 bg-game-accent bg-opacity-20 rounded-md animate-pulse-glow">
              <p className="text-game-accent font-bold">NEW HIGH SCORE!</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onRestart} 
            className="w-full bg-game-primary hover:bg-game-secondary text-white flex items-center justify-center gap-2"
          >
            <Rocket className="h-5 w-5" />
            PLAY AGAIN
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameOverScreen;
