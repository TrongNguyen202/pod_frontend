import { useState } from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Head from 'next/head';
import { Button } from 'antd';
import { Box } from '@mui/system';
import { RepositoryRemote } from 'src/services';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await RepositoryRemote.auth.requestLogout();
      localStorage.clear();
      toast.success('Đăng xuất thành công!');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Đăng xuất thất bại!');
    }
  };

  const NAVIGATION = [
    { kind: 'header', title: 'Admin' },
    { segment: 'admin/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'admin/transaction', title: 'Transactions', icon: <TimelineIcon /> },
    { segment: 'admin/user', title: 'Users', icon: <PeopleIcon /> },
  ];

  return (
    <NextAppProvider navigation={NAVIGATION}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          position: 'absolute',
          zIndex: 9999,
          top: '18px',
          right: '75px',
          alignItems: 'center',
        }}
      >
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
      <DashboardLayout>
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
