import { useMemo } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';
import { ParetoChart } from '../charts/ParetoChart';

const DEFAULT_LINEAS = [
  'L1 - Traccion',
  'L2 - Puertas',
  'L3 - Cabina',
  'L4 - Accionamientos',
  'L5 - Mantenimiento',
];

const DEFAULT_CATEGORIAS = [
  'Calidad',
  'Seguridad',
  'Productividad',
  'Mantenimiento',
  'Coste',
  'Entrega',
];

export const DataSelectionStep = ({
  values,
  errors,
  isLoading,
  paretoData,
  onChange,
  onGeneratePareto,
  onNext,
  onBack,
}) => {
  const hasPareto = useMemo(() => (paretoData?.length || 0) > 0, [paretoData]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Paso 1: Seleccion de datos</h2>
        <p className="text-sm text-gray-600 mb-6">
          Define filtros para construir el Pareto base del A3.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Linea</label>
            <select
              value={values.linea}
              onChange={(e) => onChange('linea', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.linea
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-purple-200'
              }`}
            >
              <option value="">Selecciona una linea...</option>
              {DEFAULT_LINEAS.map((linea) => (
                <option key={linea} value={linea}>
                  {linea}
                </option>
              ))}
            </select>
            {errors.linea && <p className="text-red-600 text-xs mt-1">{errors.linea}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
            <select
              value={values.categoria}
              onChange={(e) => onChange('categoria', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.categoria
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-purple-200'
              }`}
            >
              <option value="">Selecciona una categoria...</option>
              {DEFAULT_CATEGORIAS.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-600 text-xs mt-1">{errors.categoria}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha desde</label>
            <input
              type="date"
              value={values.fechaDesde}
              onChange={(e) => onChange('fechaDesde', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.fechaDesde
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-purple-200'
              }`}
            />
            {errors.fechaDesde && <p className="text-red-600 text-xs mt-1">{errors.fechaDesde}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha hasta</label>
            <input
              type="date"
              value={values.fechaHasta}
              onChange={(e) => onChange('fechaHasta', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.fechaHasta
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-purple-200'
              }`}
            />
            {errors.fechaHasta && <p className="text-red-600 text-xs mt-1">{errors.fechaHasta}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGeneratePareto}
            disabled={isLoading}
            className="px-6 py-3 bg-corporate-purple hover:bg-purple-800 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generando...' : 'Generar Pareto'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold"
          >
            Volver
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasPareto}
            className="px-6 py-3 bg-corporate-orange hover:bg-orange-600 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Continuar al paso 2
          </button>
        </div>

        {isLoading && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <LoadingSpinner label="Generando Pareto..." />
          </div>
        )}
      </div>

      {hasPareto && (
        <ParetoChart data={paretoData} title="Pareto generado para el A3" />
      )}
    </div>
  );
};
