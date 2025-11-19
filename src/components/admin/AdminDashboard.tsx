import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  Target,
  ListChecks,
  PlusCircle,
  Settings,
  FileSpreadsheet,
  UserPlus,
  Swords,
  Gift,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Panel general', icon: Shield },
  { label: 'Usuarios', icon: Users },
  { label: 'Misiones', icon: Target },
  { label: 'Logros y recompensas', icon: Gift },
  { label: 'Reportes', icon: FileSpreadsheet },
  { label: 'Configuración', icon: Settings },
];

const summaryCards = [
  { title: 'Técnicos activos', value: '12', trend: '+2 esta semana' },
  { title: 'Beneficiarios en PRIME', value: '480', trend: '60% mujeres' },
  { title: 'Misiones en curso', value: '135', trend: '18 pendientes' },
  { title: 'Inserciones certificadas', value: '67%', trend: 'Objetivo 70%' },
];

const missionPlaceholders = [
  { title: 'Fase 1 · Bienvenida RPG', owner: 'Andrea S.', status: 'Activa', type: 'Individual' },
  { title: 'Sprint de entrevistas', owner: 'Luis M.', status: 'Borrador', type: 'Grupal' },
  { title: 'Recompensas culturales', owner: 'Equipo Zaragoza', status: 'Programada', type: 'Eventos' },
];

const participantPlaceholders = [
  { name: 'Laura G.', lote: 'ZAR-01', progreso: '82%', misiones: 7 },
  { name: 'Carlos P.', lote: 'HUE-02', progreso: '45%', misiones: 4 },
  { name: 'Sara V.', lote: 'TER-01', progreso: '65%', misiones: 6 },
];

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="mx-auto max-w-6xl rounded-4xl border border-gray-200 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full rounded-3xl border border-gray-200 bg-white p-6 lg:w-64">
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-6">Panel técnico</p>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-gray-600 transition hover:bg-brand/10 hover:text-brand"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 rounded-2xl bg-brand/10 p-4 text-xs text-brand">
              Próximamente: creador visual de misiones y workflows automáticos para lotes de 30.
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <header className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Dashboard de administración</p>
                <h2 className="font-heading text-3xl text-gray-900">Fundación San Ezequiel · Sistemas</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                  <PlusCircle size={16} />
                  Nueva misión
                </button>
                <button
                  onClick={() => navigate('/adminusers')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
                >
                  <UserPlus size={16} />
                  Gestionar usuarios
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <div key={card.title} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.trend}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Misiones PRIME</p>
                    <h3 className="text-xl font-semibold text-gray-900">Creador de misiones RPG</h3>
                  </div>
                  <button className="text-sm font-semibold text-brand hover:underline">Ver todas</button>
                </div>
                <ul className="space-y-4">
                  {missionPlaceholders.map((mission) => (
                    <li
                      key={mission.title}
                      className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                    >
                      <p className="font-semibold text-gray-900">{mission.title}</p>
                      <p className="text-xs text-gray-500">
                        Responsable: {mission.owner} · Estado: {mission.status} · Tipo: {mission.type}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl bg-brand/5 px-4 py-3 text-sm text-brand">
                  Próximamente: plantillas de misiones por fase y recompensas automáticas.
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Seguimiento de beneficiarios</p>
                    <h3 className="text-xl font-semibold text-gray-900">Progreso por lote</h3>
                  </div>
                  <button className="text-sm font-semibold text-brand hover:underline">Exportar CSV</button>
                </div>
                <ul className="space-y-4">
                  {participantPlaceholders.map((participant) => (
                    <li key={participant.name} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{participant.name}</p>
                          <p className="text-xs text-gray-500">Lote {participant.lote}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{participant.progreso}</p>
                          <p className="text-xs text-gray-500">{participant.misiones} misiones completadas</p>
                        </div>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-brand"
                          style={{ width: participant.progreso }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-2xl bg-gray-100 px-4 py-3 text-xs text-gray-600">
                  Placeholder para filtros avanzados, alertas automáticas y generación de informes.
                </div>
              </motion.div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Acciones rápidas</p>
                <button className="text-sm font-semibold text-brand hover:underline">Ver historial</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-left text-sm text-gray-600 transition hover:border-brand hover:text-brand">
                  <ListChecks size={18} />
                  Diseñar nueva misión
                </button>
                <button className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-left text-sm text-gray-600 transition hover:border-brand hover:text-brand">
                  <Swords size={18} />
                  Asignar misión cooperativa
                </button>
                <button className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-left text-sm text-gray-600 transition hover:border-brand hover:text-brand">
                  <Users size={18} />
                  Crear orientador
                </button>
                <button className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-left text-sm text-gray-600 transition hover:border-brand hover:text-brand">
                  <Gift size={18} />
                  Configurar recompensa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

