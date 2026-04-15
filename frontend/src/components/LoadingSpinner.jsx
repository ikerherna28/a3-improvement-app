export const LoadingSpinner = ({ label = 'Cargando...', size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    default: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-live="polite" aria-label={label}>
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full border-corporate-purple border-t-corporate-orange ${sizeClasses[size]}`}
          aria-hidden="true"
        />
        <p className="mt-4 text-corporate-purple text-lg font-medium">{label}</p>
      </div>
    </div>
  );
};
