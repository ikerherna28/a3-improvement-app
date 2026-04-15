import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

export const FileUploader = ({ onFileSelect, acceptedFormats = ['.xlsx', '.xls', '.csv'] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parseError, setParseError] = useState(null);
  const fileInputRef = useRef(null);

  // Parsear archivo
  const parseFile = (file) => {
    try {
      setParseError(null);

      if (!file) {
        throw new Error('No se seleccionó archivo');
      }

      // Validar tipo de archivo
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

      if (!hasValidExtension) {
        throw new Error(`Formato no soportado. Usa: ${acceptedFormats.join(', ')}`);
      }

      // Leer archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Obtener primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            throw new Error('El archivo está vacío');
          }

          setSelectedFile({
            name: file.name,
            size: file.size,
            rows: jsonData.length,
            columns: Object.keys(jsonData[0]),
            data: jsonData,
            originalFile: file,
          });

          // Llamar callback
          onFileSelect({
            name: file.name,
            size: file.size,
            rows: jsonData.length,
            columns: Object.keys(jsonData[0]),
            data: jsonData,
            originalFile: file,
          });
        } catch (err) {
          setParseError(err.message || 'Error al procesar el archivo');
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setParseError(err.message);
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      parseFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      parseFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParseError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDrag}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-corporate-purple bg-purple-50'
              : 'border-gray-300 bg-gray-50 hover:border-corporate-purple hover:bg-purple-50'
          }`}
        >
          <div className="text-4xl mb-3">[FILE]</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Arrastra tu archivo aquí</h3>
          <p className="text-sm text-gray-600 mb-4">
            O haz clic para seleccionar un archivo
          </p>
          <p className="text-xs text-gray-500">
            Formatos soportados: {acceptedFormats.join(', ')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
            accept={acceptedFormats.join(',')}
          />
        </div>
      ) : (
        /* Archivo seleccionado */
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="text-3xl">OK</div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 text-lg">{selectedFile.name}</h3>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">{selectedFile.rows}</p>
                    <p className="text-green-600 text-xs">Filas</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">{selectedFile.columns.length}</p>
                    <p className="text-green-600 text-xs">Columnas</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-green-600 text-xs">Tamaño</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-green-600 font-semibold mb-2">Columnas detectadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.columns.map((col, idx) => (
                      <span
                        key={idx}
                        className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-mono"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-green-600 hover:text-green-800 font-bold text-2xl ml-4"
              title="Cambiar archivo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {parseError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold">❌ Error al procesar archivo</p>

          <p className="mt-1">{parseError}</p>
        </div>
      )}
    </div>
  );
};
