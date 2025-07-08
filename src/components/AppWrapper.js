import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { authService } from 'src/services/authService';
import { CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';

const AppWrapper = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  // Hàm redirect an toàn
  const safeRedirect = useCallback(
    async (path) => {
      if (hasRedirected) return;

      try {
        setHasRedirected(true);
        await router.push(path);
      } catch (error) {
        console.error('Redirect error:', error);
        setHasRedirected(false);
      }
    },
    [router, hasRedirected],
  );

  useEffect(() => {
    const initializeApp = async () => {
      // Prevent multiple initializations
      if (isInitialized) return;

      try {
        setIsInitializing(true);

        // Kiểm tra authentication
        const userInfo = await authService.initializeAuth();
        const currentPath = window.location.pathname;

        if (userInfo) {
          // User đã đăng nhập
          dispatch(setAuthenticate({ isAuthenticated: true }));

          // Kiểm tra nếu đang ở trang cần redirect
          if (currentPath === '/auth/login' || currentPath === '/') {
            const redirectPath = userInfo.role === 'admin' ? '/admin/dashboard' : '/ideas';

            // Delay nhỏ để đảm bảo state đã update
            setTimeout(() => {
              safeRedirect(redirectPath);
            }, 100);
          }
        } else {
          // User chưa đăng nhập
          dispatch(setAuthenticate({ isAuthenticated: false }));

          // Kiểm tra nếu không phải trang public thì redirect về login
          const publicPaths = ['/auth/login'];
          if (!publicPaths.includes(currentPath)) {
            setTimeout(() => {
              safeRedirect(`/auth/login?returnTo=${encodeURIComponent(currentPath)}`);
            }, 100);
          }
        }

        // Set initialized sau khi xử lý xong
        dispatch(setInitialized(true));
      } catch (error) {
        console.error('App initialization error:', error);
        dispatch(setAuthenticate({ isAuthenticated: false }));
        dispatch(setInitialized(true));

        // Redirect về login nếu có lỗi
        const currentPath = window.location.pathname;
        const publicPaths = ['/auth/login'];
        if (!publicPaths.includes(currentPath)) {
          setTimeout(() => {
            safeRedirect('/auth/login');
          }, 100);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    // Chỉ initialize một lần khi app load
    initializeApp();
  }, []); // Chỉ chạy 1 lần khi mount

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
        <div style={{ marginTop: '1rem' }}>Đang tải...</div>
      </Box>
    );
  }

  return children;
};

export default AppWrapper;
