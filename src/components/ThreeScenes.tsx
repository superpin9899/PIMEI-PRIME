import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Common Scene Setup ---
const SceneSetup = ({ children }: { children: React.ReactNode }) => (
  <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
    <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
    <ambientLight intensity={0.5} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
    <pointLight position={[-10, -10, -10]} intensity={0.5} />
    <Environment preset="city" />
    {children}
  </Canvas>
);

// --- 1. Methodology Scene (Abstract Progress Structure) ---
const ProgressStructure = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Main Block */}
        <mesh position={[-0.5, -0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial 
            color="#e04a52" 
            roughness={0.2} 
            metalness={0.1} 
            transparent 
            opacity={0.9} 
            transmission={0.2}
          />
        </mesh>
        
        {/* Secondary Block (Glassy) */}
        <mesh position={[0.3, 0.3, 0.3]} castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.1} 
            metalness={0.1} 
            transmission={0.6} 
            thickness={1}
            transparent
          />
        </mesh>

        {/* Floating Particles */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 1.5, Math.cos(i) * 1.5, 0]} scale={0.15}>
            <sphereGeometry />
            <meshStandardMaterial color="#e04a52" emissive="#e04a52" emissiveIntensity={2} />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

// --- 2. Itinerary Scene (Path/Spline Abstract) ---
const ItineraryPath = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Torus representing cycle/path */}
        <mesh rotation={[Math.PI / 4, 0, 0]} castShadow>
          <torusGeometry args={[1.2, 0.15, 16, 32]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Connecting Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0} 
            metalness={0.2} 
            transmission={0.9} 
            thickness={2}
          />
        </mesh>

        {/* Orbiting smaller spheres */}
        <mesh position={[1.2, 0, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </Float>
    </group>
  );
};

// --- 3. Tracking Scene (Data/Nodes) ---
const TrackingNodes = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Central Node */}
        <mesh>
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#10b981" flatShading roughness={0.2} metalness={0.5} />
        </mesh>

        {/* Connected Nodes (Satellite) */}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 1.8;
          const z = Math.sin(angle) * 1.8;
          return (
            <group key={i} position={[x, 0, z]}>
               <mesh>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial color="#34d399" />
              </mesh>
              {/* Connection Line (Thin Cylinder) */}
              <mesh position={[-x/2, 0, -z/2]} rotation={[0, -angle, Math.PI/2]}>
                <cylinderGeometry args={[0.02, 0.02, 1.8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
              </mesh>
            </group>
          );
        })}
      </Float>
    </group>
  );
};

export const SceneMethodology = () => (
  <SceneSetup><ProgressStructure /></SceneSetup>
);

export const SceneItinerary = () => (
  <SceneSetup><ItineraryPath /></SceneSetup>
);

export const SceneTracking = () => (
  <SceneSetup><TrackingNodes /></SceneSetup>
);

