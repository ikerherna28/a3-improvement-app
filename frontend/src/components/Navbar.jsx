import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './BrandLogo';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/data/import', label: 'Importar datos' },
    { to: '/pareto', label: 'Pareto' },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-corporate-purple/95 text-white shadow-xl backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <BrandLogo variant="dark" size="sm" showText compact className="max-w-[180px]" />
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
                Mejora continua
              </p>
              <p className="text-xs text-white/70">Trazabilidad, foco y seguimiento</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-white text-corporate-purple shadow-sm'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium">{user?.name || user?.email}</p>
              <p className="text-xs text-white/70">Sesión activa</p>
            </div>

            <div className="relative hidden md:block">
              <button
                onClick={() => setIsUserMenuOpen((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white ring-1 ring-white/25 transition-colors hover:bg-white/30"
                title={user?.name || 'Usuario'}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-2xl">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold">{user?.name || 'Usuario'}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    Mi panel
                  </button>
                  <button
                    onClick={() => {
                      navigate('/data/import');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    Importar datos
                  </button>
                  <button
                    onClick={() => {
                      navigate('/pareto');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    Pareto
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full border-t border-slate-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-white/20 p-3 text-white transition-colors hover:bg-white/10 md:hidden"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menú</span>
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded-full bg-white"></span>
                <span className="h-0.5 w-5 rounded-full bg-white"></span>
                <span className="h-0.5 w-5 rounded-full bg-white"></span>
              </span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-3 text-white backdrop-blur">
              <div className="mb-3 rounded-2xl bg-white/10 px-4 py-3">
                <p className="text-sm font-semibold">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-white/70">{user?.email}</p>
              </div>

              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === item.to
                        ? 'bg-white text-corporate-purple'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-red-500/15 px-4 py-3 text-left text-sm font-semibold text-white transition-colors hover:bg-red-500/25"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
