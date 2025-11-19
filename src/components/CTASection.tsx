import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const quickFacts = [
  'Gratuito y subvencionado',
  'Para jóvenes de 16 a 29 años',
  'Inscrito en oficina de empleo',
  '14 meses de acompañamiento',
];

const CTASection = () => (
  <section className="px-6 py-20 sm:px-12 lg:px-20 bg-gray-50">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-5xl rounded-4xl border border-brand/20 bg-gradient-to-r from-brand to-brand-soft px-8 py-12 text-white shadow-2xl"
    >
      <div className="grid gap-8 md:grid-cols-[2fr,1fr] md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/80 mb-4">¿Cumples los requisitos?</p>
          <h2 className="mt-3 font-heading text-3xl mb-6">
            Únete a PRIME y comienza tu camino hacia el empleo
          </h2>
          <ul className="space-y-3 mb-6">
            {quickFacts.map((fact, idx) => (
              <motion.li
                key={fact}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 text-white/90"
              >
                <CheckCircle2 size={18} className="flex-shrink-0" />
                <span>{fact}</span>
              </motion.li>
            ))}
          </ul>
          <p className="text-white/80 text-sm">
            Si estás inscrito en una oficina de empleo de Aragón y tienes entre 16 y 29 años, este programa es para ti.
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-wide text-white/80 mb-4">Accede ahora</p>
          <p className="text-sm text-white/90 mb-4">
            Inicia sesión si ya tienes cuenta o regístrate para comenzar tu itinerario personalizado.
          </p>
          <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-brand transition hover:bg-gray-100 flex items-center justify-center gap-2">
            Comenzar ahora
            <ArrowRight size={16} />
          </button>
          <p className="text-xs text-white/60 text-center">
            El acceso es gestionado por tu orientador/a
          </p>
        </div>
      </div>
    </motion.div>
  </section>
);

export default CTASection;
