import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from 'src/services/authService';
import { useAppDispatch } from 'src/redux/hook';
import { setAuthenticate, setInitialized } from 'src/redux/reducers/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const userInfo = await authService.initializeAuth();
        
        if (userInfo) {
          setUser(userInfo);
          dispatch(setInitialized(true));
          dispatch(setAuthenticate({ isAuthenticated: true }));
        } else {
          setUser(null);
          dispatch(setInitialized(true));
          dispatch(setAuthenticate({ isAuthenticated: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        dispatch(setInitialized(true));
        dispatch(setAuthenticate({ isAuthenticated: false }));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (credentials) => {
    try {
      const userInfo = await authService.login(credentials);
      setUser(userInfo);
      dispatch(setInitialized(true));
      dispatch(setAuthenticate({ isAuthenticated: true }));
      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      dispatch(setAuthenticate({ isAuthenticated: false }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
