// src/components/ProtectedRoute.js
import React from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useAppSelector } from 'src/redux/hook';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, user } = useAppSelector((state) => state.auth);

  // Đang khởi tạo thì hiển thị loading
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Chưa đăng nhập thì redirect về login
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    router.push(`/auth/login?returnTo=${encodeURIComponent(currentPath)}`);
    return null;
  }

  // Kiểm tra role nếu cần
  if (requiredRole && user?.role !== requiredRole) {
    router.push('/auth/login'); // Hoặc trang bạn muốn
    return null;
  }

  return children;
};

export default ProtectedRoute;
