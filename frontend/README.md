# Frontend - A3 Mejora Continua

Aplicación React moderna con TypeScript, Tailwind CSS y React Router v6 para la plataforma A3 de Mejora Continua.

## 📋 Requisitos

- **Node.js**: v16.0.0 o superior
- **npm**: v7.0.0 o superior
- **Backend**: Debe estar corriendo en `http://localhost:4000`

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm.cmd install
```

> **Nota para Windows**: Si encuentras restricción de scripts de PowerShell, usa `npm.cmd install` en lugar de `npm install`.

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del directorio `frontend/`:

```bash
VITE_API_URL=http://localhost:4000/api
```

O copia desde el archivo de ejemplo:

```bash
copy .env.example .env
```

## 🏃 Comandos disponibles

### Desarrollo

```bash
npm run dev
```

Inicia el servidor de desarrollo en `http://localhost:5173`.

### Producción

```bash
npm run build
```

Compila la aplicación para producción en el directorio `dist/`.

```bash
npm run preview
```

Previsualiza la compilación de producción localmente.

## 📁 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── Alert.jsx                    # Componente de alertas reutilizable
│   │   ├── PasswordStrengthIndicator.jsx # Indicador de fortaleza de contraseña
│   │   ├── ProtectedRoute.jsx           # Componente para rutas protegidas
│   │   ├── forms/
│   │   │   ├── LoginForm.jsx            # Formulario de login reutilizable
│   │   │   └── RegisterForm.jsx         # Formulario de registro reutilizable
│   │   └── layouts/
│   │       └── AuthLayout.jsx           # Layout para páginas de autenticación
│   ├── context/
│   │   ├── AuthContext.jsx              # Contexto de autenticación
│   │   └── AuthProvider.jsx             # Proveedor de autenticación
│   ├── pages/
│   │   ├── LoginPage.jsx                # Página de login
│   │   ├── RegisterPage.jsx             # Página de registro
│   │   ├── DashboardPage.jsx            # Dashboard principal
│   │   └── ...
│   ├── services/
│   │   └── api.js                       # Cliente axios configurado
│   ├── hooks/
│   │   └── useAuth.js                   # Custom hook para usar AuthContext
│   ├── utils/
│   │   └── validation.js                # Funciones de validación reutilizables
│   ├── layouts/                         # Layouts de página
│   ├── App.jsx                          # Componente principal con rutas
│   ├── main.jsx                         # Punto de entrada
│   └── index.css                        # Estilos globales
├── public/                              # Archivos públicos
├── .env, .env.example                   # Variables de entorno
├── vite.config.js                       # Configuración de Vite
├── tailwind.config.js                   # Configuración de Tailwind CSS
├── postcss.config.js                    # Configuración de PostCSS
└── package.json                         # Dependencias del proyecto
```

## 🔐 Autenticación

### Flujo de autenticación

1. **Login**: Usuario ingresa email y contraseña en `/login`
2. **Verificación**: Backend valida credenciales y retorna JWT + datos de usuario
3. **Almacenamiento**: Token y usuario se guardan automáticamente en `localStorage`
4. **Context**: `AuthProvider` mantiene el estado de autenticación en toda la app
5. **Rutas protegidas**: `ProtectedRoute` redirige a login si no está autenticado
6. **Redirección**: Después del login exitoso, redirige a `/dashboard`

## 📘 Documentación funcional

La guía completa de uso y funcionamiento está en [docs/USO_Y_FUNCIONAMIENTO_A3.md](../docs/USO_Y_FUNCIONAMIENTO_A3.md).

### Registro

1. **Validación de formulario**:
   - Email válido
   - Nombre mínimo 2 caracteres
  - Contraseña mínimo 8 caracteres con mayúscula, minúscula y número
   - Las contraseñas deben coincidir

2. **Indicador de fortaleza**: Muestra requisitos cumplidos en tiempo real
3. **Error handling**: Mensajes claros si algo falla
4. **Auto-login**: Después de registrarse, el usuario inicia sesión automáticamente

## 🏷️ Branding profesional

La aplicación usa logos locales de TK Elevator en formato PNG transparente para asegurar calidad visual en cualquier fondo:

- `src/assets/branding/logo_blanco.png` para fondos oscuros.
- `src/assets/branding/logo_color.png` para fondos claros.
- `src/assets/branding/logo_negro.png` para composiciones monocromas.

El componente `BrandLogo` decide el recurso adecuado por variante visual y se reutiliza en Navbar, AuthLayout y Footer.

### useAuth Hook

Usa el hook `useAuth()` en cualquier componente para acceder al contexto:

```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { 
    user,           // Datos del usuario autenticado
    token,          // JWT token
    isAuthenticated, // Boolean: está autenticado?
    loading,        // Boolean: cargando?
    error,          // Mensaje de error (si existe)
    login,          // Función: async login(email, password)
    register,       // Función: async register(email, password, name)
    logout,         // Función: logout()
    setError        // Función: setError(message)
  } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Bienvenido, {user.name}</p>}
    </div>
  );
}
```

## 🌐 API Service

### Estructura de `services/api.js`

El archivo `api.js` proporciona:

- **Configuración de axios**: Base URL, headers, interceptores
- **Autenticación**: Agrega JWT automáticamente a cada request
- **Manejo de errores**: Redirige a login si el token expira (401)
- **Servicios por módulo**:
  - `authService`: login, register, logout
  - `a3Service`: CRUD de A3
  - `dataService`: Carga de datos
  - `aiService`: Generación de análisis con IA
  - `healthService`: Health check del backend

### Ejemplo de uso

```jsx
import { a3Service } from '../services/api';

