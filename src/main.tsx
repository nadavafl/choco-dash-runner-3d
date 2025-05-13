
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useGLTF } from '@react-three/drei'

// Preload all 3D models used in the game to avoid loading issues
useGLTF.preload("/models/low_poly_scooter_draco.glb");
useGLTF.preload("/models/chocolate_bar.glb");
useGLTF.preload("/models/palm_trees_draco.glb");
useGLTF.preload("/models/syringe.glb");

createRoot(document.getElementById("root")!).render(<App />);
