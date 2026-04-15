# A3 Improvement App

Setup inicial completo para iniciar desarrollo inmediato con arquitectura backend + frontend.

## 1) Clonar repositorio

```bash
git clone https://github.com/ikerherna28/a3-improvement-app.git
cd a3-improvement-app
```

Si trabajas desde otra ruta de Windows PowerShell:

```powershell
Set-Location "C:\ruta\donde\quieras"
git clone https://github.com/ikerherna28/a3-improvement-app.git
Set-Location .\a3-improvement-app
```

## 2) Estructura creada

```text
a3-improvement-app/
  backend/
    src/
      config/
        env.js
      db/
        pool.js
      routes/
        health.js
      services/
        aiClient.js
      index.js
    .env.example
    package.json
  frontend/
    public/
    src/
      components/
      App.jsx
      index.css
      main.jsx
    .env.example
    index.html
    postcss.config.js
    tailwind.config.js
    vite.config.js
    package.json
  .gitignore
  package.json
  README.md
```

## 3) Instalacion exacta de dependencias

### Opcion rapida (desde raiz del repo)

```bash
npm run install:all
```

### Opcion manual (comandos exactos)

```bash
npm install --prefix backend
npm install --prefix frontend
```

## 4) Variables de entorno

1. Copiar plantillas:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

2. Completar valores reales en:
- `backend/.env` (PostgreSQL y Google AI)
- `frontend/.env` (URL del backend)

## 5) Ejecucion de desarrollo

Terminal 1 (backend):

```bash
npm run dev:backend
```

En Windows PowerShell, si falla por ruta/politicas, usa este comando exacto desde cualquier ubicacion:

```powershell
Set-Location "c:\Users\HernandezIker\OneDrive - TK Elevator\Escritorio\Aplicaciones\A3 - Mejora continua\a3-improvement-app"; npm.cmd run dev --prefix backend
```

Terminal 2 (frontend):

```bash
npm run dev:frontend
```

URLs por defecto:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health check backend: http://localhost:4000/api/health

## Endpoints IA (Fase 4)

Todos requieren JWT en header `Authorization: Bearer TOKEN`.

- `POST /api/ai/generate-analisis`
- `POST /api/ai/generate-causa-raiz`
- `POST /api/ai/generate-plan-accion`
- `POST /api/ai/generate-estandarizacion`

Body opcional para filtros:

```json
{
  "area": "Embalaje",
  "sourceType": "excel",
  "dateFrom": "2026-04-01T00:00:00.000Z",
  "dateTo": "2026-04-30T23:59:59.000Z",
  "top": 10,
  "contexto": "Priorizar acciones de bajo costo"
}
```

## 6) Explicacion de cada archivo creado

- `package.json` (raiz): scripts globales para instalar y ejecutar backend/frontend.
- `.gitignore`: exclusiones completas de dependencias, builds, logs y entornos.
- `backend/package.json`: dependencias y scripts del API (Express, PostgreSQL, Google AI).
- `backend/.env.example`: plantilla de variables seguras (sin secretos).
- `backend/src/config/env.js`: lectura centralizada de variables de entorno.
- `backend/src/db/pool.js`: inicializacion del pool de PostgreSQL con `pg`.
- `backend/src/services/aiClient.js`: cliente base de Google Generative AI.
- `backend/src/routes/health.js`: endpoint de salud del servicio.
- `backend/src/index.js`: arranque del servidor Express y middlewares.
- `frontend/package.json`: dependencias y scripts (React + Vite + Tailwind).
- `frontend/.env.example`: URL de API para entorno de frontend.
- `frontend/index.html`: plantilla base de Vite.
- `frontend/vite.config.js`: configuracion de Vite con plugin React.
- `frontend/postcss.config.js`: pipeline PostCSS para Tailwind.
- `frontend/tailwind.config.js`: configuracion Tailwind con paleta corporativa.
- `frontend/src/main.jsx`: bootstrap React.
- `frontend/src/App.jsx`: pantalla inicial funcional conectada a configuracion.
- `frontend/src/index.css`: estilos globales y variables corporativas.

## 7) Paleta corporativa aplicada

- Purpura: `#8A1C8C`
- Naranja: `#F2620F`
- Fondo: `#F2F2F2`

La paleta se aplica en `frontend/src/index.css` y `frontend/tailwind.config.js`.

## 7.1) Logos corporativos locales

Los logos oficiales de TK Elevator se usan desde el frontend con fondo transparente:

- `frontend/src/assets/branding/logo_blanco.png`
- `frontend/src/assets/branding/logo_color.png`
- `frontend/src/assets/branding/logo_negro.png`

La seleccion del logo por contexto visual se realiza en `frontend/src/components/BrandLogo.jsx`.

## 8) Primer commit (instrucciones)

```bash
git add .
git commit -m "chore: fase 0 setup inicial fullstack"
git push origin main
```

Si la rama principal no es `main`, reemplazar por la rama correcta.

## 9) Despliegue en produccion

Ver la guia completa en [docs/DEPLOY_A3_PRODUCCION.md](docs/DEPLOY_A3_PRODUCCION.md).

## 10) Guia funcional

La explicacion completa de como funciona la aplicacion, el flujo de login, la IA, la base de datos y el responsive esta en [docs/USO_Y_FUNCIONAMIENTO_A3.md](docs/USO_Y_FUNCIONAMIENTO_A3.md).

Resumen rapido:
- Backend en Render usando `render.yaml`.
- Frontend en Vercel usando `frontend/vercel.json`.
- Configurar `CORS_ORIGIN` con el dominio exacto del frontend.
- Configurar `VITE_API_URL` con la URL publica del backend.
