# Despliegue en Produccion

## Arquitectura
- Backend: Render.com
- Frontend: Vercel.com
- Base de datos: PostgreSQL administrado por Render

## Variables de entorno

### Backend (Render)
- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL=<cadena_postgresql_render>`
- `JWT_SECRET=<secreto_largo_y_unico>`
- `JWT_EXPIRES_IN=8h`
- `GOOGLE_AI_API_KEY=<clave_google_ai>`
- `GOOGLE_AI_MODEL=gemini-1.5-flash`
- `CORS_ORIGIN=https://tu-frontend.vercel.app`
- `AUTO_MIGRATE=true`
- `DB_FALLBACK_TO_MEMORY=false`

### Frontend (Vercel)
- `VITE_API_URL=https://tu-backend.onrender.com/api`

## Paso a paso Render
1. Crear una cuenta o iniciar sesion en Render.
2. Conectar el repositorio GitHub.
3. Crear un Web Service usando `render.yaml` o configuracion manual.
4. Crear/adjuntar una base PostgreSQL.
5. Definir las variables de entorno del backend.
6. Hacer deploy.
7. Verificar `https://tu-backend.onrender.com/api/health`.

## Paso a paso Vercel
1. Conectar el repositorio o el subdirectorio `frontend`.
2. Configurar root directory como `frontend`.
3. Definir `VITE_API_URL` apuntando al backend de Render.
4. Hacer deploy.
5. Verificar que `/dashboard` y `/a3/new` cargan correctamente.

## Testing en produccion
- Backend:
  - `GET /api/health`
  - `GET /api/a3`
  - `GET /api/data/pareto`
  - `GET /api/a3/:id/pdf`
- Frontend:
  - Login
  - Dashboard
  - Importacion de datos
  - Pareto
  - Creador A3
  - Vista previa y PDF

## Monitoreo
- Revisar logs de Render en errores 4xx/5xx.
- Revisar fallos de build de Vercel.
- Confirmar que `CORS_ORIGIN` coincida exactamente con el dominio del frontend.
- Revisar uso de base de datos y latencia del endpoint `/api/health`.

## Mantenimiento
- Rotar `JWT_SECRET` si se sospecha exposicion.
- Mantener `DATABASE_URL` y `GOOGLE_AI_API_KEY` en secretos de plataforma.
- Actualizar dependencias de frontend y backend periodicamente.
- Si cambia el dominio de Vercel, actualizar `CORS_ORIGIN`.
- Si se agrega otro ambiente, agregarlo a `CORS_ORIGIN` separado por comas.
