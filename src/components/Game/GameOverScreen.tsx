
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Rocket } from "lucide-react";
import DiabetesCheckDialog from "./DiabetesCheckDialog";
import axios from "axios";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  username: string;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  onRestart,
  username,
}) => {
  const isNewHighScore = score >= highScore;
  const [showDiabetesCheck, setShowDiabetesCheck] = useState(true);

  const handleDiabetesCheckComplete = (bloodGlucose: string) => {
    setShowDiabetesCheck(false);
    
    // Update the Google Sheet with the blood glucose value and score
    updateGoogleSheet(username, bloodGlucose, score.toString());
  };

  const updateGoogleSheet = async (username: string, bloodGlucose: string, gameScore: string) => {
    try {
      // Replace with your actual Google Apps Script URL
      const apiEndpoint = 
        "https://script.google.com/macros/s/YOUR_ACTUAL_GOOGLE_SCRIPT_ID_HERE/exec";
      
      await axios({
        method: "PUT",
        url: apiEndpoint,
        data: {
          username,
          bloodGlucose,
          gameScore,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Google Sheet updated successfully");
    } catch (error) {
      console.error("Error updating Google Sheet:", error);
    }
  };

  const handlePlayAgain = () => {
    onRestart();
    // Reset the diabetes check dialog for next game over
    setShowDiabetesCheck(true);
  };

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
            onClick={handlePlayAgain}
            className="w-full bg-game-primary hover:bg-game-secondary text-white flex items-center justify-center gap-2"
            disabled={showDiabetesCheck}
          >
            <Rocket className="h-5 w-5" />
            PLAY AGAIN
          </Button>
        </CardFooter>
      </Card>

      <DiabetesCheckDialog
        open={showDiabetesCheck}
        onComplete={handleDiabetesCheckComplete}
        username={username}
      />
    </div>
  );
};

export default GameOverScreen;
