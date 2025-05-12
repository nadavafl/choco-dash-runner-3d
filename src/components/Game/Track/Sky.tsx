
import React from 'react';
import * as THREE from 'three';

const Sky: React.FC = () => {
  return (
    <>
      {/* Sky */}
      <mesh position={[0, 0, -500]}>
        <planeGeometry args={[2000, 1000]} />
        <meshStandardMaterial color="#87CEEB" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Sun */}
      <mesh position={[100, 80, -400]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial color="#FFF8DC" />
      </mesh>
      <pointLight position={[100, 80, -400]} intensity={1.5} color="#FFF8DC" distance={1000} />
    </>
  );
};

export default Sky;
