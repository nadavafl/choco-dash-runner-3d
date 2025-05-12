import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

interface BeachProps {
  speed: number;
}

const Beach: React.FC<BeachProps> = ({ speed }) => {
  const beachSandRef = useRef<THREE.Mesh>(null);
  const leftSandRef = useRef<THREE.Mesh>(null);

  // 🏖️ טעינת מרקמים של חול
  const colorMap = useLoader(
    TextureLoader,
    "/textures/sand/Stylized_Sand_001_basecolor.jpg"
  );
  const normalMap = useLoader(
    TextureLoader,
    "/textures/sand/Stylized_Sand_001_normal.jpg"
  );
  const displacementMap = useLoader(
    TextureLoader,
    "/textures/sand/Stylized_Sand_001_height.png"
  );
  const aoMap = useLoader(
    TextureLoader,
    "/textures/sand/Stylized_Sand_001_ambientOcclusion.jpg"
  );
  const roughnessMap = useLoader(
    TextureLoader,
    "/textures/sand/Stylized_Sand_001_roughness.jpg"
  );

  useEffect(() => {
    [colorMap, normalMap, displacementMap, aoMap, roughnessMap].forEach(
      (map) => {
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(4, 100);
      }
    );
  }, [colorMap, normalMap, displacementMap, aoMap, roughnessMap]);

  useFrame((_, delta) => {
    if (
      beachSandRef.current &&
      beachSandRef.current.material instanceof THREE.MeshStandardMaterial
    ) {
      if (beachSandRef.current.material.map) {
        beachSandRef.current.material.map.offset.y -=  speed * 0.01;
      }
    }
    if (
      leftSandRef.current &&
      leftSandRef.current.material instanceof THREE.MeshStandardMaterial
    ) {
      if (leftSandRef.current.material.map) {
        leftSandRef.current.material.map.offset.y -= delta * speed * 0.01;
      }
    }
  });

  return (
    <>
      {/* Beach Sand - Right side */}
      <mesh
        ref={beachSandRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[12, -2, 0]}
        receiveShadow
      >
        <planeGeometry args={[15, 1000, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          displacementMap={displacementMap}
          displacementScale={0.05} // תבליט עדין של החול
          aoMap={aoMap}
          roughnessMap={roughnessMap}
          metalness={0}
        />
      </mesh>

      {/* Beach Sand - Left side */}
      <mesh
        ref={leftSandRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-20, 1, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 1000, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          displacementMap={displacementMap}
          displacementScale={0.05}
          aoMap={aoMap}
          roughnessMap={roughnessMap}
          metalness={0}
        />
      </mesh>
    </>
  );
};

export default Beach;
