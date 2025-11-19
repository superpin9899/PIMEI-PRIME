import { motion } from 'framer-motion';
import { Gamepad2, FileText, Sparkles } from 'lucide-react';

const differences = [
  {
    icon: Gamepad2,
    title: 'Sistema RPG completo',
    description:
      'Misiones, niveles, EXP, logros y recompensas. Tu progreso en el programa se siente como avanzar en un juego, pero con resultados reales.',
  },
  {
    icon: FileText,
    title: 'Adaptado a tu itinerario PRIME',
    description:
      'Cada misión está diseñada y pensada específicamente para los objetivos de tu itinerario, desde el primer contacto hasta tu inserción en el mundo laboral.',
  },
  {
    icon: Sparkles,
    title: 'Tu asistente personal',
    description:
      'Es facil perderse, pero no te preocupes, estamos contigo en todo el proceso.',
  },
];

const GamificationGrid = () => {
  return (
    <section className="px-6 py-20 sm:px-12 lg:px-20 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4">Lo que nos diferencia</p>
          <h2 className="font-heading text-3xl text-gray-900 md:text-4xl mb-4">
            No es otro programa más. Es PRIME.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            PRIME convierte tu proceso de inserción laboral en una experiencia RPG donde cada logro cuenta. Sube niveles y desbloquea logros adaptados a tu itinerario personalizado.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {differences.map((difference, idx) => (
            <motion.div
              key={difference.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all hover:border-brand hover:shadow-xl"
            >
              <div className="mb-6 inline-flex rounded-2xl bg-brand/10 p-4 text-brand">
                <difference.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{difference.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{difference.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl border-2 border-brand bg-gradient-to-r from-brand/5 to-brand/10 p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h3>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand">1</div>
              <p className="font-semibold text-gray-900">Tu técnico te asigna misiones</p>
              <p className="text-sm text-gray-600">Basadas en tu fase del itinerario PRIME y tu progreso</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand">2</div>
              <p className="font-semibold text-gray-900">Completas objetivos reales</p>
              <p className="text-sm text-gray-600">Y entregas a tu técnico lo indicado o "items" de la misión</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-brand">3</div>
              <p className="font-semibold text-gray-900">Subes de nivel y desbloqueas</p>
              <p className="text-sm text-gray-600">Desbloqueas nuevas misiones, logros y recompensas exclusivas</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GamificationGrid;
