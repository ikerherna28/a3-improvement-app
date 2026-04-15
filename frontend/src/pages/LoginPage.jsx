import { useNavigate, Link } from 'react-router-dom';
import { LoginForm } from '../components/forms/LoginForm';
import { AuthLayout } from '../components/layouts/AuthLayout';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout title="Inicia sesión en tu cuenta">
      {/* Formulario de login */}
      <LoginForm onSuccess={handleLoginSuccess} />

      {/* Link a registro */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-corporate-purple font-semibold hover:underline transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Demo credentials info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-xs text-center">
        <p className="font-semibold mb-2">🔓 Credenciales de demostración:</p>
        <p>Email: <code className="bg-blue-100 px-2 py-1 rounded">admin@example.com</code></p>
        <p>Contraseña: <code className="bg-blue-100 px-2 py-1 rounded">Password123</code></p>
      </div>
    </AuthLayout>
  );
};
