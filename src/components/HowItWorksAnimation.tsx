import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Trophy, Star, User, ArrowRight, Terminal } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Credenciales de Acceso',
    description: 'Tu técnico PRIME te facilita tu usuario y contraseña únicos.',
    color: '#5d0008',
    accent: '#ef4444',
  },
  {
    id: 2,
    title: 'Misiones y Logros',
    description: 'Entra en la plataforma, completa objetivos reales y gana experiencia.',
    color: '#8a1a22',
    accent: '#f87171',
  },
  {
    id: 3,
    title: 'Desbloqueo de Fases',
    description: 'Supera niveles para abrir nuevas misiones más complejas y recompensas.',
    color: '#a82a32',
    accent: '#fca5a5',
  },
  {
    id: 4,
    title: 'Nivel Máximo',
    description: 'Completa tu itinerario PRIME y conviértete en una leyenda.',
    color: '#c63a42',
    accent: '#fee2e2',
  },
];

// --- Micro-Scenes Components ---

const SceneCredentials = () => (
  <div className="relative flex flex-col items-center justify-center h-full w-full">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-40 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
    >
      {/* Scan line effect */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-red-500/50 blur-sm"
      />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div className="h-2 w-24 bg-white/20 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="h-8 bg-black/40 rounded flex items-center px-3 font-mono text-xs text-green-400">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 'auto' }}
            transition={{ duration: 1.5 }} // Removed invalid 'steps' property
            className="overflow-hidden whitespace-nowrap"
          >
            access_prime_v1
          </motion.span>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-4 bg-green-400 ml-1"
          />
        </div>
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="h-1 bg-green-500 rounded-full" 
        />
      </div>
    </motion.div>
  </div>
);

const SceneMissions = () => {
  const items = [0, 1, 2];
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full gap-3">
      {items.map((i) => (
        <motion.div
          key={i}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.4, type: 'spring' }}
          className="w-64 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center px-4 gap-3 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.4 + 0.3 }}
          >
            <CheckCircle2 size={20} className="text-green-400" />
          </motion.div>
          <div className="flex-1 space-y-2">
            <div className="h-2 w-32 bg-white/20 rounded-full" />
          </div>
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ delay: i * 0.4 + 0.2 }}
            className="text-xs font-bold text-white/50"
          >
            +100 XP
          </motion.div>
          
          {/* Shine effect */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ delay: i * 0.4 + 0.5, duration: 1, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
          />
        </motion.div>
      ))}
    </div>
  );
};

const SceneUnlock = () => (
  <div className="relative flex items-center justify-center h-full w-full">
    <div className="relative">
      {/* Rotating Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-8 border border-dashed border-white/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-16 border border-white/10 rounded-full opacity-50"
      />
      
      {/* Lock Animation */}
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-red-900 to-black rounded-2xl border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="lock-icon"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          >
            <Lock size={40} className="text-white" />
          </motion.div>
        </AnimatePresence>
        
        {/* Particles bursting out */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1],
              x: Math.cos(i * 60 * (Math.PI / 180)) * 60,
              y: Math.sin(i * 60 * (Math.PI / 180)) * 60,
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            className="absolute w-2 h-2 bg-red-500 rounded-full blur-[1px]"
          />
        ))}
      </motion.div>
    </div>
  </div>
);

const SceneVictory = () => (
  <div className="relative flex items-center justify-center h-full w-full">
    <motion.div
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10"
    >
      <Trophy size={100} className="text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" strokeWidth={1.5} />
      
      {/* Stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 0], 
            opacity: [0, 1, 0],
            y: -50 - Math.random() * 50,
            x: (Math.random() - 0.5) * 100
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <Star size={16} className="text-yellow-200 fill-yellow-100" />
        </motion.div>
      ))}
    </motion.div>
    
    {/* God rays */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent w-full h-full blur-xl"
      style={{ transformOrigin: "bottom center" }}
    />
  </div>
);

const HowItWorksAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 5000); // Slower interval to appreciate the animations
    return () => clearInterval(interval);
  }, [isInView]);

  const renderScene = (index: number) => {
    switch(index) {
      case 0: return <SceneCredentials />;
      case 1: return <SceneMissions />;
      case 2: return <SceneUnlock />;
      case 3: return <SceneVictory />;
      default: return <SceneCredentials />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
      className="mt-16 w-full"
    >
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0f] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand/5 pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          
          {/* Left Side: Content & Navigation */}
          <div className="p-8 lg:p-12 flex flex-col justify-between relative z-10">
            <div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-soft mb-8"
              >
                <Terminal size={12} />
                SISTEMA PRIME v1.0
              </motion.div>

              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`text-left group w-full transition-all duration-300 ${
                      currentStep === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className={`text-sm font-mono font-bold transition-colors ${
                        currentStep === idx ? 'text-brand' : 'text-white/30'
                      }`}>
                        0{step.id}
                      </span>
                      <div>
                        <h4 className={`text-xl font-bold mb-2 transition-colors ${
                          currentStep === idx ? 'text-white' : 'text-white/80'
                        }`}>
                          {step.title}
                        </h4>
                        <AnimatePresence>
                          {currentStep === idx && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="text-white/60 leading-relaxed overflow-hidden"
                            >
                              {step.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <motion.div
                key={currentStep}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-brand"
              />
            </div>
          </div>

          {/* Right Side: The Stage */}
          <div className="relative bg-gradient-to-b from-white/5 to-transparent border-l border-white/5 overflow-hidden flex items-center justify-center p-8 lg:p-12">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-sm aspect-square"
              >
                {/* Glow behind the scene */}
                <div 
                  className="absolute inset-0 bg-brand rounded-full blur-[100px] opacity-20 animate-pulse" 
                  style={{ backgroundColor: steps[currentStep].color }}
                />
                
                {renderScene(currentStep)}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorksAnimation;
