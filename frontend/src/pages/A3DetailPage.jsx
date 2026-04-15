import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { a3Service } from '../services/api';

export const A3DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [a3, setA3] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadA3 = async () => {
      try {
        setIsLoading(true);
        const response = await a3Service.getById(id);
        setA3(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar el A3');
      } finally {
        setIsLoading(false);
      }
    };

    loadA3();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-corporate-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando A3..." size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-corporate-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-corporate-purple hover:text-purple-900 font-semibold mb-8"
          >
            ← Volver
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            <p className="font-semibold">❌ Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!a3) {
    return (
      <div className="min-h-screen bg-corporate-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-corporate-purple hover:text-purple-900 font-semibold mb-8"
          >
            ← Volver
          </button>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg text-center">
            <p className="font-semibold">⚠️ A3 no encontrado</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusConfig = {
    abierto: { color: 'bg-green-100 text-green-800', label: 'Abierto' },
    en_curso: { color: 'bg-blue-100 text-blue-800', label: 'En Curso' },
    pendiente: { color: 'bg-orange-100 text-orange-800', label: 'Pendiente' },
    cerrado: { color: 'bg-purple-100 text-corporate-purple', label: 'Cerrado' },
  };

  const status = statusConfig[a3.status] || statusConfig.abierto;

  const handleDownloadPdf = async () => {
    try {
      const response = await a3Service.downloadPdf(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers?.['content-disposition'] || '';
      const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
      link.download = match?.[1] || `A3-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al descargar el PDF');
    }
  };

  return (
    <div className="min-h-screen bg-corporate-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-corporate-purple hover:text-purple-900 font-semibold mb-8"
        >
          ← Volver
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-corporate-purple">{a3.titulo}</h1>
              <p className="text-gray-600 mt-2">ID: #A3-{String(a3.id).padStart(4, '0')}</p>
            </div>
            <span className={`${status.color} px-4 py-2 rounded-full font-semibold`}>
              {status.label}
            </span>
          </div>

          <div className="border-t pt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h2>
              <p className="text-gray-700">{a3.descripcion || 'Sin descripción'}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Área</p>
                <p className="text-gray-800 mt-1">{a3.area || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Solicitante</p>
                <p className="text-gray-800 mt-1">{a3.solicitante || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Fecha Inicio</p>
                <p className="text-gray-800 mt-1">
                  {a3.fecha_inicio ? new Date(a3.fecha_inicio).toLocaleDateString('es-MX') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Fecha Cierre</p>
                <p className="text-gray-800 mt-1">
                  {a3.fecha_cierre ? new Date(a3.fecha_cierre).toLocaleDateString('es-MX') : 'Pendiente'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex gap-4">
            <button
              onClick={() => navigate(`/a3/${id}/preview`)}
              className="flex-1 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Vista previa
            </button>
            <button className="flex-1 bg-corporate-purple hover:bg-purple-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Editar A3
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex-1 bg-corporate-orange hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Descargar PDF
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
