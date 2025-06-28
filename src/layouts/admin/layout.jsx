import { NextAppProvider } from '@toolpad/core/nextjs';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'admin/dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'admin/transaction', title: 'Transactions', icon: <TimelineIcon /> },
  { segment: 'admin/user', title: 'Users', icon: <PeopleIcon /> },
  { segment: 'admin/settings', title: 'Settings', icon: <SettingsIcon /> },
];

export default function AdminLayout({ children }) {
  return (
    <NextAppProvider navigation={NAVIGATION}>
      <DashboardLayout>
        <PageContainer>{children}</PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
