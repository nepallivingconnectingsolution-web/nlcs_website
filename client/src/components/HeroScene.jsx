import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* Fibonacci-sphere point distribution — gives an evenly spaced "globe of
   nodes" without the clustering you'd get from pure random placement. */
function fibonacciSphere(count, radius) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}

function NetworkCore() {
  const groupRef = useRef();
  const { viewport, pointer } = useThree();

  const nodeCount = 42;
  const radius = 2.5;
  const linkDistance = 1.55;

  const nodes = useMemo(() => fibonacciSphere(nodeCount, radius), []);

  const { linePositions, pointPositions } = useMemo(() => {
    const linePos = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < linkDistance) {
          linePos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const pointPos = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      pointPos[i * 3] = n.x;
      pointPos[i * 3 + 1] = n.y;
      pointPos[i * 3 + 2] = n.z;
    });
    return { linePositions: new Float32Array(linePos), pointPositions: pointPos };
  }, [nodes]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Slow constant auto-rotation…
    groupRef.current.rotation.y += delta * 0.09;
    // …plus a gentle parallax tilt that follows the pointer.
    const targetX = (pointer.y * Math.PI) / 16;
    const targetZ = (-pointer.x * Math.PI) / 20;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef} scale={Math.min(1, viewport.width / 9)}>
      {/* Wireframe inner core — the "solid" digital heart of the network */}
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#5C8DFF" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Connecting edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#2F6BFF" transparent opacity={0.35} />
      </lineSegments>

      {/* Glowing nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fe8cf" size={0.065} sizeAttenuation transparent opacity={0.95} />
      </points>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#5C8DFF" />
      <NetworkCore />
    </Canvas>
  );
}
