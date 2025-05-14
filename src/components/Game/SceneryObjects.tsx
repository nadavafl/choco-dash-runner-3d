
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

// Preload palm tree model
useGLTF.preload("/models/palm_trees_draco.glb");

const SceneryObjects: React.FC<SceneryObjectsProps> = ({ speed }) => {
  const treeRef = useRef<THREE.Mesh>(null); // 🔁 קבוצה שנזיזה בפריים

  // 🪨 Rocks in the water (right side)
  const rocks = Array(0)
    .fill(0)
    .map((_, i) => ({
      id: i + 1000,
      position: new THREE.Vector3(
        Math.random() * 40 + 15,
        Math.random() * 0.5 - 2,
        (Math.random() - 0.5) * 400 - 50
      ),
      scale: new THREE.Vector3(
        Math.random() * 3 + 1,
        Math.random() * 1.5 + 0.8,
        Math.random() * 3 + 1
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      color: Math.random() > 0.5 ? "#7a7572" : "#5c5957",
    }));

  // 🌴 Palm trees - now using 3D model
  const palmTrees = Array(5)
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

  // 🐚 Seashells on beach (disabled)
  const seashells = Array(0)
    .fill(0)
    .map((_, i) => {
      const rightSide = Math.random() > 0.5;
      return {
        id: i + 3000,
        position: new THREE.Vector3(
          rightSide ? 10 + Math.random() * 15 : -10 - Math.random() * 15,
          -1.9,
          (Math.random() - 0.5) * 400
        ),
        rotation: new THREE.Euler(
          Math.PI * 0.5 * Math.random(),
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 0.5
        ),
        scale: 0.3 + Math.random() * 0.5,
        color: Math.random() > 0.5 ? "#FFF5E1" : "#FFC8A2",
      };
    });

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
      {/* 🪨 Rocks */}
      <group>
        {rocks.map((rock) => (
          <mesh
            key={rock.id}
            position={rock.position}
            scale={rock.scale}
            rotation={[rock.rotation.x, rock.rotation.y, rock.rotation.z]}
            castShadow
          >
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={rock.color} roughness={0.9} />
          </mesh>
        ))}
      </group>

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

      {/* 🐚 Seashells */}
      <group>
        {seashells.map((shell) => (
          <mesh
            key={`shell-${shell.id}`}
            position={shell.position}
            rotation={[shell.rotation.x, shell.rotation.y, shell.rotation.z]}
            scale={[shell.scale, shell.scale, shell.scale]}
            castShadow
          >
            <torusGeometry args={[1, 0.4, 8, 16, Math.PI * 1.5]} />
            <meshStandardMaterial color={shell.color} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </Suspense>
  );
};

export default SceneryObjects;
