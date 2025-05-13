
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const Box = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

const MinimalCanvas: React.FC = () => {
  const handleCreated = (state: any) => {
    console.log('Minimal Canvas created!', {
      gl: state.gl,
      scene: state.scene,
      size: state.size,
    });
  };

  return (
    <Canvas 
      onCreated={handleCreated} 
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box />
      <color attach="background" args={["#333"]} />
    </Canvas>
  );
};

export default MinimalCanvas;
