import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

const Canvas3D = ({ onUvAspectChange }) => {
  return (
    <Canvas>
      <directionalLight intensity={0.75} />
      <Scene onUvAspectChange={onUvAspectChange} />
    </Canvas>
  );
};

export default Canvas3D; 