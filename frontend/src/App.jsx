import { useMemo } from "react";

function App() {
  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || "http://localhost:4000", []);

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <p className="mb-3 inline-flex rounded-full bg-[var(--color-purple)] px-4 py-1 text-sm font-semibold text-white">
          A3 Improvement App
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-purple)] md:text-4xl">
          Setup inicial completado
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-700">
          Frontend React + Tailwind listo. Backend Express disponible para integracion y evolucion de
          funcionalidades A3.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-[var(--color-purple)]">API Base</h2>
            <p className="mt-2 text-sm text-slate-600">Endpoint de salud para verificar despliegue del backend.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-[var(--color-purple)]">PostgreSQL</h2>
            <p className="mt-2 text-sm text-slate-600">Conexion preparada mediante variable DATABASE_URL.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 p-4">
            <h2 className="font-semibold text-[var(--color-purple)]">Google AI</h2>
            <p className="mt-2 text-sm text-slate-600">Cliente base inicializado cuando exista API key.</p>
          </article>
        </div>

        <div className="mt-8 rounded-2xl bg-[var(--color-orange)]/10 p-4">
          <p className="text-sm font-medium text-[var(--color-orange)]">URL backend actual: {apiUrl}</p>
        </div>
      </section>
    </main>
  );
}

export default App;
