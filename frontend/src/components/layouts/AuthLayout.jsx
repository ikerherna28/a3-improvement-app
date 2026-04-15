import { BrandLogo } from '../BrandLogo';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(242,98,15,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(138,28,140,0.16),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.08),transparent_35%,rgba(255,255,255,0.3)_70%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <aside className="hidden rounded-[2rem] border border-white/20 bg-slate-950/92 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.35)] lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="space-y-8">
              <BrandLogo variant="dark" size="lg" showText className="max-w-full" />
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/55">Plataforma corporativa</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight">
                  Gestiona mejoras con trazabilidad, foco y velocidad.
                </h2>
                <p className="mt-4 max-w-lg text-base text-white/72">
                  A3 centraliza autenticación, datos, IA y seguimiento operativo en una sola experiencia responsive.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Login</p>
                <p className="mt-2 text-sm text-white/80">Acceso con JWT y sesión persistente.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">Datos</p>
                <p className="mt-2 text-sm text-white/80">Importación Excel/CSV y pareto integrado.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/55">IA</p>
                <p className="mt-2 text-sm text-white/80">Fallback gratuito cuando no hay API key.</p>
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center">
            <div className="w-full rounded-[2rem] border border-white/70 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur sm:p-8 lg:max-w-[580px]">
              <div className="mb-8 flex justify-center">
                <BrandLogo variant="light" size="md" showText={false} />
              </div>

              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-corporate-purple/80">
                  A3 Mejora Continua
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {title}
                </h1>
                {subtitle && <p className="mt-3 text-sm text-slate-600 sm:text-base">{subtitle}</p>}
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
