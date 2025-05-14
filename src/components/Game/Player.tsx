
import React, { forwardRef, useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlayerProps {
  position: THREE.Vector3;
  speed: number;
}

const Player = forwardRef<THREE.Group, PlayerProps>(({ position, speed }, ref) => {
  // Using a slightly different path to force a new request and bypass caching
  const { scene } = useGLTF("/models/low_poly_scooter_draco.glb?v=2");
  const frontWheelRef = useRef<THREE.Mesh | null>(null);
  const backWheelRef = useRef<THREE.Mesh | null>(null);

  // Adjusted position to be directly on top of the bridge (reduced Y offset)
  const adjustedPosition = new THREE.Vector3(
    position.x,
    position.y + 0.05, // Reduced from 0.1 to 0.05 to align better with the ground
    position.z
  );

  // 🐰 הגדלה של הדמות
  const scale = new THREE.Vector3(1, 1, 1); // הגדלה לפי הצורך (הייתה קודם 0.5)

  // 🎯 סיבוב של הדמות לכיוון הרצוי
  scene.rotation.y = Math.PI; // מסובב 180 מעלות

  // Find the wheel meshes from the model after initial load
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Set up shadow properties for all meshes
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Try to identify wheels by their position or name in the model
        // Adjust these checks based on the actual model structure
        if (child.name.toLowerCase().includes('wheel') || child.name.toLowerCase().includes('tire')) {
          if (child.position.z > 0) { // front wheel check
            frontWheelRef.current = child;
          } else { // back wheel check
            backWheelRef.current = child;
          }
        }
      }
    });
  }, [scene]);

  // Animate the wheels based on the game speed
  useFrame(() => {
    if (frontWheelRef.current) {
      frontWheelRef.current.rotation.x -= speed * 0.01;
    }
    
    if (backWheelRef.current) {
      backWheelRef.current.rotation.x -= speed * 0.01;
    }
  });

  return (
    <group
      ref={ref}
      position={adjustedPosition}
      scale={scale}
      castShadow
      receiveShadow
    >
      {/* Player model - Using scooter model */}
      <primitive object={scene} />
    </group>
  );
});

// Add preload for the model to ensure it's available
useGLTF.preload("/models/low_poly_scooter_draco.glb?v=2");

export default Player;
