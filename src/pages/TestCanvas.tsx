
import React, { useEffect } from 'react';
import MinimalCanvas from '@/components/Game/MinimalCanvas';
import { Link } from 'react-router-dom';

const TestCanvas = () => {
  useEffect(() => {
    console.log("TestCanvas component mounted");
    
    // Log window location information to help debug routing issues
    console.log("Current location:", {
      href: window.location.href,
      pathname: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search
    });
    
    return () => {
      console.log("TestCanvas component unmounted");
    };
  }, []);
  
  return (
    <div className="w-full h-screen bg-black">
      <MinimalCanvas />
      <div className="absolute top-0 left-0 p-4 z-10">
        <Link to="/" className="text-white bg-blue-600 px-4 py-2 rounded">
          Back to Game
        </Link>
      </div>
    </div>
  );
};

export default TestCanvas;
