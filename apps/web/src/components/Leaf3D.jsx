/* eslint-disable react/no-unknown-property */
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ScanningLeaf = () => {
  const leafRef = useRef();
  const scanLineRef = useRef();
  const particlesRef = useRef();

  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.3, 0.5, 0.5, 1, 0, 1.5);
    shape.bezierCurveTo(-0.5, 1, -0.3, 0.5, 0, 0);
    return shape;
  }, []);

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (leafRef.current) {
      leafRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      leafRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;
    }

    if (scanLineRef.current) {
      scanLineRef.current.rotation.z = time * 0.5;
      scanLineRef.current.position.y = Math.sin(time * 2) * 0.5;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={leafRef} position={[0, 0, 0]}>
        <extrudeGeometry args={[leafShape, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.05 }]} />
        <meshStandardMaterial 
          color="#1a4d2e" 
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <group ref={scanLineRef}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.8, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
        </mesh>
      </group>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00d4ff" transparent opacity={0.6} />
      </points>

      <pointLight position={[2, 2, 2]} intensity={1} color="#00d4ff" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color="#1a4d2e" />
      <ambientLight intensity={0.3} />
    </group>
  );
};

const Leaf3D = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ScanningLeaf />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Leaf3D;