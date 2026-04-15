import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ParetoChart } from '../components/charts/ParetoChart';
import { dataService } from '../services/api';

export const ParetoPage = () => {
  const [paretoData, setParetoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sourceType: '',
    area: '',
    top: 10,
  });

  const totalFrecuencia = useMemo(
    () => paretoData.reduce((acc, item) => acc + (item.total || 0), 0),
    [paretoData]
  );

  const fetchPareto = async (customFilters = filters) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        top: customFilters.top,
      };

      if (customFilters.sourceType) {
        params.sourceType = customFilters.sourceType;
      }

      if (customFilters.area.trim()) {
        params.area = customFilters.area.trim();
      }

      const { data } = await dataService.getPareto(params);
      const items = Array.isArray(data?.items) ? data.items : [];
      setParetoData(items);
    } catch (err) {
      console.error('Error cargando pareto:', err);
      setError(err?.response?.data?.message || 'No se pudo cargar el gráfico Pareto.');
      setParetoData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPareto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    fetchPareto(filters);
  };

  return (
    <div className="min-h-screen bg-corporate-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-corporate-purple">Gráfico Pareto</h1>
          <p className="text-gray-600 mt-1">
            Identifica los problemas críticos y su impacto acumulado para priorizar acciones.
          </p>
        </div>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>

          <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
              <select
                value={filters.sourceType}
                onChange={(e) => handleFilterChange('sourceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Todos</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <input
                type="text"
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                placeholder="Ej. L2 - Puertas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top</label>
              <select
                value={filters.top}
                onChange={(e) => handleFilterChange('top', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-corporate-orange hover:bg-orange-600 text-white rounded-md font-medium transition-colors"
            >
              Aplicar filtros
            </button>
          </form>
        </section>

        {error && (
          <div className="mb-6">
            <Alert type="error" text={error} onClose={() => setError(null)} />
          </div>
        )}

        <section className="mb-6">
          {isLoading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-10">
              <LoadingSpinner label="Cargando gráfico Pareto..." />
            </div>
          ) : (
            <ParetoChart data={paretoData} title="Pareto de Problemas" />
          )}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Resumen</h2>
          <p className="text-gray-700">Problemas analizados: {paretoData.length}</p>
          <p className="text-gray-700">Frecuencia total: {totalFrecuencia}</p>
          <p className="text-gray-600 text-sm mt-2">
            Regla Pareto: prioriza los elementos hasta cruzar la línea de 80% acumulado.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};
