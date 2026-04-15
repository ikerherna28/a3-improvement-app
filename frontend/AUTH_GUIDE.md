# 🔐 Guía de Autenticación - Frontend

## Flujo de Login

```
Usuario ingresa credentials
    ↓
LoginPage → LoginForm
    ↓
useAuth.login(email, password)
    ↓
authService.login() [axios POST a /api/auth/login]
    ↓
Backend retorna: { token, user }
    ↓
AuthProvider guarda en localStorage
    ↓
Estado de AuthContext actualizado
    ↓
navigate('/dashboard')
    ↓
ProtectedRoute verifica isAuthenticated
    ↓
✅ Acceso a DashboardPage
```

## Flujo de Registro

```
Usuario ingresa data
    ↓
RegisterPage → RegisterForm
    ↓
Validaciones locales (email, password strength, etc)
    ↓
useAuth.register(email, password, name)
    ↓
authService.register() [axios POST a /api/auth/register]
    ↓
Backend retorna: { token, user }
    ↓
AuthProvider guarda en localStorage
    ↓
onSuccess callback → navigate('/dashboard')
    ↓
✅ Auto-login + Acceso a DashboardPage
```

## Flujo de Logout

```
Usuario hace clic "Cerrar sesión"
    ↓
useAuth.logout()
    ↓
authService.logout()
    ↓
localStorage.clear()
    ↓
AuthContext actualizado a null
    ↓
navigate('/login')
    ↓
ProtectedRoute redirige nuevamente a /login
```

## Rutas Protegidas

### Crear nueva ruta protegida

```jsx
// src/App.jsx
import MyProtectedPage from './pages/MyProtectedPage';

<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyProtectedPage />
    </ProtectedRoute>
  }
/>
```

### En el componente protegido

```jsx
// src/pages/MyProtectedPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const MyProtectedPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <p>Hola, {user.name}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
```

## Token Expiration Handling

Cuando un token expira (API return 401):

```
Request fallido (401 Unauthorized)
    ↓
Interceptor de axios detecta (status === 401)
    ↓
localStorage.removeItem('token')
    ↓
localStorage.removeItem('user')
    ↓
window.location.href = '/login'
    ↓
Usuario redirigido a login
```

## Validaciones de Entrada

### Disponibles en `utils/validation.js`

```js
import { validation } from '../utils/validation';

// Email
validation.isValidEmail(email);                 // true/false
validation.getEmailErrorMessage(email);        // string | null

// Contraseña
validation.isStrongPassword(password);          // true/false
validation.getPasswordErrorMessage(password);   // string | null
validation.passwordsMatch(pass1, pass2);        // true/false

// Nombre
validation.isValidName(name);                   // true/false
validation.getNameErrorMessage(name);           // string | null
```

### Requisitos de Contraseña

- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 mayúscula (A-Z)
- ✅ Al menos 1 minúscula (a-z)
- ✅ Al menos 1 número (0-9)

**Ejemplo válido**: `MyPassword123`  
**Ejemplo inválido**: `mypassword` (sin mayúscula ni número)

## Componentes Reutilizables

### LoginForm

```jsx
import { LoginForm } from '../components/forms/LoginForm';

function MyPage() {
  const handleSuccess = () => {
    console.log('Login exitoso!');
    navigate('/dashboard');
  };

  return <LoginForm onSuccess={handleSuccess} />;
}
```

### RegisterForm

```jsx
import { RegisterForm } from '../components/forms/RegisterForm';

function MyPage() {
  const handleSuccess = () => {
    console.log('Registro exitoso!');
    navigate('/dashboard');
  };

  return <RegisterForm onSuccess={handleSuccess} />;
}
```

### PasswordStrengthIndicator

```jsx
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

<PasswordStrengthIndicator 
  password={password}
  confirmPassword={confirmPassword}
/>
```

### Alert

```jsx
import { Alert } from '../components/Alert';

<Alert 
  type="success"
  title="Éxito"
  message="Operación completada"
  onClose={() => setAlert(null)}
/>

// Types: 'success' | 'error' | 'warning' | 'info'
```

## AuthContext API

```jsx
const {
  user,                // { id, email, name } | null
  token,               // string | null
  loading,             // boolean
  error,               // string | null
  isAuthenticated,     // boolean
  login,               // async (email, password) -> { token, user }
  register,            // async (email, password, name) -> { token, user }
  logout,              // () -> void
  setError,            // (message) -> void
} = useAuth();
```

## Error Handling

### En LoginForm/RegisterForm

Manejo automático con try/catch y mensajes al usuario.

### En otros componentes

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { error, setError } = useAuth();

  const handleSomeAction = async () => {
    try {
      // Hacer algo
    } catch (err) {
      setError(err.response?.data?.message || 'Error desconocido');
    }
  };

  return error && <Alert type="error" message={error} />;
}
```

## LocalStorage

**Keys almacenadas:**
- `token`: JWT token del usuario
- `user`: JSON stringificado del usuario

**Limpiar manualmente (debugging):**
```js
localStorage.removeItem('token');
localStorage.removeItem('user');
```

## Credenciales de Demo

- **Email**: admin@example.com
- **Contraseña**: Password123

## Debugging

### Ver estado de autenticación

```js
// En consola del navegador
localStorage.getItem('token');
localStorage.getItem('user');
```

### Forzar logout

```js
// En consola del navegador
localStorage.clear();
window.location.href = '/login';
```

### Ver errores de axios

```jsx
import api from '../services/api';

api.get('/some-endpoint')
  .catch(err => {
    console.log('Error:', err.response?.data);
  });
```

## Endpoints Backend Esperados

```
POST /api/auth/login
  Request: { email, password }
  Response: { token, user: { id, email, name } }

POST /api/auth/register
  Request: { email, password, name }
  Response: { token, user: { id, email, name } }

GET /api/auth/me (futuro)
  Response: { user: { id, email, name } }
```

## Notas Importantes

1. **JWT es guardado en localStorage** - No es el más seguro (vulnerable a XSS), pero es simple. Para producción, considera httpOnly cookies.

2. **CORS debe estar habilitado** - El backend debe permitir requests desde `http://localhost:5173` en desarrollo.

3. **No guardes contraseñas** - Solo guardamos token y user, nunca la contraseña.

4. **Validaciones se hacen 2 veces** - Frontend (UX) y Backend (seguridad).

5. **Interceptores de axios** - Automáticamente:
   - Agregan token a requests (si existe)
   - Redirigen a login si token expira (401)

## Próximos Pasos

- [ ] Agregar refresh token flow
- [ ] Cambiar de httpOnly cookies
- [ ] Agregar verificación de email
- [ ] Agregar reset de contraseña
- [ ] Two-factor authentication
