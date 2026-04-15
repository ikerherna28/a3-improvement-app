export const Alert = ({ type = 'info', title, message, text, onClose }) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: '✅',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'ℹ️',
    },
  };

  const style = typeStyles[type];

  const content = message || text;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${style.bg} ${style.border} ${style.text} px-4 py-3 rounded-lg text-sm border transition-all duration-200 flex items-start justify-between gap-3`}
    >
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0">{style.icon}</span>
        <div>
          {title && <p className="font-semibold">{title}</p>}
          {content && <p>{content}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-lg leading-none hover:opacity-70 transition-opacity flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  );
};
