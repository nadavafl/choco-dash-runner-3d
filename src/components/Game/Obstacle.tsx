
import React, { useRef, Suspense } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

interface ObstacleProps {
  position: THREE.Vector3;
}

// 🍫 מכשול שוקולד – עומד, מסתובב, מטיל צל
const Obstacle: React.FC<ObstacleProps> = ({ position }) => {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/chocolate_bar.glb");

  // ☀️ הפעלת צל + הבהרת חומרים
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y -= 0.01;
    }
  });

  // ☀️ Traverse once (אפשר גם ב־useEffect)
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // ✅ אם יש חומר – הבהר אותו
      if (
        child.material &&
        "color" in child.material &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.color.set("#7B3F00"); // 💡 צבע חום בהיר יותר
        child.material.roughness = 0.5;
        child.material.metalness = 0.2;
      }

      // ✅ אם החומר *לא* MeshStandardMaterial – החלף אותו
      if (!(child.material instanceof THREE.MeshStandardMaterial)) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#7B3F00"),
          roughness: 0.5,
          metalness: 0.2,
        });
      }
    }
  });

  return (
    <Suspense fallback={null}>
      <group
        ref={ref}
        position={position}
        rotation={[Math.PI / 2, Math.PI, 0]} // ⬅️ עמידה + קוביות כלפי מצלמה
        scale={[3.15, 3.15, 3.15]} // ⬅️ הקטנה ב-10% (מ-3.5 ל-3.15)
        castShadow
        receiveShadow
      >
        <primitive object={scene.clone()} castShadow receiveShadow />
      </group>
    </Suspense>
  );
};


export default Obstacle;

