
import React, { useEffect } from 'react';

interface TouchControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onSwipeLeft, onSwipeRight }) => {
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      // Detect swipe direction
      const swipeThreshold = 50; // Minimum distance for a swipe
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) < swipeThreshold) return; // Not a significant swipe
      
      if (swipeDistance > 0) {
        onSwipeRight(); // Swipe right
      } else {
        onSwipeLeft(); // Swipe left
      }
    };
    
    // Add touch event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    // Cleanup
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
  
  return null; // This component doesn't render anything visible
};

export default TouchControls;
