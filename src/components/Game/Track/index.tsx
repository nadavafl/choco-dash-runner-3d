
import React from 'react';
import * as THREE from 'three';
import Sky from './Sky';
import Water from './Water';
import Beach from './Beach';
import Bridge from './Bridge';
import SceneryObjects from './SceneryObjects';

interface TrackProps {
  speed: number;
}

const Track: React.FC<TrackProps> = ({ speed }) => {
  return (
    <>
      {/* Environment components */}
      <Sky />
      <Water speed={speed} />
      <Beach speed={speed} />
      <Bridge speed={speed} />
      <SceneryObjects speed={speed} />
      
      {/* Lighting and atmosphere */}
      <ambientLight intensity={0.7} color="#F8F8FF" />
      <directionalLight position={[50, 100, 20]} intensity={1.2} color="#FFF8DC" castShadow />
      <pointLight position={[30, 0, 20]} intensity={0.6} color="#33C3F0" distance={20} />
      <fog attach="fog" args={['#E6F2FF', 60, 180]} />
    </>
  );
};

export default Track;
