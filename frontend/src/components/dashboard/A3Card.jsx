import { useNavigate } from 'react-router-dom';

export const A3Card = ({ a3 }) => {
  const navigate = useNavigate();

  const statusConfig = {
    abierto: { color: 'bg-green-100 text-green-800', icon: '🟢', label: 'Abierto' },
    en_curso: { color: 'bg-blue-100 text-blue-800', icon: '🔵', label: 'En Curso' },
    pendiente: { color: 'bg-orange-100 text-orange-800', icon: '🟠', label: 'Pendiente' },
    cerrado: { color: 'bg-purple-100 text-corporate-purple', icon: '🟣', label: 'Cerrado' },
  };

  const status = statusConfig[a3.status] || statusConfig.abierto;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-corporate-purple">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{a3.titulo}</h3>
          <p className="text-sm text-gray-500 mt-1">
            ID: <span className="font-mono">#A3-{String(a3.id).padStart(4, '0')}</span>
          </p>
        </div>
        <span className={`${status.color} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2`}>
          {status.icon} {status.label}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{a3.descripcion}</p>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500">Área</p>
          <p className="font-medium text-gray-700">{a3.area || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-500">Solicitante</p>
          <p className="font-medium text-gray-700">{a3.solicitante || 'N/A'}</p>
        </div>
      </div>

      <div className="border-t pt-4 flex items-center justify-between">
        <div className="text-sm">
          <p className="text-gray-500">Creado</p>
          <p className="font-medium text-gray-700">
            {a3.fecha_inicio ? new Date(a3.fecha_inicio).toLocaleDateString('es-MX') : 'Sin fecha'}
          </p>
        </div>

        <button
          onClick={() => navigate(`/a3/${a3.id}`)}
          className="bg-corporate-purple hover:bg-purple-900 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Ver Detalles →
        </button>
      </div>
    </div>
  );
};
