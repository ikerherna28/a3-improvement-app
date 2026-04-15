import logoBlanco from '../assets/branding/logo_blanco.png';
import logoColor from '../assets/branding/logo_color.png';
import logoNegro from '../assets/branding/logo_negro.png';

const sizeMap = {
  sm: 'h-8 sm:h-9',
  md: 'h-10 sm:h-11',
  lg: 'h-12 sm:h-14',
};

export const BrandLogo = ({
  variant = 'light',
  size = 'md',
  showText = true,
  compact = false,
  className = '',
}) => {
  const imageClassName = [
    'block w-auto object-contain shrink-0',
    sizeMap[size] || sizeMap.md,
  ]
    .filter(Boolean)
    .join(' ');

  const logoByVariant = {
    dark: logoBlanco,
    light: logoColor,
    monochrome: logoNegro,
    color: logoColor,
  };

  const logoSrc = logoByVariant[variant] || logoColor;

  const textClassName = variant === 'dark' ? 'text-white' : 'text-slate-900';
  const subTextClassName = variant === 'dark' ? 'text-white/75' : 'text-slate-500';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt="TK Elevator"
        className={imageClassName}
        loading="eager"
        decoding="async"
      />
      {showText && !compact && (
        <div className="leading-tight">
          <p className={`text-sm sm:text-base font-semibold tracking-wide ${textClassName}`}>
            A3 Mejora Continua
          </p>
          <p className={`text-xs sm:text-sm ${subTextClassName}`}>
            Gestión profesional de acciones
          </p>
        </div>
      )}
    </div>
  );
};