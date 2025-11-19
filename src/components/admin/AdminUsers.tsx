import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, PlusCircle, Search, UserCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

type PrimeUser = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birthdate: string | null;
  gender: string | null;
  province: string | null;
  is_active: boolean;
  percentage_progress: number;
  is_woman: boolean | null;
  receives_benefits: boolean | null;
  created_at: string;
  updated_at: string;
};

const provinces = ['Zaragoza', 'Huesca', 'Teruel'];

const defaultFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  birthdate: '',
  gender: 'female',
  province: 'Zaragoza',
  is_woman: true,
  receives_benefits: false,
  password: '',
};

const AdminUsers = () => {
  const [users, setUsers] = useState<PrimeUser[]>([]);
  const [filters, setFilters] = useState({ search: '', province: '' });
  const [selectedUser, setSelectedUser] = useState<PrimeUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase.from('prime_users').select('*').order('created_at', { ascending: false });
      if (!mounted) return;
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const searchLower = filters.search.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.first_name.toLowerCase().includes(searchLower) ||
        user.last_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      const matchesProvince = filters.province ? user.province === filters.province : true;
      return matchesSearch && matchesProvince;
    });
  }, [users, filters]);

  const handleCreateUser = async () => {
    if (!formState.password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/create-admin-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Error creando usuario');
      }

      const payload = await response.json();
      setUsers((prev) => [payload.prime_user, ...prev]);
      setShowCreateModal(false);
      setFormState(defaultFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl space-y-8 rounded-4xl border border-gray-200 bg-white/80 p-8 shadow-2xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Gestión de usuarios</p>
            <h1 className="font-heading text-3xl text-gray-900">Beneficiarios PRIME</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand/30 transition hover:bg-brand-soft"
            >
              <PlusCircle size={16} />
              Crear usuario
            </button>
          </div>
        </header>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-600">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Buscar por nombre o email"
                className="flex-1 bg-transparent outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-600">
              <Filter size={16} />
              <select
                value={filters.province}
                onChange={(e) => setFilters((prev) => ({ ...prev, province: e.target.value }))}
                className="bg-transparent outline-none"
              >
                <option value="">Provincia</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500">Cargando usuarios...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">⚠️ {error}</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Listado</p>
              <p className="text-sm text-gray-500">{filteredUsers.length} usuarios encontrados</p>

              <div className="mt-6 space-y-4">
                {filteredUsers.map((user) => (
                  <button
                    key={user.user_id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      selectedUser?.user_id === user.user_id
                        ? 'border-brand bg-brand/5 text-brand'
                        : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-brand/40 hover:text-brand'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">{user.province || 'Provincia'}</div>
                  </button>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    No hay usuarios que cumplan el filtro actual.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              {selectedUser ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Perfil seleccionado</p>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h3>
                    </div>
                    <button className="text-sm text-brand hover:underline">Editar</button>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Contacto</p>
                    <p>{selectedUser.email}</p>
                    {selectedUser.phone && <p>Tel: {selectedUser.phone}</p>}
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Progreso</p>
                  <p>{selectedUser.percentage_progress}% del itinerario PRIME</p>
                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${Math.min(100, Number(selectedUser.percentage_progress))}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Indicadores</p>
                    <ul className="list-disc pl-5">
                      <li>Mujer: {selectedUser.is_woman ? 'Sí' : 'No'}</li>
                      <li>Prestaciones: {selectedUser.receives_benefits ? 'Sí' : 'No'}</li>
                      <li>Provincia: {selectedUser.province || '—'}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-gray-400">
                  <UserCircle size={48} />
                  <p className="mt-4 text-sm">Selecciona un usuario para ver su perfil</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            >
              <header className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Nuevo usuario</p>
                  <h3 className="text-xl font-semibold text-gray-900">Crear participante PRIME</h3>
                </div>
                <button
                  className="rounded-full border border-gray-200 p-2 text-gray-500 hover:border-gray-400"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle size={16} />
                </button>
              </header>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-gray-600">
                  Nombre
                  <input
                    value={formState.first_name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, first_name: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Apellidos
                  <input
                    value={formState.last_name}
                    onChange={(e) => setFormState((prev) => ({ ...prev, last_name: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-600 md:col-span-2">
                  Email
                  <input
                    value={formState.email}
                    onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Teléfono
                  <input
                    value={formState.phone}
                    onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Provincia
                  <select
                    value={formState.province}
                    onChange={(e) => setFormState((prev) => ({ ...prev, province: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  >
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm text-gray-600">
                  Fecha de nacimiento
                  <input
                    type="date"
                    value={formState.birthdate}
                    onChange={(e) => setFormState((prev) => ({ ...prev, birthdate: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-600">
                  Género
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState((prev) => ({ ...prev, gender: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  >
                    <option value="female">Mujer</option>
                    <option value="male">Hombre</option>
                    <option value="nonbinary">No binario</option>
                    <option value="other">Otro</option>
                  </select>
                </label>
                <label className="text-sm text-gray-600">
                  ¿Es mujer?
                  <select
                    value={formState.is_woman ? 'yes' : 'no'}
                    onChange={(e) => setFormState((prev) => ({ ...prev, is_woman: e.target.value === 'yes' }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  >
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="text-sm text-gray-600">
                  ¿Percibe prestaciones?
                  <select
                    value={formState.receives_benefits ? 'yes' : 'no'}
                    onChange={(e) => setFormState((prev) => ({ ...prev, receives_benefits: e.target.value === 'yes' }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  >
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label className="text-sm text-gray-600">
                  Contraseña
                  <input
                    type="password"
                    value={formState.password}
                    onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                  />
                </label>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleCreateUser}
                  disabled={creating}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {creating ? 'Creando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AdminUsers;

