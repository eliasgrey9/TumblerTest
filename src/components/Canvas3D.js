import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

const Canvas3D = () => {
  return (
      <Canvas>
        <directionalLight intensity={0.75} />
        <Scene />
      </Canvas>
  );
};

export default Canvas3D; 