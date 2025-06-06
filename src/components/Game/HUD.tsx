
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Gamepad, Trophy, Pause } from "lucide-react";

interface HUDProps {
  score: number;
  highScore: number;
  isPaused?: boolean;
}

const HUD: React.FC<HUDProps> = ({ 
  score, 
  highScore,
  isPaused = false
}) => {
  return (
    <>
      {/* Desktop: Full HUD at top */}
      <div className="hidden md:flex absolute top-0 left-0 right-0 px-4 py-3 justify-between items-center z-40">
        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Gamepad className="h-5 w-5" />
          <span>Score: {score}</span>
        </Badge>

        {isPaused && (
          <Badge
            variant="outline"
            className="bg-orange-500 text-white px-3 py-1 text-base flex items-center gap-2 animate-pulse"
          >
            <Pause className="h-5 w-5" />
            <span>PAUSED</span>
          </Badge>
        )}

        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>High Score: {highScore}</span>
        </Badge>
      </div>

      {/* Mobile: Bottom HUD - adjusted to be less intrusive */}
      <div className="block md:hidden absolute bottom-6 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="flex justify-between items-center w-full">
          <Badge
            variant="outline"
            className="bg-game-dark bg-opacity-80 text-game-light px-3 py-1 text-xl flex items-center gap-2"
          >
            <Gamepad className="h-4 w-4" />
            <span>Score: {score}</span>
          </Badge>

          {isPaused && (
            <Badge
              variant="outline"
              className="bg-orange-500 bg-opacity-90 text-white px-3 py-1 text-xs flex items-center gap-2 animate-pulse"
            >
              <Pause className="h-4 w-4" />
              <span>PAUSED</span>
            </Badge>
          )}

          <Badge
            variant="outline"
            className="bg-game-dark bg-opacity-80 text-game-light px-3 py-1 text-xl flex items-center gap-2"
          >
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>High Score: {highScore}</span>
          </Badge>
        </div>
      </div>
    </>
  );
};

export default HUD;
