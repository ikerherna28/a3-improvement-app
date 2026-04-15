export const PasswordStrengthIndicator = ({ password, confirmPassword }) => {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    lowercase: /[a-z]/.test(password),
    match: confirmPassword ? password === confirmPassword : null,
  };

  const passedChecks = Object.values(checks).filter((v) => v === true).length;
  const totalChecks = Object.values(checks).filter((v) => v !== null).length;
  const strength = Math.round((passedChecks / totalChecks) * 100);

  const getStrengthColor = () => {
    if (strength < 33) return 'bg-red-500';
    if (strength < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength < 33) return 'Débil';
    if (strength < 66) return 'Media';
    return 'Fuerte';
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700">Fortaleza de contraseña:</p>
        <span className={`text-xs font-bold ${strength < 33 ? 'text-red-600' : strength < 66 ? 'text-yellow-600' : 'text-green-600'}`}>
          {getStrengthText()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>

      {/* Checklist */}
      <ul className="text-xs text-gray-600 space-y-1">
        <li className={checks.length ? 'text-green-600' : ''}>
          {checks.length ? '✅' : '⭕'} Al menos 8 caracteres
        </li>
        <li className={checks.uppercase ? 'text-green-600' : ''}>
          {checks.uppercase ? '✅' : '⭕'} Al menos una mayúscula
        </li>
        <li className={checks.lowercase ? 'text-green-600' : ''}>
          {checks.lowercase ? '✅' : '⭕'} Al menos una minúscula
        </li>
        <li className={checks.number ? 'text-green-600' : ''}>
          {checks.number ? '✅' : '⭕'} Al menos un número
        </li>
        {confirmPassword !== undefined && (
          <li className={checks.match === null ? '' : checks.match ? 'text-green-600' : 'text-red-600'}>
            {checks.match === null ? '⭕' : checks.match ? '✅' : '❌'} Las contraseñas coinciden
          </li>
        )}
      </ul>
    </div>
  );
};
