import { useNavigate, Link } from 'react-router-dom';
import { RegisterForm } from '../components/forms/RegisterForm';
import { AuthLayout } from '../components/layouts/AuthLayout';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    // Redirigir a dashboard después de registro exitoso
    navigate('/dashboard');
  };

  return (
    <AuthLayout 
      title="Crea tu cuenta" 
      subtitle="Únete a A3 Mejora Continua"
    >
      {/* Formulario de registro */}
      <RegisterForm onSuccess={handleRegisterSuccess} />

      {/* Link a login */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-corporate-purple font-semibold hover:underline transition-colors">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      {/* Información de privacidad */}
      <div className="mt-6 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded-lg text-xs text-center">
        <p>
          Al registrarte, aceptas nuestros{' '}
          <a href="#" className="text-corporate-purple font-semibold hover:underline">
            Términos de servicio
          </a>
          {' '}y{' '}
          <a href="#" className="text-corporate-purple font-semibold hover:underline">
            Política de privacidad
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};
