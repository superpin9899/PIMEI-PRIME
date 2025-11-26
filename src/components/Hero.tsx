import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import AuthPanel from './AuthPanel';
import { WavyBackground } from './ui/wavy-background';

const Hero = () => {
  return (
    <WavyBackground
      containerClassName="relative isolate overflow-hidden py-24"
      className="w-full"
      colors={['#5d0008', '#8a1a22', '#a82a32', '#c63a42', '#e04a52']}
      backgroundFill="#0a0a0f"
      waveOpacity={0.3}
      blur={15}
      speed="slow"
    >
      <div className="mx-auto grid max-w-6xl gap-16 px-6 sm:px-12 lg:grid-cols-2 lg:px-20">
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white backdrop-blur-sm"
          >
            <Sparkles size={14} />
            PRIME Gamificatión
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
          >
            Tu aventura laboral comienza hoy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base text-white/70 md:text-lg"
          >
            Diseñado para jóvenes de 19 a 29 años que buscan oportunidades laborales innovadoras y frescas. Realiza misiones,
            recoge recompensas coleccionables al asistir a cursor, sube de nivel y potencia tu personaje para que cada fase del programa se
            sienta viva, dinámica y especial.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-xs uppercase tracking-[0.4em] text-white/50"
          >
            Sistema desarrollado por la Fundación San Ezequiel Moreno
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand-soft">
              Explorar demo interactiva
              <ArrowRight className="transition group-hover:translate-x-1" size={16} />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white">
              Descargar dossier
            </button>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute -left-6 -top-6 h-16 w-16 rounded-2xl bg-brand/60 blur-2xl" />
          <div className="absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-brand-soft/30 blur-3xl" />
          <div className="w-full">
            <AuthPanel />
          </div>
        </motion.div>
      </div>
    </WavyBackground>
  );
};

export default Hero;

