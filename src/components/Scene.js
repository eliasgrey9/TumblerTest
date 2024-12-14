import React, { useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";

const Scene = ({ onUvAspectChange }) => {
  const objRef = useRef();
  const previousModelRef = useRef(null);
  const { selectedModel, selectedTexture, textureScale, setUVDimensions } = useModel();

  const obj = useLoader(OBJLoader, `/images/${selectedModel}.obj`);
  const texture = selectedTexture ? 
    useLoader(TextureLoader, `/images/${selectedTexture}.jpg`) : null;

  useEffect(() => {
    if (obj && selectedModel !== previousModelRef.current) {
      previousModelRef.current = selectedModel;

      obj.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const geometry = child.geometry;
          geometry.computeBoundingBox();
          
          const boundingBox = geometry.boundingBox;
          const dimensions = {
            width: boundingBox.max.x - boundingBox.min.x,
            height: boundingBox.max.y - boundingBox.min.y,
            depth: boundingBox.max.z - boundingBox.min.z
          };

          // Calculate circumference using average of width and depth
          const diameter = (dimensions.width + dimensions.depth) / 2;
          const circumference = Math.PI * diameter;
          const height = dimensions.height;

          // Scale to match real-world dimensions (11" circumference)
          const scale = 11 / circumference;
          const scaledCircumference = 11; // Width when unwrapped
          const scaledHeight = height * scale;

          // Convert to eighths for precise fractions
          const widthInEighths = 11 * 8;  // 88 eighths
          const heightInEighths = Math.round(scaledHeight * 8); // 35 eighths (4.375")

          // Simplify the ratio
          const gcd = (a, b) => b ? gcd(b, a % b) : a;
          const divisor = gcd(widthInEighths, heightInEighths);
          const ratioString = `${widthInEighths/divisor}:${heightInEighths/divisor}`;

          console.log('UV Unwrap Analysis:', {
            physicalMeasurements: {
              circumference: `${scaledCircumference}"`,
              height: `${Math.floor(scaledHeight)}" ${Math.round((scaledHeight % 1) * 8)}/8"`,
            },
            unwrapDimensions: {
              width: scaledCircumference,
              height: scaledHeight,
            },
            aspectRatio: ratioString,
            inEighths: `${widthInEighths}:${heightInEighths}`
          });

          setUVDimensions({
            width: scaledCircumference,
            height: scaledHeight,
            ratio: ratioString
          });

          if (typeof onUvAspectChange === 'function') {
            onUvAspectChange(ratioString);
          }
        }
      });
    }
  }, [selectedModel, obj]);

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

      console.log('3D Texture Settings:', {
        textureScale,
        textureRepeat: texture.repeat,
        textureOffset: texture.offset,
        textureRotation: texture.rotation,
        textureMatrix: texture.matrix
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