import React, { useRef, useEffect } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";
import { createDiamondPattern } from "../utils/patternUtils";

const createSvgTexture = (svgString, size = 512) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
      
      URL.revokeObjectURL(url);
      resolve(texture);
    };

    img.onerror = (err) => {
      console.error('Error loading SVG:', err);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
};

const Scene = ({ onUvAspectChange }) => {
  const objRef = useRef();
  const previousModelRef = useRef(null);
  const { selectedModel, selectedTexture, textureScale, uvDimensions, setUVDimensions } = useModel();
  const { invalidate } = useThree();

  const obj = useLoader(OBJLoader, `/images/${selectedModel}.obj`);

  useEffect(() => {
    if (obj) {
      obj.traverse((child) => {
        if (child.isMesh) {
          const geometry = child.geometry;
          const uvAttribute = geometry.attributes.uv;
          
          if (uvAttribute) {
            let minU = Infinity, maxU = -Infinity;
            let minV = Infinity, maxV = -Infinity;

            for (let i = 0; i < uvAttribute.count; i++) {
              const u = uvAttribute.array[i * 2];
              const v = uvAttribute.array[i * 2 + 1];
              
              minU = Math.min(minU, u);
              maxU = Math.max(maxU, u);
              minV = Math.min(minV, v);
              maxV = Math.max(maxV, v);
            }

            const width = maxU - minU;
            const height = maxV - minV;
            
            setUVDimensions({ width, height });
          }
        }
      });
    }
  }, [obj, setUVDimensions]);

  useEffect(() => {
    if (obj && selectedTexture && uvDimensions) {
      const applyTextureToMesh = async (texture) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            const geometry = child.geometry;
            // Flip normals if needed
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
              metalness: 0.1,
              roughness: 0.8,
              transparent: false,
              opacity: 1,
              alphaTest: 0,
              depthWrite: true,
              depthTest: true
            });

            const insideMaterial = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              side: THREE.BackSide,
              metalness: 0.1,
              roughness: 0.5,
              opacity: 1,
              depthWrite: true,
              depthTest: true
            });

            child.material = [outsideMaterial, insideMaterial];
            child.material.needsUpdate = true;
          }
        });
        invalidate();
      };

      const loadTexture = async () => {
        try {
          if (selectedTexture === 'diamond_pattern') {
            const svgString = createDiamondPattern(uvDimensions, textureScale);
            const texture = await createSvgTexture(svgString);
            await applyTextureToMesh(texture);
          } else {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(`/images/${selectedTexture}.jpg`, (texture) => {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              texture.repeat.set(1, 1);
              applyTextureToMesh(texture);
            });
          }
        } catch (error) {
          console.error('Error loading texture:', error);
        }
      };

      loadTexture();
    }
  }, [obj, selectedTexture, textureScale, uvDimensions, invalidate]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
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