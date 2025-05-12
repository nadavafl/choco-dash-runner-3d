import React, { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface PlayerProps {
  position: THREE.Vector3;
  speed: number;
}

const Player = forwardRef<THREE.Group, PlayerProps>(({ position }, ref) => {
  const { scene } = useGLTF("/models/low_poly_scooter_draco.glb");

  // Adjusted position to be on top of the bridge
  const adjustedPosition = new THREE.Vector3(
    position.x,
    position.y + 0.1,
    position.z
  );

  // 🐰 הגדלה של הדמות
  const scale = new THREE.Vector3(1, 1, 1); // הגדלה לפי הצורך (הייתה קודם 0.5)

  // 🎯 סיבוב של הדמות לכיוון הרצוי
  scene.rotation.y = Math.PI / 2; // מסובב 180 מעלות

  // ☀️ הפעלת צל על כל חלקי המודל
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
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
      {/* Player Body - Explorer outfit */}
      {/* Note: replaced old mesh with GLTF bunny model */}
      <primitive object={scene} />
    </group>
  );
});

export default Player;
