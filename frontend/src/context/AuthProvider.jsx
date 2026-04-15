import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthErrorMessage = (err, fallbackMessage) => {
    if (err.response?.data?.error || err.response?.data?.message) {
      return err.response.data.error || err.response.data.message;
    }

    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      return 'No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución.';
    }

    return err.message || fallbackMessage;
  };

  // Cargar sesión existente del localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      return response.data;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, 'Error en login');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (email, password, name) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(email, password, name);
      const { token: newToken, user: userData } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      return response.data;
    } catch (err) {
      const errorMessage = getAuthErrorMessage(err, 'Error en registro');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
