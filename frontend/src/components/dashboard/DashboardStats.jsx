export const DashboardStats = ({ stats }) => {
  const statConfigs = [
    {
      key: 'total',
      label: 'Total A3s',
      icon: '📊',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      key: 'abierto',
      label: 'A3s Abiertos',
      icon: '🟢',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
    },
    {
      key: 'en_curso',
      label: 'En Curso',
      icon: '🔵',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
    },
    {
      key: 'pendiente',
      label: 'Pendientes',
      icon: '🟠',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      key: 'cerrado',
      label: 'Cerrados',
      icon: '🟣',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-corporate-purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statConfigs.map((config) => {
        const value = stats?.[config.key] ?? 0;
        return (
          <div
            key={config.key}
            className={`${config.bgColor} ${config.borderColor} rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{config.icon}</span>
              <span className="text-3xl font-bold text-gray-800">{value}</span>
            </div>
            <p className={`text-sm font-semibold ${config.textColor}`}>{config.label}</p>
            {config.key !== 'total' && (
              <p className="text-xs text-gray-500 mt-1">
                {stats?.total ? `${Math.round((value / stats.total) * 100)}%` : '0%'} del total
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
