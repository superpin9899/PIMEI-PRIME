import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import magnifyingGlassIcon from '../../assets/achievements/magnifying-glass.png';

type AchievementRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'celestial';
  xp_reward: number;
};

type UserAchievementRecord = {
  achievement_id: string;
  unlocked_at: string;
};

type AchievementWithStatus = AchievementRecord & {
  unlocked: boolean;
  unlocked_at: string | null;
};

const rarityLabels: Record<AchievementRecord['rarity'], string> = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
  celestial: 'Celestial',
};

const achievementIcons: Record<string, string> = {
  'empieza-la-aventura': magnifyingGlassIcon,
};

const UserAchievementsHub = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!session?.user) return;
      setLoading(true);
      const [{ data: achievementsData }, { data: unlockedData }] = await Promise.all([
        supabase.from('achievements').select('id,slug,title,description,rarity,xp_reward').order('created_at', { ascending: true }),
        supabase.from('user_achievements').select('achievement_id,unlocked_at').eq('user_id', session.user.id),
      ]);

      const unlockedMap = new Map<string, UserAchievementRecord>();
      ((unlockedData as UserAchievementRecord[]) || []).forEach((entry) => unlockedMap.set(entry.achievement_id, entry));

      const mapped = ((achievementsData as AchievementRecord[]) || []).map<AchievementWithStatus>((achievement) => ({
        ...achievement,
        unlocked: unlockedMap.has(achievement.id),
        unlocked_at: unlockedMap.get(achievement.id)?.unlocked_at ?? null,
      }));

      setAchievements(mapped);
      setSelectedId(mapped[0]?.id ?? null);
      setLoading(false);

      await supabase.from('prime_users').update({ last_achievements_view_at: new Date().toISOString() }).eq('user_id', session.user.id);
    };

    loadAchievements();
  }, [session?.user?.id]);

  const totalSlots = Math.max(achievements.length, 21);
  const slots = useMemo(
    () => Array.from({ length: totalSlots }, (_, index) => achievements[index] ?? null),
    [achievements, totalSlots]
  );

  const selectedAchievement = achievements.find((achievement) => achievement.id === selectedId) ?? null;

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
              {slots.map((achievement, index) => {
                if (!achievement) {
                  return (
                    <div
                      key={`placeholder-${index}`}
                      className="group relative flex aspect-square w-full max-w-[110px] items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 text-brand/30 overflow-hidden"
                    >
                      <Lock size={18} />
                    </div>
                  );
                }

                const isSelected = achievement.id === selectedId;
                const iconSrc = achievementIcons[achievement.slug];

                return (
                  <button
                    key={achievement.id}
                    onClick={() => setSelectedId(achievement.id)}
                    className={`group relative flex aspect-square w-full max-w-[110px] items-center justify-center rounded-3xl border border-gray-200 bg-gray-50 text-brand/50 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:bg-white overflow-hidden ${
                      isSelected ? 'border-brand bg-white shadow-lg shadow-brand/10' : ''
                    }`}
                  >
                    {iconSrc ? (
                      <>
                        <img
                          src={iconSrc}
                          alt={achievement.title}
                          className={`h-full w-full object-cover ${achievement.unlocked ? '' : 'opacity-30'}`}
                        />
                        {!achievement.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            <Lock size={20} />
                          </div>
                        )}
                      </>
                    ) : (
                      <Lock size={20} className={achievement.unlocked ? 'text-brand' : 'text-gray-400'} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Detalle del logro</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-5 text-sm text-gray-600">
                {loading && <p className="text-gray-500">Cargando logros…</p>}
                {!loading && !selectedAchievement && <p className="text-gray-500">Selecciona uno de los slots para revisar su detalle.</p>}
                {!loading && selectedAchievement && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {achievementIcons[selectedAchievement.slug] ? (
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
                          <img
                            src={achievementIcons[selectedAchievement.slug]}
                            alt={selectedAchievement.title}
                            className={`h-full w-full object-cover ${selectedAchievement.unlocked ? '' : 'opacity-30'}`}
                          />
                          {!selectedAchievement.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                              <Lock size={20} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white p-2 text-gray-400">
                          <Lock size={20} />
                        </div>
                      )}
                      <div>
                        <p className="text-base font-semibold text-gray-900">{selectedAchievement.title}</p>
                        <p className="text-xs text-gray-500">{rarityLabels[selectedAchievement.rarity]}</p>
                      </div>
                    </div>
                    {selectedAchievement.description && <p className="text-sm text-gray-600">{selectedAchievement.description}</p>}
                    <p className="text-xs text-gray-500">
                      Recompensa: <span className="font-semibold text-brand">{selectedAchievement.xp_reward} XP</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-xs uppercase tracking-[0.3em] text-gray-400">
                {selectedAchievement
                  ? selectedAchievement.unlocked
                    ? `Desbloqueado el ${new Date(selectedAchievement.unlocked_at ?? '').toLocaleDateString()}`
                    : 'Pendiente de desbloquear'
                  : 'Sin selección'}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default UserAchievementsHub;


