import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Crown, Briefcase, BookOpen, Sparkles } from 'lucide-react';

type PrimeUser = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  province: string | null;
  percentage_progress: number;
  is_woman: boolean | null;
  receives_benefits: boolean | null;
  avatar_path: string | null;
};

type Training = {
  id: string;
  title: string;
  provider: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

type Experience = {
  id: string;
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
};

const UserProfile = () => {
  const { session } = useAuth();
  const [userData, setUserData] = useState<PrimeUser | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [training, setTraining] = useState<Training[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [trainingForm, setTrainingForm] = useState({
    id: '',
    title: '',
    provider: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [experienceForm, setExperienceForm] = useState({
    id: '',
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  useEffect(() => {
    if (!session?.user) return;

    const loadProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('prime_users')
        .select('first_name,last_name,email,phone,province,percentage_progress,is_woman,receives_benefits,avatar_path')
        .eq('user_id', session.user.id)
        .single();
      setUserData(data);
      if (data?.avatar_path) {
        const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(data.avatar_path);
        setAvatarUrl(publicUrl.publicUrl ? `${publicUrl.publicUrl}?t=${Date.now()}` : null);
      } else {
        setAvatarUrl(null);
      }

      const { data: trainingData } = await supabase
        .from('user_training')
        .select('id,title,provider,start_date,end_date,description')
        .eq('user_id', session.user.id)
        .order('start_date', { ascending: false });
      setTraining(trainingData || []);

      const { data: experienceData } = await supabase
        .from('user_experience')
        .select('id,company,role,start_date,end_date,description')
        .eq('user_id', session.user.id)
        .order('start_date', { ascending: false });
      setExperience(experienceData || []);

      setLoading(false);
    };
    loadProfile();
  }, [session?.user?.id]);

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user) return;

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const response = await fetch('/.netlify/functions/upload-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        base64,
        userId: session.user.id,
      }),
    });

    if (!response.ok) {
      console.error('Error subiendo avatar');
      return;
    }

    const payload = await response.json();
    setAvatarUrl(payload.publicUrl ? `${payload.publicUrl}?t=${Date.now()}` : null);
    setUserData((prev) => (prev ? { ...prev, avatar_path: payload.publicUrl } : prev));
  };

  const refreshTraining = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from('user_training')
      .select('id,title,provider,start_date,end_date,description')
      .eq('user_id', session.user.id)
      .order('start_date', { ascending: false });
    setTraining(data || []);
  };

  const refreshExperience = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from('user_experience')
      .select('id,company,role,start_date,end_date,description')
      .eq('user_id', session.user.id)
      .order('start_date', { ascending: false });
    setExperience(data || []);
  };

  const handleTrainingSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!session?.user) return;
    const payload = {
      user_id: session.user.id,
      title: trainingForm.title,
      provider: trainingForm.provider || null,
      start_date: trainingForm.start_date || null,
      end_date: trainingForm.end_date || null,
      description: trainingForm.description || null,
    };
    const { id } = trainingForm;
    if (id) {
      await supabase.from('user_training').update(payload).eq('id', id);
    } else {
      await supabase.from('user_training').insert(payload);
    }
    setShowTrainingForm(false);
    setTrainingForm({ id: '', title: '', provider: '', start_date: '', end_date: '', description: '' });
    refreshTraining();
  };

  const handleTrainingDelete = async (id: string) => {
    await supabase.from('user_training').delete().eq('id', id);
    refreshTraining();
  };

  const handleExperienceSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!session?.user) return;
    const payload = {
      user_id: session.user.id,
      company: experienceForm.company,
      role: experienceForm.role,
      start_date: experienceForm.start_date || null,
      end_date: experienceForm.end_date || null,
      description: experienceForm.description || null,
    };
    const { id } = experienceForm;
    if (id) {
      await supabase.from('user_experience').update(payload).eq('id', id);
    } else {
      await supabase.from('user_experience').insert(payload);
    }
    setShowExperienceForm(false);
    setExperienceForm({ id: '', company: '', role: '', start_date: '', end_date: '', description: '' });
    refreshExperience();
  };

  const handleExperienceDelete = async (id: string) => {
    await supabase.from('user_experience').delete().eq('id', id);
    refreshExperience();
  };

  if (!session) {
    return <div className="min-h-[60vh] bg-white px-6 py-24 text-center text-gray-500">Inicia sesión para ver tu perfil.</div>;
  }

  return (
    <section className="min-h-screen bg-[#f1f2f6] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          <div className="rounded-4xl border border-gray-200 bg-white/80 p-8 shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="relative h-20 w-20 overflow-hidden rounded-3xl border border-dashed border-gray-300 bg-gray-100"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Subir foto</span>
                  )}
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Perfil PRIME</p>
                  <h1 className="font-heading text-3xl text-gray-900">
                    {userData ? `${userData.first_name} ${userData.last_name}` : 'Cargando...'}
                  </h1>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
                <Sparkles size={16} />
                Editar perfil
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Progreso</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                  <Crown size={20} />
                </div>
                <div>
                  <p className="text-3xl font-semibold text-gray-900">{userData?.percentage_progress ?? 0}%</p>
                  <p className="text-sm text-gray-500">Avance total del itinerario PRIME</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-brand"
                  style={{ width: `${Math.min(100, userData?.percentage_progress ?? 0)}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Datos de contacto</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>Provincia: {userData?.province || '—'}</li>
                <li>Teléfono: {userData?.phone || 'Añade tu número'}</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Formación</p>
                <h2 className="text-xl font-semibold text-gray-900">Tu trayectoria formativa</h2>
              </div>
              <button
                onClick={() => {
                  setTrainingForm({ id: '', title: '', provider: '', start_date: '', end_date: '', description: '' });
                  setShowTrainingForm((prev) => !prev);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-1 text-sm text-gray-600"
              >
                <BookOpen size={18} />
                {showTrainingForm ? 'Cerrar' : 'Añadir formación'}
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {showTrainingForm && (
                <form onSubmit={handleTrainingSubmit} className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-xs uppercase text-gray-400">
                      Título
                      <input
                        required
                        value={trainingForm.title}
                        onChange={(e) => setTrainingForm((prev) => ({ ...prev, title: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Centro
                      <input
                        value={trainingForm.provider}
                        onChange={(e) => setTrainingForm((prev) => ({ ...prev, provider: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Inicio
                      <input
                        type="date"
                        value={trainingForm.start_date}
                        onChange={(e) => setTrainingForm((prev) => ({ ...prev, start_date: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Fin
                      <input
                        type="date"
                        value={trainingForm.end_date}
                        onChange={(e) => setTrainingForm((prev) => ({ ...prev, end_date: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                  </div>
                  <label className="mt-3 block text-xs uppercase text-gray-400">
                    Descripción
                    <textarea
                      value={trainingForm.description}
                      onChange={(e) => setTrainingForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <button type="submit" className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrainingForm(false)}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
              {training.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Añade aquí tus formaciones, certificados o cursos destacados.
                </div>
              )}
              {training.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.provider || 'Centro no especificado'}</p>
                  <p className="text-xs text-gray-400">
                    {item.start_date || 'Inicio'} — {item.end_date || 'Actualidad'}
                  </p>
                  {item.description && <p className="mt-2 text-sm text-gray-600">{item.description}</p>}
                  <div className="mt-3 flex gap-3 text-xs text-brand">
                    <button
                      onClick={() => {
                        setTrainingForm({
                          id: item.id,
                          title: item.title,
                          provider: item.provider || '',
                          start_date: item.start_date || '',
                          end_date: item.end_date || '',
                          description: item.description || '',
                        });
                        setShowTrainingForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleTrainingDelete(item.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Experiencia laboral</p>
                <h2 className="text-xl font-semibold text-gray-900">Tu carrera profesional</h2>
              </div>
              <button
                onClick={() => {
                  setExperienceForm({ id: '', company: '', role: '', start_date: '', end_date: '', description: '' });
                  setShowExperienceForm((prev) => !prev);
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-1 text-sm text-gray-600"
              >
                <Briefcase size={18} />
                {showExperienceForm ? 'Cerrar' : 'Añadir experiencia'}
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {showExperienceForm && (
                <form onSubmit={handleExperienceSubmit} className="rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-xs uppercase text-gray-400">
                      Empresa
                      <input
                        required
                        value={experienceForm.company}
                        onChange={(e) => setExperienceForm((prev) => ({ ...prev, company: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Puesto
                      <input
                        required
                        value={experienceForm.role}
                        onChange={(e) => setExperienceForm((prev) => ({ ...prev, role: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Inicio
                      <input
                        type="date"
                        value={experienceForm.start_date}
                        onChange={(e) => setExperienceForm((prev) => ({ ...prev, start_date: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                    <label className="text-xs uppercase text-gray-400">
                      Fin
                      <input
                        type="date"
                        value={experienceForm.end_date}
                        onChange={(e) => setExperienceForm((prev) => ({ ...prev, end_date: e.target.value }))}
                        className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                      />
                    </label>
                  </div>
                  <label className="mt-3 block text-xs uppercase text-gray-400">
                    Descripción
                    <textarea
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="mt-1 w-full rounded-2xl border border-gray-200 px-3 py-2"
                    />
                  </label>
                  <div className="mt-4 flex gap-3">
                    <button type="submit" className="rounded-2xl bg-brand px-4 py-2 text-sm font-semibold text-white">
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExperienceForm(false)}
                      className="rounded-2xl border border-gray-200 px-4 py-2 text-sm text-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
              {experience.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  Añade tus puestos anteriores y destaca tus responsabilidades.
                </div>
              )}
              {experience.map((job) => (
                <div key={job.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="text-lg font-semibold text-gray-900">{job.role}</p>
                  <p className="text-sm text-gray-500">{job.company}</p>
                  <p className="text-xs text-gray-400">
                    {job.start_date || 'Inicio'} — {job.end_date || 'Actualidad'}
                  </p>
                  {job.description && <p className="mt-2 text-sm text-gray-600">{job.description}</p>}
                  <div className="mt-3 flex gap-3 text-xs text-brand">
                    <button
                      onClick={() => {
                        setExperienceForm({
                          id: job.id,
                          company: job.company,
                          role: job.role,
                          start_date: job.start_date || '',
                          end_date: job.end_date || '',
                          description: job.description || '',
                        });
                        setShowExperienceForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleExperienceDelete(job.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-10 space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Resumen de progreso</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-center justify-between">
                  Nivel PRIME
                  <span className="rounded-2xl bg-brand/10 px-3 py-1 text-brand">1</span>
                </li>
                <li>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Exp acumulada</span>
                    <span>120 / 500</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-brand" style={{ width: '24%' }} />
                  </div>
                </li>
                <li>
                  <button className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    Centro de logros
                  </button>
                </li>
                <li>
                  <button className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    Gremio de misiones PRIME
                  </button>
                </li>
                <li>
                  <button className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                    Mi progreso global
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default UserProfile;

