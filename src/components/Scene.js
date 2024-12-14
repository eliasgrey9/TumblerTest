import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";

const Scene = () => {
  const objRef = useRef();
  const { selectedModel, selectedTexture, textureScale, setUVDimensions } = useModel();

  const obj = useLoader(OBJLoader, `/images/${selectedModel}.obj`);
  const texture = selectedTexture ? 
    useLoader(TextureLoader, `/images/${selectedTexture}.jpg`) : null;

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
          const geometry = child.geometry;
          const uvAttribute = geometry.attributes.uv;
          const positionAttribute = geometry.attributes.position;

          // Find UV bounds
          let minU = Infinity, maxU = -Infinity;
          let minV = Infinity, maxV = -Infinity;

          for (let i = 0; i < uvAttribute.count; i++) {
            const u = uvAttribute.getX(i);
            const v = uvAttribute.getY(i);
            minU = Math.min(minU, u);
            maxU = Math.max(maxU, u);
            minV = Math.min(minV, v);
            maxV = Math.max(maxV, v);
          }

          // Calculate real-world dimensions
          const width = (maxU - minU) * 2048; // Base resolution multiplier
          const height = (maxV - minV) * 2048;

          // Store UV dimensions in context
          setUVDimensions({
            width,
            height,
            aspectRatio: width / height
          });
        }
      });
    }
  }, [obj, setUVDimensions]);

  useEffect(() => {
    if (obj && texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(textureScale, textureScale);
      texture.needsUpdate = true;

      obj.traverse((child) => {
        if (child.isMesh) {
          const geometry = child.geometry;
          for (let i = 0; i < geometry.attributes.position.count; i++) {
            geometry.attributes.normal.array[i * 3] *= -1;
            geometry.attributes.normal.array[i * 3 + 1] *= -1;
            geometry.attributes.normal.array[i * 3 + 2] *= -1;
          }
          geometry.attributes.normal.needsUpdate = true;

          const outsideMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.FrontSide,
          });

          const insideMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            side: THREE.BackSide,
            metalness: 0.1,
            roughness: 0.5
          });

          child.material = [outsideMaterial, insideMaterial];
          child.material.needsUpdate = true;
        }
      });
    }
  }, [obj, texture, textureScale]);

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