// Obtener todas las A3
const a3s = await a3Service.getAll();

// Crear nueva A3
const newA3 = await a3Service.create({ title: 'Mi problema', ...data });

// Obtener A3 específica
const a3 = await a3Service.getById(1);

// Actualizar A3
await a3Service.update(1, { status: 'completed' });

// Eliminar A3
await a3Service.delete(1);
```

## 🎨 Tailwind CSS

### Colores corporativos

Los colores están configurados en `tailwind.config.js`:

```js
colors: {
  corporate: {
    purple: "#8A1C8C",     // Color primario
    orange: "#F2620F",     // Color secundario
    background: "#F2F2F2"  // Color de fondo
  }
}
```

### Uso en componentes

```jsx
<button className="bg-corporate-purple text-white hover:bg-purple-900">
  Continuar
</button>

<div className="bg-corporate-background">
  Contenido
</div>
```

## 🔄 React Router v6

### Rutas disponibles

- `/login` - Página de login (pública)
- `/register` - Página de registro (pública)
- `/dashboard` - Dashboard principal (protegida)
- `/` - Redirección a dashboard

### Crear nueva ruta protegida

```jsx
// En App.jsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>

// En el componente
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/dashboard')}>
      Volver
    </button>
  );
}
```

## ✅ Validación de Formularios

### Utilities: `utils/validation.js`

Proporciona funciones de validación reutilizables:

```js
import { validation } from '../utils/validation';

// Validar email
const isValidEmail = validation.isValidEmail('user@example.com');

// Validar contraseña fuerte
const isStrong = validation.isStrongPassword('MyPassword123');

// Obtener mensaje de error
const error = validation.getPasswordErrorMessage('weak');

// Validar que coincidan
const match = validation.passwordsMatch(pass1, pass2);
```

## 📊 Componentes reutilizables

### Alert.jsx

Componente para mostrar mensajes de éxito, error, advertencia, info:

```jsx
import { Alert } from '../components/Alert';

<Alert 
  type="success" 
  title="Éxito" 
  message="Operación completada"
  onClose={() => setAlert(null)}
/>
```

### PasswordStrengthIndicator.jsx

Indicator visual de fortaleza de contraseña:

```jsx
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';

<PasswordStrengthIndicator 
  password={password} 
  confirmPassword={confirmPassword}
/>
```

### AuthLayout.jsx

Layout reutilizable para páginas de autenticación:

```jsx
import { AuthLayout } from '../components/layouts/AuthLayout';

<AuthLayout title="Inicia sesión">
  {/* Contenido */}
</AuthLayout>
```

## 🧪 Testing (Credenciales de demostración)

Para testing, usa estas credenciales:

- **Email**: admin@example.com
- **Contraseña**: Password123

## 📚 Dependencias principales

- **react** (^18.3.1): Librería principal de UI
- **react-router-dom** (^6.x): Enrutamiento
- **axios** (^1.x): Cliente HTTP
- **tailwindcss** (^3.4.10): Framework CSS
- **vite** (^5.x): Build tool y dev server

## 🐛 Troubleshooting

### Error: "Cannot find module 'react-router-dom'"

```bash
npm.cmd install react-router-dom axios
```

### CORS errors

Asegúrate que el backend esté permitiendo requests desde `http://localhost:5173`.

### Token expirado

Los tokens expirados se manejan automáticamente: se elimina el token de `localStorage` y se redirige a login.

### PowerShell execution policy

En Windows PowerShell, si tienes restricción de scripts:

```powershell
npm.cmd install
npm.cmd run dev
```

### Contraseña no cumple requisitos

Asegúrate de incluir:
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos un número
- Al menos una minúscula

## 📖 NextSteps

Próximos componentes y pages a implementar: - [ ] Página de A3 (crear, editar, listar)
- [ ] Página de carga de datos (Excel/CSV)
- [ ] Página de análisis con IA
- [ ] Página de reportes/PDF
- [ ] Componentes de navbar y sidebar
- [ ] Modal de confirmación
- [ ] Componentes de tabla
- [ ] Validación de formularios avanzada
- [ ] Notificaciones (toast)

## 🔗 Enlaces útiles

- [Documentación de React](https://react.dev)
- [Documentación de React Router](https://reactrouter.com)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Documentación de Vite](https://vitejs.dev)
- [Documentación de Axios](https://axios-http.com)

## 👥 Equipo

Proyecto de Mejora Continua - Phase 8: Login & Register

## 📄 Licencia

Todos los derechos reservados © 2024 TK Elevator
