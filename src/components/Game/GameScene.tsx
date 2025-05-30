
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './Player';
import Track from './Track';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Apple from './Apple';
import TouchControls from './TouchControls';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameSceneProps {
  onCollectSyringe: () => void;
  onCollectApple: () => void;
  onHitObstacle: () => void;
  setMoveLeft: React.Dispatch<React.SetStateAction<() => void>>;
  setMoveRight: React.Dispatch<React.SetStateAction<() => void>>;
  isPaused: boolean;
}

interface GameObject {
  id: number;
  position: THREE.Vector3;
  type: 'obstacle' | 'syringe' | 'apple';
}

const GameScene: React.FC<GameSceneProps> = ({ 
  onCollectSyringe, 
  onCollectApple,
  onHitObstacle,
  setMoveLeft,
  setMoveRight,
  isPaused
}) => {
  const speedRef = useRef(15);
  const playerRef = useRef<THREE.Group>(null);
  const [playerPosition, setPlayerPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.5, 0));
  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [lanes] = useState([-3, 0, 3]); // Left, center, right
  const [currentLane, setCurrentLane] = useState(1); // Start in center lane (index 1)
  const gameObjectsRef = useRef<GameObject[]>([]);
  const nextObjectId = useRef(0);
  const spawnTimerRef = useRef(0);
  const movingRef = useRef(false);
  const laneChangeSpeed = 5;
  const gameActiveRef = useRef<boolean>(true);
  const isMobile = useIsMobile();
  
  // Clean up function to prevent memory leaks and DataCloneError
  useEffect(() => {
    // Initialize game state
    gameObjectsRef.current = [];
    setGameObjects([]);
    nextObjectId.current = 0;
    gameActiveRef.current = true;
    
    // Cleanup function to properly dispose objects when component unmounts
    return () => {
      // Set game as inactive first
      gameActiveRef.current = false;
      
      // Clear all game objects to prevent cloning issues
      gameObjectsRef.current = [];
      setGameObjects([]);
      
      console.log("GameScene cleanup completed");
    };
  }, []);

  // Move player left
  const moveLeft = () => {
    if (currentLane > 0 && !movingRef.current && !isPaused) {
      movingRef.current = true;
      setCurrentLane(currentLane - 1);
    }
  };

  // Move player right
  const moveRight = () => {
    if (currentLane < lanes.length - 1 && !movingRef.current && !isPaused) {
      movingRef.current = true;
      setCurrentLane(currentLane + 1);
    }
  };

  // Expose movement functions to parent component
  useEffect(() => {
    setMoveLeft(() => moveLeft);
    setMoveRight(() => moveRight);
  }, [currentLane, setMoveLeft, setMoveRight, isPaused]);

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActiveRef.current || isPaused) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLane, isPaused]);

  // Spawn new objects - Updated to prevent 3 of the same type in a row
  const spawnObject = () => {
    if (!gameActiveRef.current || isPaused) return;
    
    // Collect all used lanes so we don't spawn too many objects in a row
    const usedLanes: number[] = [];
    const objectsInRow = gameObjectsRef.current.filter(obj => 
      obj.position.z < -95 && obj.position.z > -105
    );
    
    objectsInRow.forEach(obj => {
      const laneIndex = lanes.findIndex(lane => Math.abs(lane - obj.position.x) < 0.5);
      if (laneIndex >= 0) usedLanes.push(laneIndex);
    });
    
    // Determine how many objects to spawn in this row
    let objectsToSpawn = 1;
    
    // 75% chance to spawn 2 objects
    if (Math.random() < 0.75 && usedLanes.length < 2) {
      objectsToSpawn = 2;
    }
    
    // Count object types to prevent having all 3 of the same type
    const objectTypes = {
      obstacle: 0,
      syringe: 0,
      apple: 0
    };
    
    // Count existing objects in this row by type
    objectsInRow.forEach(obj => {
      objectTypes[obj.type]++;
    });
    
    for (let i = 0; i < objectsToSpawn; i++) {
      // If we already have all lanes filled in this row, don't spawn more
      if (usedLanes.length >= lanes.length) break;
      
      // Get available lanes to spawn in
      const availableLanes = lanes
        .map((_, index) => index)
        .filter(index => !usedLanes.includes(index));
      
      if (availableLanes.length === 0) break;
      
      // Choose a random available lane
      const laneIndex = availableLanes[Math.floor(Math.random() * availableLanes.length)];
      usedLanes.push(laneIndex); // Mark this lane as used
      
      // Determine what kind of object to spawn
      let type: 'obstacle' | 'syringe' | 'apple';
      
      // Prevent spawning more of a type if we already have 2 of that type
      if (objectTypes.obstacle >= 2) {
        // Don't spawn more obstacles, choose between apple and syringe
        type = Math.random() < 0.7 ? 'apple' : 'syringe';
      } else if (objectTypes.apple >= 2) {
        // Don't spawn more apples, choose between obstacle and syringe
        type = Math.random() < 0.8 ? 'obstacle' : 'syringe';
      } else if (objectTypes.syringe >= 2) {
        // Don't spawn more syringes, choose between obstacle and apple
        type = Math.random() < 0.7 ? 'obstacle' : 'apple';
      } else {
        // Normal probability distribution
        const random = Math.random();
        if (random < 0.65) {
          type = 'obstacle'; // 65% chance for obstacle
        } else if (random < 0.9) {
          type = 'apple';   // 25% chance for apple
        } else {
          type = 'syringe'; // 10% chance for syringe
        }
      }
      
      // Increment the count for this type
      objectTypes[type]++;
      
      // Create a simple serializable object
      const newObject: GameObject = {
        id: nextObjectId.current++,
        position: new THREE.Vector3(
          lanes[laneIndex],
          type === 'obstacle' ? 0.75 : 1.2, // Different heights for obstacles and collectibles
          -100 // Start far away and come toward the player
        ),
        type
      };

      // Update game objects using a safe copy approach
      const updatedObjects = [...gameObjectsRef.current, newObject];
      gameObjectsRef.current = updatedObjects;
    }
    
    // Update state safely
    setGameObjects([...gameObjectsRef.current]);
  };

  // Check collisions between player and objects
  const checkCollisions = () => {
    if (!playerRef.current || !gameActiveRef.current || isPaused) return;
    
    // Use a simple distance-based collision detection instead of Box3
    // This avoids potential issues with complex Three.js objects and cloning
    const playerPos = playerPosition;
    
    // Filter objects safely using basic types
    const remainingObjects = gameObjectsRef.current.filter(obj => {
      // Skip objects that are behind the player
      if (obj.position.z > 2) return false;
      
      // Check if object is close enough for potential collision
      if (obj.position.z < 0 || obj.position.z > 2) return true;
      
      // Calculate approximate distance to determine collision
      const distance = Math.sqrt(
        Math.pow(playerPos.x - obj.position.x, 2) +
        Math.pow(playerPos.z - obj.position.z, 2)
      );
      
      if (distance < 1.5) {
        // Collision detected
        if (obj.type === 'syringe') {
          onCollectSyringe();
          return false; // Remove syringe
        } else if (obj.type === 'apple') {
          onCollectApple();
          return false; // Remove apple
        } else {
          onHitObstacle();
          return false; // Remove obstacle
        }
      }
      
      return true;
    });
    
    // Update game objects reference and state
    gameObjectsRef.current = remainingObjects;
    setGameObjects([...remainingObjects]);
  };

  // Main game loop
  useFrame((_, delta) => {
    if (!gameActiveRef.current || isPaused) return;
    
    // Increase game speed over time (slightly faster acceleration)
    speedRef.current = Math.min(60, speedRef.current + delta * 0.25);
    
    // Update player position - smooth lane transition
    const targetX = lanes[currentLane];
    const newX = THREE.MathUtils.lerp(playerPosition.x, targetX, delta * laneChangeSpeed);
    setPlayerPosition(prev => new THREE.Vector3(newX, prev.y, prev.z));
    
    if (Math.abs(playerPosition.x - targetX) < 0.1) {
      movingRef.current = false;
    }
    
    // Move existing objects using a safe approach to avoid cloning issues
    const updatedObjects = gameObjectsRef.current.map(obj => {
      // Create a new object with updated position to avoid mutation
      return {
        ...obj,
        position: new THREE.Vector3(
          obj.position.x,
          obj.position.y,
          obj.position.z + delta * speedRef.current
        )
      };
    });
    
    // Update ref and state
    gameObjectsRef.current = updatedObjects;
    setGameObjects([...updatedObjects]);
    
    // Spawn new objects
    spawnTimerRef.current -= delta;
    if (spawnTimerRef.current <= 0) {
      spawnObject();
      spawnTimerRef.current = 0.3 + Math.random() * 1.0;
    }
    
    // Check collisions
    checkCollisions();
  });

  return (
    <>
      {/* Water Environment Lighting - Bright blue tint */}
      <ambientLight intensity={0.8} color="#E6F2FF" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        color="#FFF8DC"
      />
      <pointLight position={[0, 10, 5]} intensity={0.8} color="#33C3F0" />
      
      {/* Bridge and Water Environment */}
      <fog attach="fog" args={['#E6F2FF', 30, 90]} />
      <Track speed={isPaused ? 0 : speedRef.current} />
      
      {/* Player */}
      <Player 
        position={playerPosition} 
        ref={playerRef} 
        speed={isPaused ? 0 : speedRef.current} 
      />

      {/* Game Objects (Obstacles & Collectibles) */}
      {gameObjects.map(obj => (
        obj.type === 'obstacle' ? 
          <Obstacle key={obj.id} position={obj.position} /> :
          obj.type === 'syringe' ?
            <Collectible key={obj.id} position={obj.position} /> :
            <Apple key={obj.id} position={obj.position} />
      ))}

      {/* Shadow catcher for bridge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[10, 200]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </>
  );
};

export default GameScene;
