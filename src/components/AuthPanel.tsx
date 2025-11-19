import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputStyles =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 transition';

export const AuthPanel = () => {
  const { signIn, authError, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await signIn({ email, password });
      navigate('/admin');
    } catch {
      // error already handled in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
        <Lock size={16} />
        Acceso seguro
      </div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/60">Email institucional</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@tuorganizacion.es"
            required
            className={inputStyles}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/60">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className={inputStyles}
          />
        </div>
        {authError && <p className="rounded-2xl bg-brand/20 px-3 py-2 text-xs text-brand-fade">⚠️ {authError}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-white/95 px-4 py-3 text-center font-semibold text-brand transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Validando...' : 'Entrar al panel'}
        </button>
        {isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full rounded-2xl border border-white/20 px-4 py-3 text-center text-sm text-white/80 transition hover:border-white/60"
          >
            Ir al panel
          </button>
        )}
        <p className="text-center text-xs text-white/50">
          ¿Olvidaste la contraseña? <span className="text-brand-fade">Recupérala aquí</span>
        </p>
      </motion.form>
    </div>
  );
};

export default AuthPanel;

