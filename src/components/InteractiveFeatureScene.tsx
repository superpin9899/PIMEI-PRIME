import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  useGLTF, 
  Html, 
  ContactShadows,
  PerspectiveCamera,
  useProgress,
  Resize,
  Bounds
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, GraduationCap, Users, Activity, Loader2, ZoomIn, ZoomOut } from 'lucide-react';

// --- TYPES ---
type FeaturePoint = {
  id: number;
  position: [number, number, number];
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

interface HotspotProps {
  feature: FeaturePoint;
  selected: boolean;
  onSelect: (id: number) => void;
}

// --- DATA (Refined positions based on visual feedback - Lower altitudes) ---
const FEATURES: FeaturePoint[] = [
  {
    id: 1,
    position: [1.8, 0.5, 1.5], 
    title: "Hub de Formación",
    description: "Accede a formaciones preparadas específicamente para acelerar tu proceso de inserción.",
    icon: GraduationCap,
    color: "#3b82f6" 
  },
  {
    id: 2,
    position: [-0.2, 1.5, -0.5], 
    title: "Centro de Misiones",
    description: "Desbloquea misiones, logros y recompensas basados en tus objetivos específicos.",
    icon: Target,
    color: "#e04a52" 
  },
  {
    id: 3,
    position: [2.5, 0.2, -1.5], // MOVIDO DENTRO DE LA CIUDAD (TIERRA FIRME)
    title: "Zona de Networking",
    description: "Conecta con empresas y otros talentos. Tu red de contactos es tu mayor activo.",
    icon: Users,
    color: "#10b981" 
  },
  {
    id: 4,
    position: [-2.5, 0.8, 1.5], 
    title: "Torre de Control",
    description: "Monitoriza tu progreso en tiempo real con analíticas detalladas de tu evolución.",
    icon: Activity,
    color: "#8b5cf6" 
  }
];

// --- 3D COMPONENTS ---

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white bg-black/50 p-4 rounded-xl backdrop-blur-md">
        <Loader2 className="animate-spin text-brand" size={32} />
        <span className="text-xs font-mono">{progress.toFixed(0)}% CARGANDO CIUDAD...</span>
      </div>
    </Html>
  );
};

const CityModel = () => {
  const { scene } = useGLTF('/city_pack_3.glb');
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  return (
    <group>
      <Resize scale={8}>
        <primitive object={clonedScene} />
      </Resize>
    </group>
  );
};

const Hotspot = ({ feature, selected, onSelect }: HotspotProps) => {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(0);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(feature.id);
  };

  return (
    <group position={feature.position}>
      {/* LAYER 1: Marker (Always visible, interactive) */}
      <Html position={[0, 0, 0]} center zIndexRange={[100, 0]}>
        <div 
          className="relative cursor-pointer group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleOpen}
        >
          {/* Marker Circle */}
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border-2 ${
              selected 
                ? 'bg-white scale-125 border-transparent' 
                : 'bg-gray-900/80 backdrop-blur-sm border-white/20 hover:bg-brand hover:border-brand'
            }`}
            style={{ 
              boxShadow: selected ? `0 0 30px ${feature.color}` : '0 0 10px rgba(0,0,0,0.5)'
            }}
          >
            <div 
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                selected ? 'animate-pulse' : ''
              }`}
              style={{ backgroundColor: selected ? feature.color : 'white' }} 
            />
          </div>

          {/* Label (Hover) */}
          <div className={`absolute left-12 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 pointer-events-none border border-white/10 ${
            hovered && !selected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}>
            {feature.title}
          </div>
        </div>
      </Html>

      {/* LAYER 2: Modal (Separate Html instance to avoid layout shifts on the marker) */}
      {selected && (
        <Html position={[0, 0, 0]} zIndexRange={[110, 0]} style={{ pointerEvents: 'none' }}>
          <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
            {/* Spacer to push modal down */}
            <div className="h-14" />
            
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-96 pointer-events-auto"
              >
                <div className="relative w-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-transparent to-white/20" />
                  <div className="bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-xl p-6 shadow-2xl overflow-hidden relative text-left">
                    <div 
                      className="absolute top-0 left-0 w-full h-1 opacity-50" 
                      style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }} 
                    />
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                        style={{ color: feature.color }}
                      >
                        <Icon size={24} />
                      </div>
                      <button 
                        className="text-gray-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg hover:bg-white/10"
                        onClick={handleClose}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2 leading-tight">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- MAIN COMPONENT ---

const InteractiveFeatureScene = () => {
  const [selectedId, setSelectedId] = useState<number>(0);
  const controlsRef = useRef<any>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id === selectedId ? 0 : id);
  };

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  return (
    <div className="w-full h-[700px] relative bg-[#050505] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-white/80 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          ARRASTRA PARA ROTAR • SCROLL PARA ZOOM
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="p-3 bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand transition-colors shadow-lg"
          aria-label="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand transition-colors shadow-lg"
          aria-label="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
      </div>

      <Canvas dpr={[1, 2]} shadows>
        <PerspectiveCamera makeDefault position={[11, 9, 11]} fov={45} />
        
        <Suspense fallback={<Loader />}>
            <ambientLight intensity={2} /> 
            <directionalLight position={[10, 20, 5]} intensity={3} castShadow />
            <Environment preset="city" />
            
            {/* Reduced margin for more zoom (0.8 instead of 1.2) */}
            <Bounds fit clip observe margin={0.8}>
              <CityModel />
            </Bounds>

            <group>
              {FEATURES.map((feature) => (
                <Hotspot 
                  key={feature.id} 
                  feature={feature} 
                  selected={selectedId === feature.id}
                  onSelect={handleSelect}
                />
              ))}
            </group>

            <ContactShadows position={[0, -0.1, 0]} opacity={0.5} scale={50} blur={2} far={10} color="black" />
        </Suspense>

        <OrbitControls 
          ref={controlsRef}
          makeDefault
          target={[0, 0, 0]}
          enableZoom={false}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.1} 
          autoRotate={selectedId === 0}
          autoRotateSpeed={0.5}
          rotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
};

export default InteractiveFeatureScene;
