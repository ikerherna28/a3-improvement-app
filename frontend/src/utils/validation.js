/**
 * Validaciones para formularios
 */

export const validation = {
  /**
   * Valida formato de email
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida que la contraseña cumpla los requisitos
   * - Al menos 8 caracteres
   * - Al menos una mayúscula
   * - Al menos un número
   */
  isStrongPassword: (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    return minLength && hasUppercase && hasNumber && hasLowercase;
  },

  /**
   * Obtiene mensaje de error para contraseña débil
   */
  getPasswordErrorMessage: (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    return null;
  },

  /**
   * Valida que dos contraseñas coincidan
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  /**
   * Valida nombre (mínimo 2 caracteres)
   */
  isValidName: (name) => {
    return name.trim().length >= 2;
  },

  /**
   * Obtiene mensaje de error para nombre
   */
  getNameErrorMessage: (name) => {
    if (!name.trim()) {
      return 'El nombre es requerido';
    }
    if (name.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    return null;
  },

  /**
   * Obtiene mensaje de error para email
   */
  getEmailErrorMessage: (email) => {
    if (!email.trim()) {
      return 'El email es requerido';
    }
    if (!validation.isValidEmail(email)) {
      return 'Por favor ingresa un email válido (ej: usuario@example.com)';
    }
    return null;
  },
};
