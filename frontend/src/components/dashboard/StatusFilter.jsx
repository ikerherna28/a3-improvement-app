export const StatusFilter = ({ selectedStatus, onStatusChange, stats }) => {
  const filters = [
    {
      id: 'all',
      label: 'Todas',
      icon: '📊',
      color: 'text-gray-700',
      bgColor: 'bg-gray-100 hover:bg-gray-200',
      activeBg: 'bg-gray-700 text-white hover:bg-gray-800',
      count: stats?.total,
    },
    {
      id: 'abierto',
      label: 'Abiertos',
      icon: '🟢',
      color: 'text-green-700',
      bgColor: 'bg-green-100 hover:bg-green-200',
      activeBg: 'bg-green-700 text-white hover:bg-green-800',
      count: stats?.abierto,
    },
    {
      id: 'en_curso',
      label: 'En Curso',
      icon: '🔵',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100 hover:bg-blue-200',
      activeBg: 'bg-blue-700 text-white hover:bg-blue-800',
      count: stats?.en_curso,
    },
    {
      id: 'pendiente',
      label: 'Pendientes',
      icon: '🟠',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100 hover:bg-orange-200',
      activeBg: 'bg-orange-700 text-white hover:bg-orange-800',
      count: stats?.pendiente,
    },
    {
      id: 'cerrado',
      label: 'Cerrados',
      icon: '🟣',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100 hover:bg-purple-200',
      activeBg: 'bg-purple-700 text-white hover:bg-purple-800',
      count: stats?.cerrado,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onStatusChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
            selectedStatus === filter.id ? filter.activeBg : filter.bgColor
          }`}
        >
          <span className="mr-2">{filter.icon}</span>
          {filter.label}
          {filter.count !== undefined && (
            <span className="ml-2 bg-black bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
