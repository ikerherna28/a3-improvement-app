import { BrandLogo } from '../BrandLogo';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(242,98,15,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(138,28,140,0.16),transparent_30%),linear-gradient(135deg,#eef2ff_0%,#f8fafc_45%,#f5f7fb_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.05),transparent_38%,rgba(255,255,255,0.36)_72%)]" />
      <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-corporate-orange/10 blur-3xl" />
      <div className="absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-corporate-purple/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <aside className="relative hidden overflow-hidden rounded-[2.25rem] border border-slate-800/80 bg-[linear-gradient(160deg,#0f172a_0%,#111827_55%,#1f1740_100%)] p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.42)] lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="absolute inset-y-0 right-0 w-56 bg-[radial-gradient(circle,rgba(242,98,15,0.2),transparent_70%)]" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
                TK Elevator | A3 Mejora Continua
              </div>

              <BrandLogo variant="dark" size="lg" showText className="max-w-full drop-shadow-[0_8px_24px_rgba(15,23,42,0.3)]" />

              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">Plataforma corporativa</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-white xl:text-5xl">
                  Gestión visual clara para mejorar procesos sin perder contexto.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
                  Accede a datos, IA y seguimiento operativo desde una interfaz sobria, legible y preparada para trabajo diario.
                </p>
              </div>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Login</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Acceso con JWT y sesión persistente.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Datos</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Importación Excel/CSV y Pareto integrado.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">IA</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Fallback gratuito cuando no hay API key.</p>
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center">
            <div className="w-full rounded-[2rem] border border-white/80 bg-white/96 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.14)] backdrop-blur sm:p-8 lg:max-w-[580px]">
              <div className="mb-8 flex justify-center">
                <BrandLogo variant="light" size="md" showText={false} />
              </div>

              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-corporate-purple/80">
                  A3 Mejora Continua
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
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
