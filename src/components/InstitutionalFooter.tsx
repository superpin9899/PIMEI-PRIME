import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const InstitutionalFooter = () => {
  return (
    <footer className="bg-[#5d0008] text-white pt-24 pb-8 relative overflow-hidden font-sans">
      {/* Elemento decorativo de fondo muy sutil */}
      <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24 border-b border-white/10 pb-16">
            
            {/* COLUMNA 1: IDENTIDAD (Logo grande + Misión) */}
            <div className="md:col-span-5 flex flex-col justify-between">
                <div className="mb-8">
                    {/* LOGO CON FILTRO BLANCO PURO PARA INTEGRACIÓN PERFECTA */}
                    <img 
                        src="https://fundacionsanezequiel.org/wp-content/uploads/2025/03/SanEzequielMoreno_Logotipo-scaled.png" 
                        alt="Fundación San Ezequiel Moreno" 
                        className="h-16 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>
                <p className="text-xl font-light leading-relaxed text-white/80 max-w-md">
                    Construyendo puentes hacia el empleo a través de la innovación social y la tecnología.
                </p>
            </div>

            {/* COLUMNA 2: NAVEGACIÓN LEGAL (Estilo lista grande) */}
            <div className="md:col-span-7 flex flex-col md:flex-row justify-end gap-12 md:gap-20 relative">
                {/* Typographic Background Detail */}
                <div className="absolute -top-10 right-0 select-none pointer-events-none opacity-[0.03] mix-blend-overlay">
                    <span className="text-[15rem] font-bold leading-none tracking-tighter">PRIME</span>
                </div>

                <div className="space-y-6 relative z-10">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Legal</h4>
                    <ul className="space-y-4">
                        {['Aviso Legal', 'Política de Privacidad', 'Política de Cookies'].map((item) => (
                            <li key={item}>
                                <a href="#" className="group flex items-center gap-2 text-lg font-medium text-white/70 hover:text-white transition-colors">
                                    <span className="w-0 group-hover:w-4 h-px bg-white transition-all duration-300"></span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-6 relative z-10">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Plataforma</h4>
                     <ul className="space-y-4">
                        {['Términos de Uso', 'Accesibilidad', 'Soporte'].map((item) => (
                            <li key={item}>
                                <a href="#" className="group flex items-center gap-2 text-lg font-medium text-white/70 hover:text-white transition-colors">
                                    <span className="w-0 group-hover:w-4 h-px bg-white transition-all duration-300"></span>
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* FOOTER BOTTOM: Minimalista */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/30 uppercase tracking-wider">
            <div className="flex gap-6 text-center md:text-left">
                <span>&copy; {new Date().getFullYear()} Fundación San Ezequiel Moreno</span>
                <span className="hidden md:inline">•</span>
                <span>Zaragoza, ES</span>
            </div>

            <div className="bg-white/5 px-3 py-1 rounded-full">
                <span>v0.1 Beta</span>
            </div>
            
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors group">
                Volver arriba
                <ArrowUpRight size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
        </div>

      </div>
    </footer>
  );
};

export default InstitutionalFooter;
