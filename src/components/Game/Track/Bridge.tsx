import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

interface BridgeProps {
  speed: number;
}

const Bridge: React.FC<BridgeProps> = ({ speed }) => {
  const floorRef = useRef<THREE.Mesh>(null);

  // 🌊 טעינת המרקמים של הגשר
  const colorMap = useLoader(
    TextureLoader,
    "/textures/bridge/Planks010_4K-PNG_Color.png"
  );
  const roughnessMap = useLoader(
    TextureLoader,
    "/textures/bridge/Planks010_4K-PNG_Roughness.png"
  );
  const normalMap = useLoader(
    TextureLoader,
    "/textures/bridge/Planks010_4K-PNG_NormalGL.png"
  );
  const aoMap = useLoader(
    TextureLoader,
    "/textures/bridge/Planks010_4K-PNG_AmbientOcclusion.png"
  );

  useEffect(() => {
    // חזרה אינסופית של המרקם
    colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
    colorMap.repeat.set(1, 100);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(1, 100);
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(1, 100);
    aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
    aoMap.repeat.set(1, 100);
  }, [colorMap, roughnessMap, normalMap, aoMap]);

  // Bridge posts along the sides
  const bridgePosts = Array(24)
    .fill(0)
    .map((_, i) => {
      const side = i % 2 === 0 ? -1 : 1; // Alternate sides
      const zPos = -10 + Math.floor(i / 2) * 40; // Space them out along Z

      return {
        id: i + 4000,
        position: new THREE.Vector3(side * 5, -1, zPos),
        height: 3 + Math.random() * 0.5, // Slightly varying heights
      };
    });

  useFrame((_, delta) => {
    // Bridge floor - full speed
    if (
      floorRef.current &&
      floorRef.current.material instanceof THREE.MeshStandardMaterial
    ) {
      if (floorRef.current.material.map) {
        floorRef.current.material.map.offset.y -= delta * speed * 0.1;
      }
    }
  });

  return (
    <>
      {/* Bridge Floor */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 1000]} />
        <meshStandardMaterial
          map={colorMap}
          roughnessMap={roughnessMap}
          normalMap={normalMap}
          aoMap={aoMap}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Bridge Sides - Railings */}
      <group>
        {/* Left side railing */}
        <mesh position={[-5, 0.5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 1, 1000]} />
          <meshStandardMaterial color="#6B4226" />
        </mesh>

        {/* Right side railing */}
        <mesh position={[5, 0.5, 0]} receiveShadow>
          <boxGeometry args={[0.5, 1, 1000]} />
          <meshStandardMaterial color="#6B4226" />
        </mesh>

        {/* Bridge slats/planks */}
        {/* {Array(100)
          .fill(0)
          .map((_, i) => (
            <mesh
              key={`plank-${i}`}
              position={[0, -0.05, i * 10 - 500]}
              rotation={[0, Math.PI / 2, 0]}
              castShadow
            >
              <boxGeometry args={[1, 0.2, 10.5]} />
              <meshStandardMaterial
                color={Math.random() > 0.3 ? "#8B4513" : "#6B4226"}
                roughness={0.8}
              />
            </mesh>
          ))} */}

        {/* Bridge posts */}
        {bridgePosts.map((post) => (
          <mesh
            key={`post-${post.id}`}
            position={[
              post.position.x,
              post.position.y - post.height / 2,
              post.position.z,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.4, 0.5, post.height, 8]} />
            <meshStandardMaterial color="#5D4037" roughness={0.7} />
          </mesh>
        ))}
      </group>
    </>
  );
};

export default Bridge;
