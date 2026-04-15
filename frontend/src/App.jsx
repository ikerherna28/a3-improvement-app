import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const A3CreatePage = lazy(() => import('./pages/A3CreatePage').then((module) => ({ default: module.A3CreatePage })));
const A3DetailPage = lazy(() => import('./pages/A3DetailPage').then((module) => ({ default: module.A3DetailPage })));
const A3PreviewPage = lazy(() => import('./pages/A3PreviewPage').then((module) => ({ default: module.A3PreviewPage })));
const DataImportPage = lazy(() => import('./pages/DataImportPage').then((module) => ({ default: module.DataImportPage })));
const ParetoPage = lazy(() => import('./pages/ParetoPage').then((module) => ({ default: module.ParetoPage })));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner label="Cargando aplicación..." size="lg" className="min-h-screen" />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/a3/new"
              element={
                <ProtectedRoute>
                  <A3CreatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/a3/:id"
              element={
                <ProtectedRoute>
                  <A3DetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/a3/:id/preview"
              element={
                <ProtectedRoute>
                  <A3PreviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data/import"
              element={
                <ProtectedRoute>
                  <DataImportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pareto"
              element={
                <ProtectedRoute>
                  <ParetoPage />
                </ProtectedRoute>
              }
            />

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
