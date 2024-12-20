import React, { useRef, useEffect } from "react";
import { suspend } from "suspend-react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useModel } from "../context/ModelContext";
import { createDiamondPattern } from "../utils/patternUtils";

const createSvgTexture = (svgString, size = 512) => {
	return new Promise((resolve) => {
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d");

		const img = new Image();
		const blob = new Blob([svgString], { type: "image/svg+xml" });
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
			console.error("Error loading SVG:", err);
			URL.revokeObjectURL(url);
		};

		img.src = url;
	});
};

const calculateGeometryDimensions = (geometry, patternArea) => {
	const positions = geometry.attributes.position;
	const uvs = geometry.attributes.uv;

	// Group vertices by Y coordinate (with some tolerance for floating point)
	const slices = new Map();

	for (let i = 0; i < positions.count; i++) {
		const u = uvs.array[i * 2];
		const v = uvs.array[i * 2 + 1];

		// Only consider vertices in our UV pattern area
		if (
			u >= patternArea.minU &&
			u <= patternArea.maxU &&
			v >= patternArea.minV &&
			v <= patternArea.maxV
		) {
			const x = positions.array[i * 3];
			const y = positions.array[i * 3 + 1];
			const z = positions.array[i * 3 + 2];

			// Group by Y coordinate, rounded to 4 decimal places
			const yKey = Math.round(y * 10000) / 10000;
			if (!slices.has(yKey)) {
				slices.set(yKey, new Set());
			}

			// Store unique positions at this Y level
			slices.get(yKey).add(JSON.stringify([x, z]));
		}
	}

	// Find the slice with the most points for circumference calculation
	let maxPoints = 0;
	let bestSlice = null;
	for (const [y, points] of slices) {
		if (points.size > maxPoints) {
			maxPoints = points.size;
			bestSlice = {
				y,
				points: Array.from(points).map((p) => JSON.parse(p)),
			};
		}
	}

	if (bestSlice) {
		// Sort points by angle around the center
		const points = bestSlice.points;
		const center = points.reduce(
			(acc, [x, z]) => ({
				x: acc.x + x / points.length,
				z: acc.z + z / points.length,
			}),
			{ x: 0, z: 0 },
		);

		const sortedPoints = points.sort((a, b) => {
			const angleA = Math.atan2(a[1] - center.z, a[0] - center.x);
			const angleB = Math.atan2(b[1] - center.z, b[0] - center.x);
			return angleA - angleB;
		});

		// Calculate true circumference
		let circumference = 0;
		for (let i = 0; i < sortedPoints.length; i++) {
			const current = sortedPoints[i];
			const next = sortedPoints[(i + 1) % sortedPoints.length];
			const dx = next[0] - current[0];
			const dz = next[1] - current[1];
			circumference += Math.sqrt(dx * dx + dz * dz);
		}

		// Get height (max Y - min Y)
		let minY = Infinity,
			maxY = -Infinity;
		for (let i = 0; i < positions.count; i++) {
			const y = positions.array[i * 3 + 1];
			minY = Math.min(minY, y);
			maxY = Math.max(maxY, y);
		}
		const height = maxY - minY;

		console.log("Detailed measurements:", {
			circumference,
			height,
			aspectRatio: height / circumference,
			pointCount: sortedPoints.length,
			yLevel: bestSlice.y,
			uniqueYLevels: slices.size,
		});

		return {
			width: circumference,
			height,
			aspectRatio: height / circumference,
		};
	}

	return null;
};

