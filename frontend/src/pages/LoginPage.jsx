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
      <LoginForm onSuccess={handleLoginSuccess} />

      <div className="mt-6 text-center text-sm text-slate-600">
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-corporate-purple transition-colors hover:text-corporate-orange">
            Regístrate aquí
          </Link>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-corporate-purple/20 bg-[linear-gradient(135deg,rgba(138,28,140,0.08),rgba(242,98,15,0.08))] px-4 py-4 text-center text-xs text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Credenciales de demostración</p>
        <p className="mt-2">Email: <span className="rounded bg-white/80 px-2 py-1 font-semibold text-corporate-purple">admin@example.com</span></p>
        <p className="mt-1">Contraseña: <span className="rounded bg-white/80 px-2 py-1 font-semibold text-corporate-purple">Password123</span></p>
      </div>
    </AuthLayout>
  );
};
