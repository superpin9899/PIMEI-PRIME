import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, ArrowRight, QrCode, CheckCircle2, MapPin, Ticket } from 'lucide-react';

const BoardingPassCTA = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tu plaza está reservada.
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            El programa PRIME es un itinerario exclusivo gestionado por orientadores. 
            Verifica si cumples los requisitos para obtener tu pase de acceso.
          </p>
        </div>

        {/* THE TICKET CONTAINER */}
        <motion.div 
          className="relative w-full max-w-4xl mx-auto perspective-1000"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Main Ticket Body */}
          <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 relative group">
            
            {/* LEFT SIDE: FLIGHT INFO (Requirements) */}
            <div className="flex-1 p-8 md:p-10 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">TARJETA DE EMBARQUE</div>
                    <div className="text-lg font-bold text-gray-900">PRIME ACCESS</div>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-gray-400 uppercase">CLASE</div>
                  <div className="text-brand font-bold">PREMIUM</div>
                </div>
              </div>

              {/* Route Info */}
              <div className="flex items-center gap-8 mb-10 relative z-10">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">INICIO</div>
                  <div className="text-sm text-gray-500 font-medium">OFICINA DE EMPLEO</div>
                </div>
                <div className="flex-1 border-b-2 border-dashed border-gray-300 relative">
                  <motion.div 
                    animate={{ x: [-10, 100, -10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-3 left-0 text-brand"
                  >
                    <Plane size={24} className="rotate-90" />
                  </motion.div>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-black text-brand tracking-tight">ÉXITO</div>
                  <div className="text-sm text-gray-500 font-medium">MERCADO LABORAL</div>
                </div>
              </div>

              {/* Requirements List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {[
                  "Jóvenes 16-29 años",
                  "Inscrito en desempleo",
                  "Residente en Aragón",
                  "Compromiso total"
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DIVIDER (Perforation) */}
            <div className="relative w-full md:w-0 h-px md:h-auto border-t-2 md:border-l-2 border-dashed border-gray-300">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-white border-b-2 border-gray-200 md:hidden" /> {/* Top notch mobile */}
              <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-white border-b-2 border-gray-200 md:hidden" /> {/* Bottom notch mobile */}
              
              <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-white md:border-r-2 border-gray-200 hidden md:block" /> {/* Top notch desktop */}
              <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-white md:border-r-2 border-gray-200 hidden md:block" /> {/* Bottom notch desktop */}
            </div>

            {/* RIGHT SIDE: ACTION (Stub) */}
            <div className="w-full md:w-80 bg-gray-50 p-8 md:p-10 flex flex-col justify-between relative group-hover:bg-gray-100 transition-colors duration-300">
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">ACCIÓN REQUERIDA</div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  Valida tu perfil con tu orientador
                </h3>
              </div>

              {/* Barcode area */}
              <div className="flex-1 flex items-center justify-center opacity-50 mb-6">
                 <div className="h-12 w-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAOBAMAAAC5vfzgAAAAMFBMVEUAAAAAAAAAAACqqqoAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAABVVVUAAAAAAADDo8/fAAAAEHRSTlMADCaZ7v9XP3uwT5hwGQAAAFRJREFUGJVjYCAACIAhUD4DgwGQz8AAhExgCgIImYIFAYRMYAoCCJmCBQGETGAKAgibggUBhExgCgIImYIFQYRMQIIgQiYwBQGETMECAYRMwQIBhEwBAgC52wv10qU7WAAAAABJRU5ErkJggg==')] bg-repeat-x bg-contain" />
              </div>

              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand transition-all duration-300 shadow-lg hover:shadow-brand/20 group/btn">
                <MapPin size={18} />
                <span>Buscar Oficina</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* HOLOGRAPHIC SHINE EFFECT */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              style={{
                transform: 'skewX(-20deg) translateX(-150%)',
                transition: 'transform 0.5s',
              }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20"
              animate={{ x: ['-150%', '150%'] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: 5, ease: "easeInOut" }}
              style={{ transform: 'skewX(-20deg)' }}
            />

          </div>
        </motion.div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-b from-transparent via-gray-50/50 to-transparent -z-10 pointer-events-none rounded-full blur-3xl opacity-50" />

      </div>
    </section>
  );
};

export default BoardingPassCTA;

