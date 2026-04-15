# Guía de uso y funcionamiento de A3 Mejora Continua

## 1. Objetivo de la aplicación

La aplicación A3 Mejora Continua centraliza la gestión de incidencias, acciones de mejora, análisis Pareto y asistencia mediante IA para equipos operativos y de mejora continua.

El objetivo es que un usuario pueda entrar, revisar datos, priorizar problemas, crear una A3 y seguir su evolución desde una única interfaz profesional y responsive.

## 2. Arquitectura general

La solución está dividida en dos capas principales:

- Frontend: React + Vite + Tailwind CSS.
- Backend: Express + JWT + PostgreSQL con fallback a memoria.

Servicios externos:

- IA: Google Generative AI cuando existe `GOOGLE_AI_API_KEY`.
- Si no hay clave, el backend devuelve respuestas seguras y deterministas para no bloquear la aplicación.

## 3. Flujo de acceso

### Login

1. El usuario entra en `/login`.
2. Introduce email y contraseña.
3. El frontend valida el formato antes de enviar.
4. El backend comprueba el usuario en `users`.
5. Si la contraseña es correcta, devuelve JWT + datos de usuario.
6. El frontend guarda token y usuario en `localStorage`.
7. La aplicación redirige a `/dashboard`.

### Registro

1. El usuario entra en `/register`.
2. Completa nombre, email y contraseña.
3. El frontend valida nombre, email y fortaleza de la contraseña.
4. El backend crea el usuario, genera hash con bcrypt y devuelve JWT.
5. El usuario queda autenticado automáticamente.

### Usuario demo

Para desarrollo local existe un usuario semilla:

- Email: `admin@example.com`
- Contraseña: `Password123`

## 4. Pantallas principales

### Dashboard

El dashboard muestra:

- Total de A3.
- Estados activos.
- Filtros por estado.
- Tarjetas responsive con acceso al detalle.

### Alta de A3

Desde `/a3/new` se inicia el flujo de creación de una A3 con formulario estructurado y borrador local.

### Detalle y vista previa

Las rutas `/a3/:id` y `/a3/:id/preview` permiten revisar el contenido de una A3, ver su contexto y preparar exportaciones.

### Importación de datos

La pantalla `/data/import` permite cargar archivos Excel o CSV, validar estructura y preparar el análisis posterior.

### Pareto

La pantalla `/pareto` calcula y visualiza causas o problemas prioritarios para decidir acciones de mayor impacto.

## 5. IA generativa

La IA se usa para apoyar la redacción de:

- Análisis del problema.
- Causa raíz.
- Plan de acción.
- Estandarización.

Comportamiento importante:

- Si existe `GOOGLE_AI_API_KEY`, se usa Gemini.
- Si no existe, la app sigue funcionando con texto seguro local.
- Así no dependes de una API de pago para probar la solución.

## 6. Base de datos

El backend intenta conectar a PostgreSQL mediante `DATABASE_URL`.

Si no encuentra la conexión o no está disponible:

- Usa `pg-mem` en memoria.
- Aplica migraciones igualmente.
- Semilla automáticamente el usuario demo.

Esto evita que la app se quede bloqueada por un Postgres local ausente durante el desarrollo.

## 7. Branding y responsive

El logo corporativo se muestra en:

- Navbar.
- Layout de login y registro.
- Footer.

Activos de logo usados (fondo transparente):

- `frontend/src/assets/branding/logo_blanco.png`
- `frontend/src/assets/branding/logo_color.png`
- `frontend/src/assets/branding/logo_negro.png`

Se usa en modo claro u oscuro según el fondo para que siempre mantenga contraste.

La interfaz está preparada para:

- Móvil.
- Tablet.
- Escritorio.

Los elementos de navegación colapsan en móvil y las tarjetas se adaptan al ancho disponible.

## 8. Variables clave

Frontend:

- `VITE_API_URL=http://localhost:4000/api`

Backend:

- `PORT=4000`
- `DATABASE_URL=` para fallback en memoria.
- `DB_FALLBACK_TO_MEMORY=true`
- `AUTO_MIGRATE=true`
- `JWT_SECRET` obligatorio para producción.
- `GOOGLE_AI_API_KEY` opcional para IA real.

## 9. Cómo arrancar

### Backend

```powershell
npm.cmd run dev --prefix backend
```

### Frontend

```powershell
npm.cmd run dev --prefix frontend
```

URLs por defecto:

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

## 10. Buenas prácticas operativas

- Usa `admin@example.com` solo para pruebas iniciales.
- En producción define una `DATABASE_URL` real.
- Define un `JWT_SECRET` fuerte y único.
- Si cambias el dominio del frontend, actualiza `CORS_ORIGIN`.
- Si conectas Gemini, añade `GOOGLE_AI_API_KEY`.

## 11. Resolución de problemas

### No entra en login

- Verifica que el backend esté en `http://localhost:4000`.
- Comprueba que `VITE_API_URL` apunte a ese puerto.
- Prueba con el usuario demo.

### Error de base de datos

- Si no hay PostgreSQL local, deja `DATABASE_URL` vacío.
- Comprueba que `DB_FALLBACK_TO_MEMORY=true`.

### IA no responde

- Revisa si falta `GOOGLE_AI_API_KEY`.
- En ese caso la app sigue funcionando con fallback local.

## 12. Resultado esperado

La aplicación debe permitir:

- Autenticarse sin fricción.
- Navegar de forma clara y responsive.
- Crear y revisar A3.
- Importar datos para análisis.
- Visualizar Pareto.
- Usar IA sin bloquear el flujo si no hay clave externa.
