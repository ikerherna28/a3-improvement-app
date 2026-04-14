# Backend A3 - Fase 1 y Fase 2

Implementacion base de backend con Express + PostgreSQL + autenticacion JWT.

## Estructura solicitada

```text
backend/
  src/
    config/
      env.js
      database.js
    controllers/
      authController.js
    routes/
      health.js
      auth.js
      index.js
    middleware/
      auth.js
      errorHandler.js
    utils/
      httpError.js
    db/
      migrate.js
      pool.js
      migrations/
        001_create_incidents.sql
        002_create_core_tables.sql
    modules/
      incidents/
        incidents.controller.js
        incidents.routes.js
        incidents.schema.js
        incidents.service.js
    repositories/
      incidentsRepository.js
    server.js
    index.js
  .env
  .env.example
  package.json
```

## Tablas SQL y relaciones

### Tabla users
- Guarda usuarios del sistema para login.
- Campos clave: id, name, email, password_hash, role, is_active.
- email es unico para evitar duplicados.

### Tabla raw_data
- Guarda datos crudos de entrada (JSON) provenientes de archivos, APIs o cargas manuales.
- Campo uploaded_by referencia users.id.
- Relacion: un usuario puede subir muchos registros raw_data.

### Tabla a3_registros
- Guarda los registros A3 operativos con estado, prioridad, causa raiz y accion.
- Campo created_by referencia users.id.
- Campo raw_data_id referencia raw_data.id cuando el registro viene de una carga.
- Relacion: un usuario puede crear muchos registros A3.
- Relacion: un registro raw_data puede originar muchos a3_registros.

## Indices implementados

- users: email, role
- raw_data: uploaded_by, uploaded_at, source_name
- a3_registros: estado, prioridad, area, created_by, raw_data_id, created_at

Estos indices mejoran consultas de login, filtros de dashboard y trazabilidad.

## Variables de entorno

Archivo real: .env
Plantilla: .env.example

Variables principales:
- PORT
- DATABASE_URL
- AUTO_MIGRATE
- JWT_SECRET
- JWT_EXPIRES_IN
- CORS_ORIGIN

## Endpoints principales

Health:
- GET /api/health

Autenticacion:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (protegido)

Incidentes:
- Todas las rutas de /api/incidents estan protegidas por JWT.

Gestion A3:
- POST /api/a3/create
- GET /api/a3/:id
- GET /api/a3/list?estado=ABIERTO&page=1&limit=20
- PUT /api/a3/:id
- PATCH /api/a3/:id/status
- GET /api/a3/:id/pdf (descarga PDF profesional)

Importacion de datos:
- POST /api/data/upload (multipart/form-data, campo file)
- GET /api/data/list
- GET /api/data/pareto?area=Embalaje&top=10

Integracion IA (Gemini):
- POST /api/ai/generate-analisis
- POST /api/ai/generate-causa-raiz
- POST /api/ai/generate-plan-accion
- POST /api/ai/generate-estandarizacion

## Comandos para probar que funciona

1) Instalar dependencias backend:

```powershell
npm.cmd install --prefix backend
```

2) Iniciar backend:

```powershell
npm.cmd run dev --prefix backend
```

Accesos:
- Backend API: http://localhost:4000
- Health: http://localhost:4000/api/health
- Frontend (si lo inicias): http://localhost:5173

3) Probar health:

```powershell
Invoke-RestMethod -Uri http://localhost:4000/api/health | ConvertTo-Json -Depth 4
```

4) Probar registro (Thunder Client o REST):
- Metodo: POST
- URL: http://localhost:4000/api/auth/register
- Body JSON:

```json
{
  "name": "Iker",
  "email": "iker@example.com",
  "password": "Pass1234!",
  "role": "admin"
}
```

5) Probar login (Thunder Client):
- Metodo: POST
- URL: http://localhost:4000/api/auth/login
- Body JSON:

```json
{
  "email": "iker@example.com",
  "password": "Pass1234!"
}
```

6) Probar endpoint protegido:
- Metodo: GET
- URL: http://localhost:4000/api/incidents
- Header: Authorization: Bearer TU_TOKEN

7) Probar importacion con Thunder Client:
- Metodo: POST
- URL: http://localhost:4000/api/data/upload
- Header: Authorization: Bearer TU_TOKEN
- Body: form-data
- Campo: file (tipo File, subir .xlsx/.xls/.csv)

8) Probar listado de datos cargados:
- Metodo: GET
- URL: http://localhost:4000/api/data/list?page=1&limit=20
- Header: Authorization: Bearer TU_TOKEN

9) Probar pareto por causa:
- Metodo: GET
- URL: http://localhost:4000/api/data/pareto?area=Embalaje&sourceType=excel&top=10
- Header: Authorization: Bearer TU_TOKEN

10) Probar IA (ejemplo analisis):
- Metodo: POST
- URL: http://localhost:4000/api/ai/generate-analisis
- Header: Authorization: Bearer TU_TOKEN
- Body JSON opcional:

```json
{
  "area": "Embalaje",
  "sourceType": "excel",
  "top": 10,
  "contexto": "Priorizar acciones de bajo costo"
}
```

11) Probar creacion de A3:
- Metodo: POST
- URL: http://localhost:4000/api/a3/create
- Header: Authorization: Bearer TU_TOKEN
- Body JSON ejemplo:

```json
{
  "titulo": "Reducir defectos en embalaje L2",
  "descripcionProblema": "Se incrementaron reprocesos en el turno tarde",
  "area": "Embalaje",
  "estado": "ABIERTO",
  "prioridad": "ALTA",
  "rawDataIds": [1, 2],
  "paretoData": {
    "topCausas": [
      { "causa": "Ajuste manual", "total": 25 },
      { "causa": "Material", "total": 10 }
    ]
  }
}
```

## Nota importante

Si PostgreSQL no esta levantado en localhost:5432, el backend iniciara pero reportara DB en estado degradado en health y auth/incidents/data no podran operar hasta que la base este disponible.
