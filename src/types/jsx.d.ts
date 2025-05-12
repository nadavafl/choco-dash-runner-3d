
import * as THREE from 'three';
import { Object3DNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      fog: Object3DNode<THREE.Fog, typeof THREE.Fog>;
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      coneGeometry: Object3DNode<THREE.ConeGeometry, typeof THREE.ConeGeometry>;
      dodecahedronGeometry: Object3DNode<THREE.DodecahedronGeometry, typeof THREE.DodecahedronGeometry>;
      meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      meshPhongMaterial: Object3DNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>;
      shadowMaterial: Object3DNode<THREE.ShadowMaterial, typeof THREE.ShadowMaterial>;
    }
  }
}
