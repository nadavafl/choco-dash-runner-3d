
import React from 'react';

interface LivesDisplayProps {
  lives: number;
}

const LivesDisplay: React.FC<LivesDisplayProps> = ({ lives }) => {
  // Create an array with the number of lives (max 3)
  const chocolateBars = Array(3).fill(0).map((_, index) => ({
    id: index,
    active: index < lives
  }));
  
  return (
    <div className="flex items-center justify-center gap-2">
      {chocolateBars.map(bar => (
        <div 
          key={bar.id} 
          className={`transition-all duration-300 ${bar.active ? 'opacity-100' : 'opacity-30'}`}
        >
          {/* Chocolate Bar SVG */}
          <svg 
            width="36" 
            height="24" 
            viewBox="0 0 36 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${bar.active ? 'drop-shadow-md' : ''}`}
          >
            {/* Wrapper */}
            <rect x="1" y="1" width="34" height="22" rx="2" fill="#F97316" />
            
            {/* Chocolate */}
            <rect x="4" y="4" width="28" height="16" rx="1" fill="#6b4226" />
            
            {/* Squares */}
            <rect x="7" y="7" width="6" height="4" rx="1" fill="#513018" />
            <rect x="15" y="7" width="6" height="4" rx="1" fill="#513018" />
            <rect x="23" y="7" width="6" height="4" rx="1" fill="#513018" />
            <rect x="7" y="13" width="6" height="4" rx="1" fill="#513018" />
            <rect x="15" y="13" width="6" height="4" rx="1" fill="#513018" />
            <rect x="23" y="13" width="6" height="4" rx="1" fill="#513018" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default LivesDisplay;
