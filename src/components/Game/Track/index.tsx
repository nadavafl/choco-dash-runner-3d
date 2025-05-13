
import React from 'react';
import * as THREE from 'three';
import Sky from './Sky';
import Water from './Water';
import Beach from './Beach';
import Bridge from './Bridge';
import SceneryObjects from './SceneryObjects';
import { useThree } from '@react-three/fiber';

interface TrackProps {
  speed: number;
}

const Track: React.FC<TrackProps> = ({ speed }) => {
  const { gl } = useThree();
  
  // Log renderer capabilities for debugging
  React.useEffect(() => {
    // Access the underlying WebGL context
    const webGLContext = gl.getContext();
    
    console.log("WebGL Renderer Info:", {
      version: gl.getVersion(),
      renderer: gl.info.renderer,
      vendor: gl.info.vendor,
      memory: gl.info.memory,
      programs: gl.info.programs
    });
    
    // Only attempt to access WebGL parameters if we have the context
    if (webGLContext) {
      try {
        console.log("WebGL Context Parameters:", {
          maxTextures: webGLContext.getParameter(webGLContext.MAX_TEXTURE_IMAGE_UNITS),
          extensions: webGLContext.getSupportedExtensions()
        });
      } catch (err) {
        console.error("Error getting WebGL parameters:", err);
      }
    }
  }, [gl]);

  return (
    <>
      {/* Environment components */}
      <Sky />
      <Water speed={speed} />
      <Beach speed={speed} />
      <Bridge speed={speed} />
      <SceneryObjects speed={speed} />
      
      {/* Lighting and atmosphere - reduced complexity for mobile */}
      <ambientLight intensity={0.7} color="#F8F8FF" />
      <directionalLight position={[50, 100, 20]} intensity={1.2} color="#FFF8DC" castShadow />
      <pointLight position={[30, 0, 20]} intensity={0.6} color="#33C3F0" distance={20} />
      <fog attach="fog" args={['#E6F2FF', 60, 180]} />
    </>
  );
};

export default Track;
