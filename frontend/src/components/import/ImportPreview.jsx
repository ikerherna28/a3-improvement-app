import { useState } from 'react';

export const ImportPreview = ({ fileData, validation = null }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  if (!fileData) return null;

  const toggleRowExpand = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const previewRows = fileData.data.slice(0, 10);
  const hiddenRowsCount = Math.max(0, fileData.data.length - 10);

  // Determinar si hay errores en filas específicas
  const errorRowIndices = new Set();
  if (validation?.warnings) {
    validation.warnings.forEach(w => {
      if (w.type === 'empty_rows' && w.details) {
        w.details.forEach(rowNum => {
          errorRowIndices.add(rowNum - 2); // Convertir de número Excel a índice
        });
      }
    });
  }

  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Vista previa de datos</h3>
        <p className="text-sm text-gray-600 mt-1">
          Mostrando {previewRows.length} de {fileData.rows} filas
          {hiddenRowsCount > 0 && ` (+${hiddenRowsCount} más)`}
        </p>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 w-12">#</th>
              {fileData.columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-700 bg-gray-100 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 w-10">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, idx) => {
              const isExpanded = expandedRows.has(idx);
              const hasError = errorRowIndices.has(idx);

              return (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    hasError ? 'bg-red-50' : ''
                  }`}
                >
                  {/* Número de fila */}
                  <td className="px-4 py-2 text-xs font-mono text-gray-500">
                    {idx + 2}
                  </td>

                  {/* Celdas de datos */}
                  {fileData.columns.map((col) => {
                    const value = row[col];
                    const isEmpty = !value || String(value).trim() === '';
                    const displayValue = isEmpty ? '-' : String(value).substring(0, 30);
                    const isTruncated = String(value).length > 30;

                    return (
                      <td
                        key={col}
                        className={`px-4 py-2 text-xs font-mono ${
                          isEmpty
                            ? 'text-gray-400 italic'
                            : hasError
                            ? 'text-red-700 font-medium'
                            : 'text-gray-800'
                        }`}
                        title={isEmpty ? 'Celda vacía' : String(value)}
                      >
                        {displayValue}
                        {isTruncated && (
                          <span className="text-gray-400 ml-1">...</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Botón expandir */}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleRowExpand(idx)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title="Ver todos los detalles de la fila"
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Fila expandida - Detalles completos */}
      {Array.from(expandedRows).map((expandedIdx) => (
        <div key={`expanded-${expandedIdx}`} className="bg-blue-50 border-t border-gray-200 p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Fila {expandedIdx + 2} - Detalles completos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fileData.columns.map((col) => {
              const value = previewRows[expandedIdx][col];
              const isEmpty = !value || String(value).trim() === '';

              return (
                <div key={col} className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-1 uppercase tracking-wide">
                    {col}
                  </p>
                  <p className={`text-sm font-mono break-words ${
                    isEmpty
                      ? 'text-gray-400 italic'
                      : 'text-gray-800'
                  }`}>
                    {isEmpty ? '(vacío)' : String(value)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Información de filas ocultas */}
      {hiddenRowsCount > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            +{hiddenRowsCount} fila{hiddenRowsCount === 1 ? '' : 's'} más no mostrada{hiddenRowsCount === 1 ? '' : 's'} en la vista previa
          </p>
        </div>
      )}
    </div>
  );
};
