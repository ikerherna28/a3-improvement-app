import { BrandLogo } from './BrandLogo';

export const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white/85 text-slate-600 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <BrandLogo variant="light" size="sm" showText={false} className="items-center" />
            <p className="text-sm leading-6 text-slate-600">
              Plataforma para gestión de mejoras, análisis estructurado y seguimiento operativo con una interfaz responsive.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Capacidades</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Autenticación segura con JWT.</li>
              <li>Dashboard responsive con filtros y métricas.</li>
              <li>IA con fallback gratuito cuando no hay API key.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-900">Estado</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Frontend React + Vite.</li>
              <li>Backend Express + PostgreSQL o memoria.</li>
              <li>Diseño pensado para móvil, tablet y escritorio.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 A3 Mejora Continua. Todos los derechos reservados.</p>
          <p>v1.0.0 | Desarrollado para TK Elevator</p>
        </div>
      </div>
    </footer>
  );
};
