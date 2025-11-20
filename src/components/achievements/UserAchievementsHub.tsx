import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const totalSlots = 21;
const slots = Array.from({ length: totalSlots }, (_, index) => ({
  id: `slot-${index + 1}`,
}));

const UserAchievementsHub = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#eef1f7] px-4 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Centro de logros</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Avanza en tu itinerario PRIME para desbloquearlos todos!</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/perfil')}
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:-translate-y-0.5"
            >
              <ArrowLeft size={16} />
              Volver al perfil
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Logros</p>
              <span className="rounded-2xl bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">Vista general</span>
            </div>
            <div className="mt-5 grid grid-cols-3 justify-items-center gap-3 md:grid-cols-4 lg:grid-cols-5">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`group flex aspect-square w-full max-w-[110px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 text-brand/50 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:bg-white ${
                    selectedSlot === slot.id ? 'border-brand bg-white shadow-lg shadow-brand/10' : ''
                  }`}
                >
                  <div className="rounded-2xl bg-white p-3 shadow-sm transition duration-200 group-hover:shadow-md">
                    <Lock size={22} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Detalle del logro</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-5 text-sm text-gray-600">
                {selectedSlot ? (
                  <p className="text-gray-500">Contenido pendiente para este logro.</p>
                ) : (
                  <p className="text-gray-500">Selecciona uno de los slots para revisar su detalle.</p>
                )}
              </div>
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-xs uppercase tracking-[0.3em] text-gray-400">
                {selectedSlot ? `Slot activo: ${selectedSlot}` : 'Sin selección'}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default UserAchievementsHub;


