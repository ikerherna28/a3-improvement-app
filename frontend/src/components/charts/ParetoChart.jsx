import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';

const PARETO_PURPLE = '#8A1C8C';
const PARETO_ORANGE = '#F2620F';

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const frecuencia = payload.find((entry) => entry.dataKey === 'frecuencia')?.value ?? 0;
  const acumulado = payload.find((entry) => entry.dataKey === 'acumulado')?.value ?? 0;

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-md p-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1">{label}</p>
      <p className="text-gray-700">
        Frecuencia: <span className="font-semibold" style={{ color: PARETO_PURPLE }}>{frecuencia}</span>
      </p>
      <p className="text-gray-700">
        Acumulado: <span className="font-semibold" style={{ color: PARETO_ORANGE }}>{formatPercent(acumulado)}</span>
      </p>
    </div>
  );
};

export const ParetoChart = ({ data = [], title = 'Análisis de Pareto' }) => {
  const chartRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const chartData = useMemo(() => {
    return data.map((item) => ({
      problema: item.problema ?? item.causa ?? 'Sin dato',
      frecuencia: Number(item.frecuencia ?? item.total ?? 0),
      acumulado: Number(item.acumulado ?? item.accumulatedPercentage ?? 0),
    }));
  }, [data]);

  const handleExport = async () => {
    if (!chartRef.current || chartData.length === 0) {
      return;
    }

    try {
      setIsExporting(true);
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `pareto-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (error) {
      console.error('Error exportando gráfico:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">
            Barras: Frecuencia | Línea: % acumulado | Referencia Pareto: 80%
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting || chartData.length === 0}
          className="px-4 py-2 rounded-md font-medium text-white bg-corporate-purple hover:bg-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? 'Exportando...' : 'Exportar PNG'}
        </button>
      </div>

      {chartData.length === 0 ? (
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500">No hay datos para mostrar en el Pareto.</p>
        </div>
      ) : (
        <div ref={chartRef} className="bg-white">
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="problema"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <YAxis
                  yAxisId="left"
                  label={{ value: 'Frecuencia', angle: -90, position: 'insideLeft' }}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  label={{ value: 'Porcentaje acumulado', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <ReferenceLine
                  yAxisId="right"
                  y={80}
                  stroke="#EF4444"
                  strokeDasharray="6 6"
                  label={{ value: '80%', fill: '#EF4444', position: 'insideTopRight' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="frecuencia"
                  name="Frecuencia"
                  fill={PARETO_PURPLE}
                  barSize={38}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="acumulado"
                  name="% Acumulado"
                  stroke={PARETO_ORANGE}
                  strokeWidth={3}
                  dot={{ r: 4, fill: PARETO_ORANGE }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