const Scene = ({ onUvAspectChange }) => {
	const objRef = useRef();
	const previousModelRef = useRef(null);
	const {
		selectedModel,
		selectedTexture,
		textureScale,
		uvDimensions,
		geometryRatio,
		setUVDimensions,
		setGeometryRatio,
		count,
	} = useModel();
	const { invalidate } = useThree();

	// Had to add this because for some reason the server wouldn't serve objs, so I had to include a express server
	// const obj = useLoader(
	// 	OBJLoader,
	// 	`http://localhost:3001/images/${selectedModel}.obj`,
	// );

	const obj = useLoader(OBJLoader, `/images/${selectedModel}.obj`);

	useEffect(() => {
		if (obj) {
			obj.traverse((child) => {
				if (child.isMesh) {
					const geometry = child.geometry;
					const uvAttribute = geometry.attributes.uv;
					const patternArea = {
						minU: 0.0,
						maxU: 1,
						minV: 0.0,
						maxV: 1,
					};

					const geometryDimensions = calculateGeometryDimensions(
						geometry,
						patternArea,
					);

					if (geometryDimensions) {
						// Rounding off to 2 decimals
						const truncRatio =
							Math.trunc(geometryDimensions.aspectRatio * 100) / 100;
						// Not sure why but x2 gets us there
						setGeometryRatio(truncRatio * 2);
					}

					if (uvAttribute) {
						let minU = Infinity,
							maxU = -Infinity;
						let minV = Infinity,
							maxV = -Infinity;

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
	}, [obj, setUVDimensions, setGeometryRatio]);

	useEffect(() => {
		if (obj && selectedTexture && uvDimensions) {
			const applyTextureToMesh = async (texture) => {
				obj.traverse((child) => {
					if (child.isMesh) {
						console.log("Applying materials to mesh:", child.name);
						const geometry = child.geometry;

						// Flip normals if needed
						for (let i = 0; i < geometry.attributes.position.count; i++) {
							geometry.attributes.normal.array[i * 3] *= -1;
							geometry.attributes.normal.array[i * 3 + 1] *= -1;
							geometry.attributes.normal.array[i * 3 + 2] *= -1;
						}
						geometry.attributes.normal.needsUpdate = true;

						const texturedMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							map: texture,
							side: THREE.FrontSide,
							metalness: 0.1,
							roughness: 0.8,
						});

						const plainMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							side: THREE.FrontSide,
							metalness: 0.1,
							roughness: 0.8,
						});

						const insideMaterial = new THREE.MeshStandardMaterial({
							color: 0xffffff,
							side: THREE.BackSide,
							metalness: 0.1,
							roughness: 0.5,
						});

						const uv = geometry.attributes.uv;
						let minU = Infinity,
							maxU = -Infinity;
						let minV = Infinity,
							maxV = -Infinity;

						for (let i = 0; i < uv.count; i++) {
							const u = uv.array[i * 2];
							const v = uv.array[i * 2 + 1];
							minU = Math.min(minU, u);
							maxU = Math.max(maxU, u);
							minV = Math.min(minV, v);
							maxV = Math.max(maxV, v);
						}

						const patternArea = {
							minU: 0.0,
							maxU: 1,
							minV: 0.0,
							maxV: 1,
						};

						// Create groups for different materials
						const vertexCount = geometry.attributes.position.count;
						const patternIndices = [];
						const plainIndices = [];

						// Group vertices based on their UV coordinates
						for (let i = 0; i < vertexCount; i += 3) {
							const u1 = uv.array[i * 2];
							const v1 = uv.array[i * 2 + 1];

							if (
								u1 >= patternArea.minU &&
								u1 <= patternArea.maxU &&
								v1 >= patternArea.minV &&
								v1 <= patternArea.maxV
							) {
								patternIndices.push(i, i + 1, i + 2);
							} else {
								plainIndices.push(i, i + 1, i + 2);
							}
						}

						// Apply materials
						child.material = [texturedMaterial, plainMaterial, insideMaterial];
						child.material.needsUpdate = true;
					}
				});
				invalidate();
			};

			const loadTexture = async () => {
				try {
					console.log("Creating diamond pattern with:", {
						uvDimensions,
						geometryRatio,
						count,
						textureScale,
					});
					const svgString = createDiamondPattern(
						uvDimensions,
						geometryRatio,
						count,
						textureScale,
					);
					const texture = await createSvgTexture(svgString);
					await applyTextureToMesh(texture);
				} catch (error) {
					console.error("Error loading texture:", error);
				}
			};

			loadTexture();
		}
	}, [
		obj,
		selectedTexture,
		textureScale,
		uvDimensions,
		invalidate,
		geometryRatio,
		count,
	]);

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
				position={[-0.1, -3, -1]}
			/>
		</group>
	);
};

export default Scene;
