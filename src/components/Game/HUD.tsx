
// import React from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Gamepad, Trophy } from 'lucide-react';
// import LivesDisplay from './LivesDisplay';

// interface HUDProps {
//   score: number;
//   highScore: number;
//   lives: number;
// }

// const HUD: React.FC<HUDProps> = ({ score, highScore, lives }) => {
//   return (
//     <div className="absolute top-0 left-0 right-0 px-6 py-4">
//       <div className="flex justify-between items-center mb-4">
//         <Badge variant="outline" className="bg-game-dark text-game-light px-4 py-2 text-lg flex items-center gap-2">
//           <Gamepad className="h-5 w-5" />
//           <span>Score: {score}</span>
//         </Badge>
        
//         <Badge variant="outline" className="bg-game-dark text-game-light px-4 py-2 text-lg flex items-center gap-2">
//           <Trophy className="h-5 w-5 text-yellow-500" />
//           <span>High Score: {highScore}</span>
//         </Badge>
//       </div>
      
//       <div className="flex justify-center items-center">
//         <div className="bg-game-dark bg-opacity-60 px-4 py-2 rounded-full">
//           <LivesDisplay lives={lives} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HUD;

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Gamepad, Trophy } from "lucide-react";
import LivesDisplay from "./LivesDisplay";

interface HUDProps {
  score: number;
  highScore: number;
  lives: number;
}

const HUD: React.FC<HUDProps> = ({ score, highScore, lives }) => {
  return (
    <>
      {/* דסקטופ: HUD מלא למעלה כולל חיים */}
      <div className="hidden md:flex absolute top-0 left-0 right-0 px-4 py-3 justify-between items-center z-50">
        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Gamepad className="h-5 w-5" />
          <span>Score: {score}</span>
        </Badge>

        <div className="bg-game-dark bg-opacity-60 px-4 py-2 rounded-full">
          <LivesDisplay lives={lives} />
        </div>

        <Badge
          variant="outline"
          className="bg-game-dark text-game-light px-3 py-1 text-base flex items-center gap-2"
        >
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>High Score: {highScore}</span>
        </Badge>
      </div>

      {/* מובייל: HUD תחתון */}
      <div className="block md:hidden absolute bottom-4 left-0 right-0 px-4 z-50 flex flex-col items-center gap-2">
        {/* Lives באמצע */}
        <div className="bg-game-dark bg-opacity-60 px-4 py-2 rounded-full">
          <LivesDisplay lives={lives} />
        </div>

        {/* Score ו־High Score בשורה אחת */}
        <div className="flex justify-between w-full">
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
    </>
  );
};

export default HUD;

