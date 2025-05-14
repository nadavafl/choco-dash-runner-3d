
import React, { Suspense, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

interface SceneryObjectsProps {
  speed: number;
}

// 🌴 קומפוננטת מודל עץ דקל
const PalmTreeModel: React.FC<{
  position: THREE.Vector3;
  rotationZ: number;
  scale?: number;
}> = ({ position, rotationZ, scale = 1 }) => {
  const { scene } = useGLTF("/models/palm_trees_draco.glb");

  return (
    <primitive
      object={scene.clone()}
      position={position.toArray()}
      rotation={[0, 0, rotationZ]}
      scale={[scale, scale, scale]}
      castShadow
    />
  );
};

// Ensure the palm tree model is preloaded
useGLTF.preload("/models/palm_trees_draco.glb");

const SceneryObjects: React.FC<SceneryObjectsProps> = ({ speed }) => {
  const treeRef = useRef<THREE.Mesh>(null); // 🔁 קבוצה שנזיזה בפריים

  // 🌴 Palm trees - now using 3D model
  const palmTrees = Array(9)
    .fill(0)
    .map((_, i) => ({
      id: i + 2000,
      position: new THREE.Vector3(
        -48 - (Math.random() * 10 - 5),
        0,
        -200 + i * 30 + (Math.random() * 10 - 5)
      ),
      scale: 1.5 + Math.random() * 0.4,
      leanAngle: Math.random() * 0.3 - 0.15,
    }));

  // ⏱ תנועה איטית של הדקלים לאורך z
  useFrame((_, delta) => {
    if (
      treeRef.current &&
      treeRef.current.material instanceof THREE.MeshStandardMaterial
    ) {
      if (treeRef.current.material.map) {
        treeRef.current.material.map.offset.y -= delta * speed * 0.001;
      }
    }
  });

  return (
    <Suspense fallback={null}>
      {/* 🌴 Palm Trees (3D model) */}
      <mesh ref={treeRef}>
        {palmTrees.map((tree) => (
          <PalmTreeModel
            key={`palm-${tree.id}`}
            position={tree.position}
            rotationZ={tree.leanAngle}
            scale={tree.scale}
          />
        ))}
      </mesh>
    </Suspense>
  );
};

export default SceneryObjects;
