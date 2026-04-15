import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validation } from '../../utils/validation';

export const LoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const emailError = validation.getEmailErrorMessage(email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    if (!password) {
      setError('La contraseña es requerida');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'No se pudo iniciar sesión. Revisa el servidor.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
          <p className="font-semibold">Error</p>
          <p className="mt-1 leading-6">{error}</p>
        </div>
      )}

      {/* Email input */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="tuemail@example.com"
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-corporate-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="email"
        />
      </div>

      {/* Password input */}
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          placeholder="tu contraseña (mín. 8 caracteres)"
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-corporate-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="current-password"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-corporate-purple via-purple-800 to-corporate-orange px-4 py-3 font-semibold text-white shadow-[0_14px_28px_rgba(138,28,140,0.28)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(138,28,140,0.34)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        )}
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
};
