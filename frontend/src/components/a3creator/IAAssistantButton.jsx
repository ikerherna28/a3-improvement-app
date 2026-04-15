export const IAAssistantButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Generar con IA',
  className = '',
  title = 'Generar contenido con IA',
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isLoading
          ? 'bg-orange-100 text-[#F2620F]'
          : 'bg-orange-50 text-[#F2620F] hover:bg-orange-100'
      } ${className}`}
    >
      <span className="text-base leading-none text-[#F2620F]">
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#F2620F] border-t-transparent" />
        ) : (
          '✨'
        )}
      </span>
      <span>{isLoading ? 'Generando...' : label}</span>
    </button>
  );
};
