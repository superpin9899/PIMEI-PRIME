import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María, 24 años',
    role: 'Insertada en sector retail',
    text: 'Encontré trabajo en 3 meses. El programa me ayudó a saber exactamente qué quería y cómo conseguirlo.',
    result: 'Empleo conseguido',
  },
  {
    name: 'Javier, 22 años',
    role: 'Emprendedor',
    text: 'No solo me ayudaron a buscar trabajo, me dieron las herramientas para crear mi propio negocio. Ahora tengo mi empresa.',
    result: 'Empresa propia',
  },
  {
    name: 'Laura, 26 años',
    role: 'Insertada en administración',
    text: 'Las simulaciones de entrevistas fueron clave. Llegué preparada y conseguí el trabajo en la primera entrevista.',
    result: 'Contrato indefinido',
  },
  {
    name: 'Carlos, 21 años',
    role: 'Insertado en logística',
    text: 'El sistema de logros me mantuvo motivado. Cada semana tenía un objetivo claro y veía mi progreso.',
    result: 'Promoción en 6 meses',
  },
];

const TestimonialsTicker = () => {
  return (
    <section className="px-6 py-20 sm:px-12 lg:px-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-4">Resultados reales</p>
          <h2 className="font-heading text-3xl text-gray-900 md:text-4xl mb-4">
            ¿Funciona de verdad? Mira lo que dicen quienes ya lo probaron
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No son promesas. Son resultados reales de jóvenes como tú que ya encontraron su camino.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all hover:shadow-xl"
            >
              <div className="absolute top-6 right-6 text-brand/20">
                <Quote size={40} />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">{testimonial.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <div className="rounded-full bg-brand/10 px-4 py-2">
                  <p className="text-xs font-semibold text-brand">{testimonial.result}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl border-2 border-brand bg-brand/5 p-8 text-center"
        >
          <p className="text-4xl font-bold text-brand mb-2">67%</p>
          <p className="text-gray-700 font-semibold mb-1">Tasa de inserción laboral</p>
          <p className="text-sm text-gray-600">Basado en datos reales del programa PRIME en Aragón</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsTicker;
