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

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await RepositoryRemote.auth.requestLogout();
      localStorage.clear();
      toast.success('Đăng xuất thành công!');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Đăng xuất thất bại!');
    }
  };

  const NAVIGATION = [
    { kind: 'header', title: 'Admin' },
    { segment: 'admin/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
    { segment: 'admin/transaction', title: 'Transactions', icon: <TimelineIcon /> },
    { segment: 'admin/user', title: 'Users', icon: <PeopleIcon /> },
    { segment: 'admin/settings', title: 'Settings', icon: <SettingsIcon /> },
    { kind: 'divider' },
    {
      kind: 'header',
      title: 'Account',
    },
    {
      segment: '',
      title: 'Logout',
      icon: <LogoutIcon />,
      action: handleLogout,
    },
  ];

  return (
    <NextAppProvider navigation={NAVIGATION}>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <DashboardLayout>
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
