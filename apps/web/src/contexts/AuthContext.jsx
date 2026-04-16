import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import pb, { normalizePocketBaseError } from '@/lib/pocketbaseClient.js';
import { logger } from '@/lib/logger.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model ?? null);
  const [loading, setLoading] = useState(true);
  const [lastAuthChangeAt, setLastAuthChangeAt] = useState(null);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setCurrentUser(model ?? null);
      setLastAuthChangeAt(new Date().toISOString());
      setLoading(false);
    }, true);

    return () => unsubscribe();
  }, []);

  const handleAuthError = useCallback((operation, error) => {
    const normalizedError = normalizePocketBaseError(error);
    logger.error(`${operation} failed`, normalizedError);
    throw normalizedError;
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, {
        $autoCancel: false,
      });
      setCurrentUser(authData.record ?? pb.authStore.model ?? null);
      return authData;
    } catch (error) {
      handleAuthError('Login', error);
    }
  }, [handleAuthError]);

  const signup = useCallback(async (data) => {
    try {
      const record = await pb.collection('users').create(data, { $autoCancel: false });
      await login(data.email, data.password);
      return record;
    } catch (error) {
      handleAuthError('Signup', error);
    }
  }, [handleAuthError, login]);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setCurrentUser(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
    } catch (error) {
      handleAuthError('Password reset', error);
    }
  }, [handleAuthError]);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid || !currentUser?.collectionName) {
      return null;
    }

    try {
      const response = await pb.collection(currentUser.collectionName).authRefresh({
        $autoCancel: false,
      });
      setCurrentUser(response.record ?? pb.authStore.model ?? null);
      return response;
    } catch (error) {
      logout();
      handleAuthError('Session refresh', error);
    }
  }, [currentUser?.collectionName, handleAuthError, logout]);

  const value = useMemo(() => ({
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    refreshSession,
    isAuthenticated: Boolean(currentUser && pb.authStore.isValid),
    isAdmin: Boolean(currentUser?.role === 'admin' || pb.authStore.isSuperuser),
    isLoading: loading,
    lastAuthChangeAt,
  }), [
    currentUser,
    lastAuthChangeAt,
    loading,
    login,
    logout,
    refreshSession,
    resetPassword,
    signup,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
