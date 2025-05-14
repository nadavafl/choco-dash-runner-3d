
import React, { useEffect } from 'react';

interface TouchControlsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

// Touch control component - attaches event handlers but doesn't render anything in 3D space
const TouchControls: React.FC<TouchControlsProps> = ({ onSwipeLeft, onSwipeRight }) => {
  useEffect(() => {
    // Touch gesture handling
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Minimum distance for a swipe to be registered
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) < swipeThreshold) return; // Not a significant swipe
      
      if (swipeDistance > 0) {
        console.log('Swipe right detected');
        onSwipeRight(); // Swipe right
      } else if (swipeDistance < 0) {
        console.log('Swipe left detected');
        onSwipeLeft(); // Swipe left
      }
    };
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Clean up listeners on unmount
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight]);
  
  // This component doesn't render any 3D objects
  return null;
};

export default TouchControls;
