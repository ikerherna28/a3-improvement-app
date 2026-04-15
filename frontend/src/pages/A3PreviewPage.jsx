import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ParetoChart } from '../components/charts/ParetoChart';
import { a3Service } from '../services/api';

const DRAFT_KEY = 'a3CreatorDraftV1';

const statusLabels = {
  ABIERTO: 'Abierto',
  EN_CURSO: 'En curso',
  PENDIENTE: 'Pendiente',
  CERRADO: 'Cerrado',
  abierto: 'Abierto',
  en_curso: 'En curso',
  pendiente: 'Pendiente',
  cerrado: 'Cerrado',
};

const statusStyles = {
  ABIERTO: 'bg-green-100 text-green-800',
  EN_CURSO: 'bg-blue-100 text-blue-800',
  PENDIENTE: 'bg-orange-100 text-orange-800',
  CERRADO: 'bg-purple-100 text-corporate-purple',
  abierto: 'bg-green-100 text-green-800',
  en_curso: 'bg-blue-100 text-blue-800',
  pendiente: 'bg-orange-100 text-orange-800',
  cerrado: 'bg-purple-100 text-corporate-purple',
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const extractFileName = (contentDisposition, fallback) => {
  if (!contentDisposition) {
    return fallback;
  }

  const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return match?.[1] || fallback;
};

const mapA3ToDraft = (a3) => {
  const paretoSummary = Array.isArray(a3?.paretoData?.items)
    ? a3.paretoData.items
    : Array.isArray(a3?.paretoData)
      ? a3.paretoData
      : [];

  const topText = paretoSummary.slice(0, 3).map((item, index) => {
    const problema = item.causa || item.problema || 'Sin causa';
    const total = item.total || item.frecuencia || 0;
    const acc = Number(item.accumulatedPercentage || item.acumulado || 0).toFixed(2);
    return `${index + 1}. ${problema} (${total}) - Acum: ${acc}%`;
  }).join(' | ');

  return {
    linea: a3.area || '',
    categoria: 'Calidad',
    fechaDesde: '',
    fechaHasta: '',
    nombreMejora: a3.titulo || '',
    antecedentes: a3.descripcionProblema || '',
    situacionActual: topText || 'Sin informacion de Pareto disponible',
    analisisProblema: a3.descripcionProblema || '',
    objetivo: a3.accionCorrectiva || '',
    analisisCausaRaiz: a3.causaRaiz || '',
    planAccionResumen: a3.accionCorrectiva || '',
    planAccion: [
      {
        accion: a3.accionCorrectiva || '',
        responsable: '',
        fechaCompromiso: '',
        estado: 'pendiente',
      },
    ],
    estandarizacion: 'Pendiente de estandarizacion documental.',
    estado: a3.estado ? String(a3.estado).toLowerCase() : 'abierto',
  };
};

export const A3PreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [a3, setA3] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadA3 = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await a3Service.getById(id);
        setA3(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar la vista previa del A3');
      } finally {
        setIsLoading(false);
      }
    };

    loadA3();
  }, [id]);

  const paretoData = useMemo(() => {
    const rawPareto = a3?.paretoData?.items || a3?.paretoData || [];
    return Array.isArray(rawPareto) ? rawPareto : [];
  }, [a3]);

  const statusKey = String(a3?.estado || 'ABIERTO');
  const statusLabel = statusLabels[statusKey] || statusLabels.ABIERTO;
  const statusClass = statusStyles[statusKey] || statusStyles.ABIERTO;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      setAlert(null);
      const response = await a3Service.downloadPdf(id);
      const filename = extractFileName(response.headers?.['content-disposition'], `A3-${id}.pdf`);
      downloadBlob(response.data, filename);
      setAlert({ type: 'success', message: 'PDF descargado correctamente.' });
    } catch (err) {
      console.error('Error descargando PDF:', err);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'No fue posible descargar el PDF.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEdit = () => {
    if (!a3) {
      return;
    }

    const draft = {
      currentStep: 2,
      formData: mapA3ToDraft(a3),
      aiModes: {
        antecedentes: 'locked',
        situacionActual: 'locked',
        analisisProblema: 'locked',
        analisisCausaRaiz: 'locked',
        planAccionResumen: 'locked',
      },
      paretoData,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    navigate('/a3/new');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-corporate-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner label="Cargando vista previa..." size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-corporate-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="no-print text-corporate-purple hover:text-purple-900 font-semibold mb-8"
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
    return null;
  }

  const totalIssues = paretoData.length;
  const topIssue = paretoData[0]?.causa || paretoData[0]?.problema || 'Sin datos';
  const topIssueTotal = paretoData[0]?.total || paretoData[0]?.frecuencia || 0;

  return (
    <div className="min-h-screen bg-corporate-background flex flex-col print-page-bg-white">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-corporate-purple hover:text-purple-900 font-semibold"
          >
            ← Volver
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 rounded-lg bg-corporate-orange text-white font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
            >
              {isDownloading ? 'Descargando...' : '⬇️ Descargar PDF'}
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-lg bg-corporate-purple text-white font-semibold hover:bg-purple-800 transition-colors"
            >
              ✏️ Editar
            </button>
          </div>
        </div>

        {alert && (
          <div className="no-print mb-4">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        <article className="a3-document print-page-shadow-none bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <header className="bg-gradient-to-r from-corporate-purple to-corporate-orange text-white px-5 sm:px-8 py-5 sm:py-6 print-break-inside-avoid">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] opacity-80">A3 Mejora Continua</p>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1">{a3.titulo}</h1>
                <p className="text-sm opacity-90 mt-2">
                  ID #{String(a3.id).padStart(4, '0')} · Área: {a3.area || 'N/A'} · Solicitante: {a3.solicitante || 'N/A'}
                </p>
              </div>
              <div className={`self-start px-4 py-2 rounded-full font-semibold text-sm ${statusClass} text-center`}>
                {statusLabel}
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 print-break-inside-avoid">
            <div className="lg:col-span-2 p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Nombre mejora</p>
                  <p className="text-gray-900 font-semibold mt-1">{a3.titulo || 'Sin título'}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Objetivo</p>
                  <p className="text-gray-900 font-semibold mt-1">{a3.accionCorrectiva || 'Pendiente'}</p>
                </div>
              </div>

              <div className="space-y-5">
                <section className="print-break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Antecedentes</h2>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-gray-700 leading-6">
                    {a3.descripcionProblema || 'Sin información de antecedentes disponible.'}
                  </div>
                </section>

                <section className="print-break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Situación actual</h2>
                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    {paretoData.length ? (
                      <ParetoChart data={paretoData} title="Pareto embebido del A3" />
                    ) : (
                      <p className="text-gray-600">No hay datos de Pareto disponibles para este A3.</p>
                    )}
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Análisis del problema</h2>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 text-gray-700 leading-6 min-h-[140px]">
                      {a3.descripcionProblema || 'Sin análisis disponible.'}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Causa raíz</h2>
                    <div className="rounded-xl border border-gray-200 bg-white p-4 text-gray-700 leading-6 min-h-[140px]">
                      {a3.causaRaiz || 'Pendiente de definición.'}
                    </div>
                  </div>
                </section>

                <section className="print-break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Plan de acción</h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="text-left px-4 py-3">Acción</th>
                          <th className="text-left px-4 py-3">Responsable</th>
                          <th className="text-left px-4 py-3">Fecha</th>
                          <th className="text-left px-4 py-3">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(a3.planAccion || [
                          { accion: a3.accionCorrectiva || 'Pendiente', responsable: '', fechaCompromiso: '', estado: a3.estado || 'pendiente' },
                        ]).map((row, index) => (
                          <tr key={`${row.accion || 'row'}-${index}`} className="border-t border-gray-200">
                            <td className="px-4 py-3 align-top">{row.accion || row.descripcion || 'Sin acción'}</td>
                            <td className="px-4 py-3 align-top">{row.responsable || 'N/A'}</td>
                            <td className="px-4 py-3 align-top">{row.fechaCompromiso || row.fecha || 'N/A'}</td>
                            <td className="px-4 py-3 align-top">{row.estado || 'Pendiente'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="print-break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-corporate-purple mb-2">Estandarización</h2>
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-gray-700 leading-6 min-h-[120px]">
                    {a3.estandarizacion || 'Pendiente de definir estandarización.'}
                  </div>
                </section>
              </div>
            </div>

            <aside className="p-5 sm:p-8 bg-gray-50 print-break-inside-avoid">
              <div className="space-y-4">
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Estado</p>
                  <p className="text-gray-900 font-semibold mt-1">{statusLabel}</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Fecha inicio</p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {a3.fecha_inicio ? new Date(a3.fecha_inicio).toLocaleDateString('es-MX') : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Fecha cierre</p>
                  <p className="text-gray-900 font-semibold mt-1">
                    {a3.fecha_cierre ? new Date(a3.fecha_cierre).toLocaleDateString('es-MX') : 'Pendiente'}
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Pareto resumen</p>
                  <p className="text-gray-900 font-semibold mt-1">{topIssue}</p>
                  <p className="text-sm text-gray-600 mt-2">Total: {topIssueTotal}</p>
                  <p className="text-sm text-gray-600">Problemas analizados: {totalIssues}</p>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Descripción</p>
                  <p className="text-gray-700 leading-6 mt-1">{a3.descripcionProblema || 'Sin descripción detallada.'}</p>
                </div>
              </div>
            </aside>
          </section>

          <footer className="bg-gray-900 text-white px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 print-break-inside-avoid">
            <p className="text-sm font-semibold">A3 Mejora Continua</p>
            <p className="text-xs text-gray-300">Generado para revisión, impresión y exportación PDF</p>
          </footer>
        </article>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
};
