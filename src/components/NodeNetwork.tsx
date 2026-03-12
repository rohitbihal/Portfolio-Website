"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NodeNetwork({ count = 1500 }) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions and initial velocities
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5; // z

      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;

    const mouseX = (state.pointer.x * state.viewport.width) / 2;
    const mouseY = (state.pointer.y * state.viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update position with velocity
      array[i3] += velocities[i3];
      array[i3 + 1] += velocities[i3 + 1];
      array[i3 + 2] += velocities[i3 + 2];

      // Keep points within bounds
      if (Math.abs(array[i3]) > 7.5) velocities[i3] *= -1;
      if (Math.abs(array[i3 + 1]) > 7.5) velocities[i3 + 1] *= -1;
      if (Math.abs(array[i3 + 2]) > 2.5) velocities[i3 + 2] *= -1;

      // Mouse interaction (repel)
      const dx = array[i3] - mouseX;
      const dy = array[i3 + 1] - mouseY;
      const distSq = dx * dx + dy * dy;

      if (distSq < 2) {
        const force = 0.05 / distSq;
        array[i3] += dx * force;
        array[i3 + 1] += dy * force;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation
    pointsRef.current.rotation.y += 0.001;
    pointsRef.current.rotation.x += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#1e3a8a" /* Primary deep blue */
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}
