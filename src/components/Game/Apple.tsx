
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AppleProps {
  position: THREE.Vector3;
}

const Apple: React.FC<AppleProps> = ({ position }) => {
  const appleRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  useFrame((_, delta) => {
    if (appleRef.current) {
      appleRef.current.rotation.y += delta * 2;
      appleRef.current.position.y = position.y + Math.sin(Date.now() * 0.003) * 0.2;
    }
    
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
    }
  });
  
  return (
    <group position={position}>
      <group ref={appleRef}>
        {/* Apple body */}
        <mesh castShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#D32F2F"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Apple stem */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial
            color="#4E342E"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Apple leaf */}
        <mesh position={[0.05, 0.4, 0]} rotation={[0.2, 0.5, 0.3]} castShadow>
          <sphereGeometry args={[0.08, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#388E3C"
            roughness={0.8}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Glow effect */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 0]}
        distance={2}
        intensity={0.5}
        color="#FF8A65"
      />
    </group>
  );
};

export default Apple;
