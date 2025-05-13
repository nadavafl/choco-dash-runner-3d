
import React from 'react';
import MinimalCanvas from '@/components/Game/MinimalCanvas';

const TestCanvas = () => {
  console.log("TestCanvas component rendering");
  
  return (
    <div className="w-full h-screen bg-black">
      <MinimalCanvas />
      <div className="absolute top-0 left-0 p-4 z-10">
        <a href="/" className="text-white bg-blue-600 px-4 py-2 rounded">
          Back to Game
        </a>
      </div>
    </div>
  );
};

export default TestCanvas;
