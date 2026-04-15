import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '../components/import/FileUploader';
import { ImportValidation } from '../components/import/ImportValidation';
import { ImportPreview } from '../components/import/ImportPreview';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { dataService } from '../services/api';
import { workbookAreas, workbookCategories } from '../utils/workbookOptions';

export const DataImportPage = () => {
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [linea, setLinea] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const areas = workbookAreas;
  const categorias = workbookCategories;

  const handleFileSelect = (data) => {
    setFileData(data);
    setUploadMessage(null);
  };

  const handleValidationComplete = (validationResult) => {
    setValidation(validationResult);
  };

  const handleUpload = async () => {
    if (!fileData) {
      setUploadMessage({
        type: 'error',
        text: 'Por favor selecciona un archivo',
      });
      return;
    }

    if (!validation || !validation.isValid) {
      setUploadMessage({
        type: 'error',
        text: 'El archivo contiene errores. Corrígelos antes de continuar.',
      });
      return;
    }

    if (!linea) {
      setUploadMessage({
        type: 'error',
        text: 'Por favor selecciona un área',
      });
      return;
    }

    if (!departamento) {
      setUploadMessage({
        type: 'error',
        text: 'Por favor selecciona una categoría',
      });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      if (!fileData.originalFile) {
        throw new Error('No se encontró el archivo original para subir al servidor.');
      }

      // Enviar a backend usando multipart/form-data
      const { data } = await dataService.upload({
        file: fileData.originalFile,
        linea,
        departamento,
      });

      // Registrar en historial
      const historyEntry = {
        id: Date.now(),
        fileName: fileData.name,
        linea,
        departamento,
        rowsUploaded: data?.inserted ?? fileData.rows,
        timestamp: new Date().toLocaleString('es-ES'),
        status: 'success',
        duplicates: data?.duplicates ?? 0,
        invalid: data?.invalid ?? 0,
      };

      setUploadHistory([historyEntry, ...uploadHistory]);

      setUploadMessage({
        type: 'success',
        text: `Archivo importado con éxito. Insertadas: ${data?.inserted ?? 0}, duplicadas: ${data?.duplicates ?? 0}, inválidas: ${data?.invalid ?? 0}.`,
      });

      // Resetear formulario
      setTimeout(() => {
        setFileData(null);
        setValidation(null);
        setLinea('');
        setDepartamento('');
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage({
        type: 'error',
        text: error.message || 'Error al subir el archivo. Por favor intenta nuevamente.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewData = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Importar datos</h1>
          <p className="mt-2 text-gray-600">
            Carga datos desde Excel o CSV para crear nuevos A3 o enriquecer existentes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Messages */}
        {uploadMessage && (
          <div className="mb-6">
            <Alert
              type={uploadMessage.type}
              text={uploadMessage.text}
              onClose={() => setUploadMessage(null)}
            />
          </div>
        )}

        {/* Step 1: File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-corporate-purple text-white font-bold mr-3">
              1
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Seleccionar archivo</h2>
          </div>
          <FileUploader onFileSelect={handleFileSelect} />
        </div>

        {fileData && (
          <>
            {/* Step 2: Validation */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-corporate-purple text-white font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Validar datos</h2>
              </div>
              <ImportValidation
                fileData={fileData}
                onValidationComplete={handleValidationComplete}
              />
            </div>

            {/* Step 3: Preview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-corporate-purple text-white font-bold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Vista previa</h2>
              </div>
              <ImportPreview fileData={fileData} validation={validation} />
            </div>

            {/* Step 4: Selectors */}
            {validation?.isValid && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-corporate-purple text-white font-bold mr-3">
                    4
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Información de importación
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Línea Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Área de proceso *
                    </label>
                    <select
                      value={linea}
                      onChange={(e) => setLinea(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-corporate-purple focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Selecciona un área...</option>
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Categoría Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={departamento}
                      onChange={(e) => setDepartamento(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-corporate-purple focus:ring-2 focus:ring-purple-200"
                    >
                      <option value="">Selecciona una categoría...</option>
                      {categorias.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Submit Button */}
            {validation?.isValid && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-corporate-purple text-white font-bold mr-3">
                    5
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Confirmar importación</h2>
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="mb-4">
                    <LoadingSpinner label="Subiendo archivo..." size="sm" />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !linea || !departamento}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                      isUploading || !linea || !departamento
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-corporate-purple hover:bg-purple-700 active:scale-95'
                    }`}
                  >
                    {isUploading ? '⏳ Importando...' : '✓ Importar datos'}
                  </button>
                  <button
                    onClick={() => {
                      setFileData(null);
                      setValidation(null);
                      setLinea('');
                      setDepartamento('');
                      setUploadMessage(null);
                    }}
                    disabled={isUploading}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Upload History Section */}
        {uploadHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Historial de importaciones ({uploadHistory.length})
              </h2>
              <span className="text-2xl">{showHistory ? '▼' : '▶'}</span>
            </button>

            {showHistory && (
              <div className="space-y-3 border-t border-gray-200 pt-4">
                {uploadHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{entry.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {entry.linea} • {entry.departamento} • {entry.rowsUploaded} filas
                      </p>
                      <p className="text-xs text-gray-500">
                        Duplicadas: {entry.duplicates} • Inválidas: {entry.invalid}
                      </p>
                      <p className="text-xs text-gray-500">{entry.timestamp}</p>
                    </div>
                    <span className="text-green-600 font-semibold">✓ {entry.status}</span>
                  </div>
                ))}

                <button
                  onClick={handleViewData}
                  className="w-full mt-4 px-4 py-2 bg-corporate-orange text-white rounded-lg font-semibold hover:bg-orange-600 transition-all"
                >
                  Ver datos importados →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
