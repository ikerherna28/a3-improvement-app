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
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-pulse">
          <p className="font-semibold">❌ Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm animate-pulse">
          <p className="font-semibold">✅ Éxito</p>
          <p>{success}</p>
        </div>
      )}

      {/* Name input */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-purple focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
          autoComplete="name"
        />
      </div>

      {/* Email input */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-purple focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
          autoComplete="email"
        />
      </div>

      {/* Password input */}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-purple focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
          autoComplete="new-password"
        />
        <p className="text-xs text-gray-500 mt-1">
          Requiere: mín. 8 caracteres, 1 mayúscula, 1 número
        </p>
      </div>

      {/* Confirm Password input */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-corporate-purple focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100"
          autoComplete="new-password"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !!success}
        className="w-full bg-corporate-orange hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
