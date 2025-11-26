import { motion } from 'framer-motion';
import InteractiveFeatureScene from './InteractiveFeatureScene';
import HowItWorksAnimation from './HowItWorksAnimation';

const GamificationGrid = () => {
  return (
    <section className="px-6 py-24 sm:px-12 lg:px-20 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            EXPERIENCIA PRIME
          </div>
          <h2 className="font-heading text-3xl text-gray-900 md:text-4xl lg:text-5xl mb-6 leading-tight">
            Tu camino hacia el empleo,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-soft">visualizado.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Descubre cómo transformamos tu proceso de inserción en una experiencia tangible y motivadora.
          </p>
        </motion.div>

        {/* The Main Interactive 3D Scene */}
        <div className="w-full mb-32">
           <InteractiveFeatureScene />
        </div>

        <HowItWorksAnimation />

      </div>
    </section>
  );
};

export default GamificationGrid;
