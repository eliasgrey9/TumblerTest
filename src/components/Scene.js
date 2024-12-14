import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";

const Scene = () => {
  const objRef = useRef();
  const { selectedModel, selectedTexture } = useModel();

  const obj = useLoader(OBJLoader, `/images/${selectedModel}.obj`);
  const texture = selectedTexture ? 
    useLoader(TextureLoader, `/images/${selectedTexture}.jpg`) : null;

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            map: texture
          });
        }
      });
    }
  }, [obj, texture]);

  return (
    <group>
      <ambientLight intensity={.51} />
      <pointLight position={[10, 1, 6]} intensity={.5} />
      <OrbitControls />
      <primitive 
        ref={objRef}
        object={obj} 
        scale={45}
        position={[-.1,-3, -1]}
      />
    </group>
  );
};

export default Scene; 