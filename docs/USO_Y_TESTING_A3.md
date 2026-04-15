# Uso y Testing del Frontend A3

## Objetivo
Validar la experiencia de usuario, rendimiento, accesibilidad y conectividad de la app A3 Mejora Continua.

## Rutas principales
- `/login`
- `/register`
- `/dashboard`
- `/data/import`
- `/pareto`
- `/a3/new`
- `/a3/:id`
- `/a3/:id/preview`

## Flujo recomendado de uso
1. Inicia sesión.
2. Revisa el dashboard.
3. Sube un archivo en Importar datos.
4. Genera Pareto desde la pantalla Pareto o desde el creador A3.
5. Crea o edita un A3 desde `/a3/new`.
6. Abre la vista previa del A3 desde el detalle.
7. Descarga el PDF o imprime la vista previa.

## Thunder Client
### Colección sugerida
Crear requests con estas rutas:
- `POST /api/auth/login`
- `GET /api/a3`
- `GET /api/a3/:id`
- `GET /api/a3/:id/pdf`
- `POST /api/data/upload`
- `GET /api/data/pareto`
- `POST /api/ai/generate-analisis`
- `POST /api/ai/generate-causa-raiz`
- `POST /api/ai/generate-plan-accion`
- `POST /api/ai/generate-estandarizacion`

### Headers comunes
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

### Payload de ejemplo para AI
```json
{
  "area": "L2 - Puertas",
  "dateFrom": "2026-04-01T00:00:00.000Z",
  "dateTo": "2026-04-15T23:59:59.000Z",
  "top": 10,
  "contexto": "Generar borrador profesional para A3"
}
```

### Payload de ejemplo para upload
- Tipo: `multipart/form-data`
- Campo `file`: archivo `.xlsx`, `.xls` o `.csv`
- Campo `linea`: `L2 - Puertas`
- Campo `departamento`: `Producción`

## Pruebas end-to-end manuales
### Login
- Usuario válido entra al dashboard.
- Usuario inválido muestra error claro.

### Dashboard
- Carga tarjetas A3.
- Filtros cambian el listado.
- Spinner visible al cargar.

### Importación
- Archivo válido muestra validación y preview.
- Archivo inválido muestra error claro.
- Subida exitosa registra historial.

### Pareto
- Filtros aplican y el gráfico se actualiza.
- Exportar PNG descarga imagen.

### Creador A3
- Paso 1 genera Pareto.
- Paso 2 permite editar campos y usar IA.
- Guardar conserva el borrador.

### Vista previa A3
- Se ve como documento A3.
- Imprimir abre vista limpia.
- Descargar PDF descarga el archivo.
- Editar rehidrata el wizard.

## Accesibilidad WCAG AA
- Todos los botones tienen texto visible.
- Alertas usan `role="alert"`.
- Spinner usa `role="status"`.
- Controles tienen contraste corporativo y foco visible.
- Se recomienda revisar navegación por teclado en:
  - Formularios
  - Menús
  - Tabla editable

## Rendimiento
- La app usa carga diferida de rutas con `React.lazy`.
- El gráfico Pareto y la vista previa se cargan por demanda.
- Si se requiere, dividir más el bundle con `manualChunks` en Vite.

## Checklist rápido antes de entregar
- [ ] Build del frontend exitoso
- [ ] Login y dashboard OK
- [ ] Importación de datos OK
- [ ] Pareto OK
- [ ] Creador A3 paso 1 y 2 OK
- [ ] Vista previa y PDF OK
- [ ] Responsive mobile/tablet/desktop OK
- [ ] Navegación por teclado OK
