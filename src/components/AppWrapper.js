import React, { useEffect, useState } from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { authService } from 'src/services/authService';
import { CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';

const AppWrapper = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);
        
        // Kiểm tra authentication
        const userInfo = await authService.initializeAuth();
        
        if (userInfo) {
          // User đã đăng nhập
          dispatch(setAuthenticate({ isAuthenticated: true }));
          dispatch(setInitialized(true));
          // Kiểm tra current path
          const currentPath = window.location.pathname;
          
          // Nếu đang ở trang login mà đã đăng nhập thì redirect
          if (currentPath === '/auth/login' || currentPath === '/') {
            const redirectPath = userInfo.role === 'admin' 
              ? '/admin/dashboard' 
              : '/ideas';
            router.push(redirectPath);
          }
        } else {
          // User chưa đăng nhập
          dispatch(setAuthenticate({ isAuthenticated: false }));
          dispatch(setInitialized(true));
          
          // Kiểm tra current path
          const currentPath = window.location.pathname;
          
          // Nếu không phải trang public thì redirect về login
          const publicPaths = ['/auth/login'];
          if (!publicPaths.includes(currentPath)) {
            router.push(`/auth/login?returnTo=${encodeURIComponent(currentPath)}`);
          }
        }
      } catch (error) {
        console.error('App initialization error:', error);
        dispatch(setAuthenticate({ isAuthenticated: false }));
        dispatch(setInitialized(true));
        
        // Redirect về login nếu có lỗi
        const currentPath = window.location.pathname;
        const publicPaths = ['/auth/login'];
        if (!publicPaths.includes(currentPath)) {
          router.push('/auth/login');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    // Chỉ initialize một lần khi app load
    if (!isInitialized) {
      initializeApp();
    }
  }, [dispatch, router, isInitialized]);

  // Hiển thị loading khi đang khởi tạo
  if (isInitializing || !isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <CircularProgress />
        <div style={{ marginTop: '1rem' }}>Loading...</div>
      </Box>
    );
  }

  return children;
};

export default AppWrapper;