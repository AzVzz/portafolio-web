import { useState } from 'react';
import { login } from '../../lib/api';

interface Props {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(user, password);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-white text-center">Dashboard</h1>

        {error && (
          <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-2">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Usuario</label>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
