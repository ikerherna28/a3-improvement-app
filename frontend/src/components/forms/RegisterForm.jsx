import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { validation } from '../../utils/validation';

export const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const validateForm = () => {
    const nameError = validation.getNameErrorMessage(formData.name);
    if (nameError) {
      setError(nameError);
      return false;
    }

    const emailError = validation.getEmailErrorMessage(formData.email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    if (!formData.password) {
      setError('La contraseña es requerida');
      return false;
    }

    const passwordError = validation.getPasswordErrorMessage(formData.password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }

    if (!validation.passwordsMatch(formData.password, formData.confirmPassword)) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      
      await register(formData.email, formData.password, formData.name);
      
      setSuccess('¡Registro exitoso! Bienvenido a A3 Mejora Continua.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Llamar callback si existe
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
          <p className="font-semibold">Error</p>
          <p className="mt-1 leading-6">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
          <p className="font-semibold">Éxito</p>
          <p className="mt-1 leading-6">{success}</p>
        </div>
      )}

      {/* Name input */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
          Nombre completo
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-corporate-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="name"
        />
      </div>

      {/* Email input */}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
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
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Min. 8 caracteres, 1 mayúscula, 1 número"
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-corporate-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-slate-500">
          Requiere: mín. 8 caracteres, 1 mayúscula, 1 número
        </p>
      </div>

      {/* Confirm Password input */}
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repite tu contraseña"
          disabled={isLoading}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-corporate-purple/30 disabled:cursor-not-allowed disabled:opacity-50"
          autoComplete="new-password"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !!success}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-corporate-purple via-corporate-orange to-orange-600 px-4 py-3 font-semibold text-white shadow-[0_14px_28px_rgba(242,98,15,0.26)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(242,98,15,0.3)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        )}
        {isLoading ? 'Registrándose...' : 'Crear cuenta'}
      </button>

      {/* Password strength indicator */}
      <PasswordStrengthIndicator 
        password={formData.password} 
        confirmPassword={formData.confirmPassword}
      />
    </form>
  );
};
