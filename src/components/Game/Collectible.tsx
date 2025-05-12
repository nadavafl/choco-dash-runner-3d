
// import React, { useRef } from 'react';
// import * as THREE from 'three';
// import { useFrame } from '@react-three/fiber';

// interface CollectibleProps {
//   position: THREE.Vector3;
// }

// const Collectible: React.FC<CollectibleProps> = ({ position }) => {
//   const syringeRef = useRef<THREE.Group>(null);
//   const glowRef = useRef<THREE.PointLight>(null);
  
//   useFrame((_, delta) => {
//     if (syringeRef.current) {
//       syringeRef.current.rotation.y += delta * 2;
//       syringeRef.current.position.y = position.y + Math.sin(Date.now() * 0.003) * 0.2;
//     }
    
//     if (glowRef.current) {
//       glowRef.current.intensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
//     }
//   });
  
//   return (
//     <group position={position}>
//       <group ref={syringeRef}>
//         {/* Syringe body */}
//         <mesh castShadow>
//           <cylinderGeometry args={[0.1, 0.15, 0.8, 12]} />
//           <meshStandardMaterial 
//             color="#D3E4FD" 
//             transparent 
//             opacity={0.8}
//             roughness={0.1} 
//             metalness={0.8}
//           />
//         </mesh>
        
//         {/* Syringe fluid - Changed to chocolate color */}
//         <mesh position={[0, 0.1, 0]} castShadow>
//           <cylinderGeometry args={[0.08, 0.13, 0.4, 12]} />
//           <meshStandardMaterial 
//             color="#6b4226"
//             emissive="#513018"
//             emissiveIntensity={0.2}
//             roughness={0.3} 
//             metalness={0.2}
//           />
//         </mesh>
        
//         {/* Syringe plunger */}
//         <mesh position={[0, 0.45, 0]} castShadow>
//           <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
//           <meshStandardMaterial color="#1A1F2C" roughness={0.3} metalness={0.7} />
//         </mesh>
        
//         {/* Syringe needle */}
//         <mesh position={[0, -0.55, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
//           <cylinderGeometry args={[0.01, 0.03, 0.3, 8]} />
//           <meshStandardMaterial color="#C8C8C9" roughness={0.1} metalness={0.9} />
//         </mesh>
//       </group>
      
//       {/* Glow effect - Changed to chocolate-like glow */}
//       <pointLight 
//         ref={glowRef}
//         position={[0, 0, 0]} 
//         distance={3} 
//         intensity={0.6} 
//         color="#8B4513" 
//       />
//     </group>
//   );
// };

// export default Collectible;

import React, { forwardRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CollectibleProps {
  position: THREE.Vector3;
}

const Collectible = forwardRef<THREE.Group, CollectibleProps>(
  ({ position }, ref) => {
    const { scene } = useGLTF("/models/syringe.glb");

    // ☀️ הפעלת צל וחומר בולט יותר
    useEffect(() => {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const mat = mesh.material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.color.set("#B388FF");
                m.emissive = new THREE.Color("#B388FF");
                m.emissiveIntensity = 0.4;
                m.roughness = 0.3;
                m.metalness = 0.6;
              }
            });
          } else if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.set("#B388FF");
            mat.emissive = new THREE.Color("#B388FF");
            mat.emissiveIntensity = 0.4;
            mat.roughness = 0.3;
            mat.metalness = 0.6;
          }
        }
      });
    }, [scene]);

    // 🌀 אנימציה - סיבוב + קפיצה
    useFrame((_, delta) => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.rotation.y += delta * 2;
        ref.current.position.y =
          position.y + Math.sin(Date.now() * 0.003) * 0.2;
      }
    });

    return (
      <group position={position}>
        <group
          ref={ref}
          rotation={[Math.PI, 0, 0]}
          position={[0, 1, 0]}
          scale={[0.07, 0.07, 0.07]}
          castShadow
          receiveShadow
        >
          <primitive object={scene} />
        </group>

        {/* ✨ אפקט תאורה */}
        <pointLight
          position={[0, 0, 0]}
          distance={3}
          intensity={0.7}
          color="#00FFD1"
        />
      </group>
    );
  }
);

export default Collectible;
