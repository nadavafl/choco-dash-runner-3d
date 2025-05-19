import React from "react";
import { Badge } from "@/components/ui/badge";
import { Gamepad, Trophy } from "lucide-react";
import LivesDisplay from "./LivesDisplay";

interface HUDProps {
  score: number;
  highScore: number;
  lives: number;
}

const HUD: React.FC<HUDProps> = ({ 
  score, 
  highScore, 
  lives
}) => {
  return (
    <>
      {/* Desktop: Full HUD at top including lives */}
      <div className="hidden md:flex absolute top-0 left-0 right-0 px-4 py-3 justify-between items-center z-50">
        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Gamepad className="h-5 w-5" />
          <span>Score: {score}</span>
        </Badge>

        <div className="flex items-center gap-4">
          <div className="bg-game-dark bg-opacity-60 px-4 py-2 rounded-full">
            <LivesDisplay lives={lives} />
          </div>
        </div>

        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>High Score: {highScore}</span>
        </Badge>
      </div>

      {/* Mobile: Bottom HUD */}
      <div className="block md:hidden absolute bottom-4 left-0 right-0 px-4 z-50">
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Lives in the middle */}
          <div className="bg-game-dark bg-opacity-60 px-4 py-2 rounded-full mb-1">
            <LivesDisplay lives={lives} />
          </div>

          {/* Score and High Score in a row */}
          <div className="flex justify-between items-center w-full">
            <Badge
              variant="outline"
              className="bg-game-dark text-game-light px-3 py-1 text-sm flex items-center gap-2"
            >
              <Gamepad className="h-4 w-4" />
              <span>Score: {score}</span>
            </Badge>

            <Badge
              variant="outline"
              className="bg-game-dark text-game-light px-3 py-1 text-sm flex items-center gap-2"
            >
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>High Score: {highScore}</span>
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
};

export default HUD;
