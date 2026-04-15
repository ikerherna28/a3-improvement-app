import { useState, useEffect } from 'react';

export const ImportValidation = ({
  fileData,
  requiredColumns = [],
  onValidationComplete,
}) => {
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!fileData) return;

    setIsValidating(true);
    const timer = setTimeout(() => {
      validateData(fileData);
    }, 500); // Pequeño delay para UI feedback

    return () => clearTimeout(timer);
  }, [fileData, requiredColumns]);

  const validateData = (data) => {
    const errors = [];
    const warnings = [];

    // 1. Verificar columnas requeridas
    if (requiredColumns.length > 0) {
      const missingColumns = requiredColumns.filter(
        col => !data.columns.includes(col)
      );
      if (missingColumns.length > 0) {
        errors.push({
          type: 'missing_columns',
          message: `Columnas faltantes: ${missingColumns.join(', ')}`,
          details: missingColumns,
        });
      }
    }

    // 2. Validar celdas vacías
    const emptyRowIndices = [];
    data.data.forEach((row, idx) => {
      const rowValues = Object.entries(row)
        .filter(([key]) => !key.startsWith('__'))
        .map(([, value]) => value);
      const allEmpty = rowValues.every(v => !v || String(v).trim() === '');
      if (allEmpty) {
        emptyRowIndices.push(idx + 2); // +2 porque Excel cuenta desde 1 + header
      }
    });

    if (emptyRowIndices.length > 0) {
      warnings.push({
        type: 'empty_rows',
        message: `Se encontraron ${emptyRowIndices.length} filas vacías: ${emptyRowIndices.slice(0, 5).join(', ')}${emptyRowIndices.length > 5 ? '...' : ''}`,
        details: emptyRowIndices,
      });
    }

    // 3. Detectar datos duplicados (por primeras 2 columnas)
    if (data.columns.length >= 2) {
      const seen = new Set();
      const duplicateIndices = [];

      data.data.forEach((row, idx) => {
        const key = `${row[data.columns[0]]}-${row[data.columns[1]]}`;
        if (seen.has(key)) {
          duplicateIndices.push(idx + 2);
        }
        seen.add(key);
      });

      if (duplicateIndices.length > 0) {
        warnings.push({
          type: 'duplicates',
          message: `Se encontraron ${duplicateIndices.length} filas potencialmente duplicadas`,
          details: duplicateIndices.slice(0, 5),
        });
      }
    }

    // 4. Validar tipos de datos
    const typeIssues = [];
    data.data.forEach((row, idx) => {
      Object.entries(row)
        .filter(([col]) => !col.startsWith('__'))
        .forEach(([col, value]) => {
        if (!value || String(value).trim() === '') return;

        // Detectar columnas que parecen números pero tienen texto
        if (col.toLowerCase().includes('numero') || col.toLowerCase().includes('cantidad')) {
          if (isNaN(value)) {
            typeIssues.push({
              row: idx + 2,
              column: col,
              value,
            });
          }
        }
      });
    });

    if (typeIssues.length > 0) {
      warnings.push({
        type: 'type_mismatch',
        message: `Se encontraron ${typeIssues.length} celdas con tipo de dato incorrecto`,
        details: typeIssues.slice(0, 3),
      });
    }

    const isValid = errors.length === 0;

    setValidation({
      isValid,
      errors,
      warnings,
      totalIssues: errors.length + warnings.length,
      processedRows: data.rows,
      processedColumns: data.columns.length,
    });

    setIsValidating(false);

    if (onValidationComplete) {
      onValidationComplete({
        isValid,
        errors,
        warnings,
      });
    }
  };

  if (!fileData) {
    return null;
  }

  if (isValidating) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin text-2xl">⏳</div>
          <div>
            <p className="font-semibold text-blue-800">Validando datos...</p>
            <p className="text-sm text-blue-600">{fileData.rows} filas a verificar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Summary */}
      <div className={`rounded-lg p-4 border ${
        validation.isValid
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{validation.isValid ? '✅' : '⚠️'}</span>
          <h3 className={`font-semibold ${
            validation.isValid ? 'text-green-800' : 'text-red-800'
          }`}>
            {validation.isValid
              ? 'Archivo válido - Listo para importar'
              : 'Se encontraron errores'}
          </h3>
        </div>
        <p className={`text-sm ${
          validation.isValid ? 'text-green-700' : 'text-red-700'
        }`}>
          {validation.processedRows} filas × {validation.processedColumns} columnas
          {validation.totalIssues > 0 && ` • ${validation.totalIssues} problema(s) encontrado(s)`}
        </p>
      </div>

      {/* Errors */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <span>🛑</span> Errores ({validation.errors.length})
          </h4>
          <ul className="space-y-2">
            {validation.errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700">
                <p className="font-medium">{error.message}</p>
                {error.details && error.details.length > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Detalles: {Array.isArray(error.details) 
                      ? error.details.slice(0, 5).join(', ')
                      : error.details}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <span>⚠️</span> Advertencias ({validation.warnings.length})
          </h4>
          <ul className="space-y-2">
            {validation.warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-yellow-700">
                <p className="font-medium">{warning.message}</p>
                {warning.details && warning.details.length > 0 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    {warning.type === 'empty_rows' ? 'Filas: ' : 'Detalles: '}
                    {Array.isArray(warning.details)
                      ? warning.details.slice(0, 5).join(', ')
                      : JSON.stringify(warning.details).substring(0, 50)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
