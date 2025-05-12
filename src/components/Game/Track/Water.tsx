import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

interface WaterProps {
  speed: number;
}

const Water: React.FC<WaterProps> = ({ speed }) => {
  const waterRef = useRef<THREE.Mesh>(null);

  // 🌊 טעינת מרקמים חדשים של מים
  const colorMap = useLoader(
    TextureLoader,
    "/textures/water/Water_002_COLOR.jpg"
  );
  const normalMap = useLoader(
    TextureLoader,
    "/textures/water/Water_002_NORM.jpg"
  );
  const displacementMap = useLoader(
    TextureLoader,
    "/textures/water/Water_002_DISP.png"
  );
  const aoMap = useLoader(TextureLoader, "/textures/water/Water_002_OCC.jpg");
  const roughnessMap = useLoader(
    TextureLoader,
    "/textures/water/Water_002_ROUGH.jpg"
  );

  useEffect(() => {
    // חזרה אינסופית של המרקם לאורך ה־Z
    [colorMap, normalMap, displacementMap, aoMap, roughnessMap].forEach(
      (map) => {
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(4, 100);
      }
    );
  }, [colorMap, normalMap, displacementMap, aoMap, roughnessMap]);

  useFrame((_, delta) => {
    // Water animation - reduced speed by 50%
    if (
      waterRef.current &&
      waterRef.current.material instanceof THREE.MeshStandardMaterial
    ) {
      if (waterRef.current.material.map) {
        waterRef.current.material.map.offset.y -= delta * speed * 0.025;
      }
    }
  });

  return (
    <>
      {/* Water Surface - Right side */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[74, -2, 0]}
        receiveShadow
      >
        {/* 🔹 planeGeometry subdivided for displacement map */}
        <planeGeometry args={[110, 1000, 128, 128]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          displacementMap={displacementMap}
          displacementScale={0.1} // הגבהה עדינה של הגלים
          aoMap={aoMap}
          roughnessMap={roughnessMap}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    </>
  );
};

export default Water;
