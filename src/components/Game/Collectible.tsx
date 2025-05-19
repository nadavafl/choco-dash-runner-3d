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
                m.color.set("#39FF14");
                m.emissive = new THREE.Color("#39FF14");
                m.emissiveIntensity = 0.4;
                m.roughness = 0.3;
                m.metalness = 0.6;
              }
            });
          } else if (mat instanceof THREE.MeshStandardMaterial) {
            mat.color.set("#39FF14");
            mat.emissive = new THREE.Color("#39FF14");
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
