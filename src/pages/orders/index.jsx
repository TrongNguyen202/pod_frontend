import Box from '@mui/material/Box';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { PageOrders } from 'src/sections/dashboard/order';
import { useSettings } from 'src/hooks/use-settings';
import { pagePermissions } from '../../layouts/dashboard/config';
import { RoleGuard } from '../../guards/role-guard';
import { Seo } from '../../components/seo';

const Page = () => {
  const settings = useSettings();

  return (
    <>
      <Seo title="Orders" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="start" spacing={4}>
                <Typography variant="h4">Danh sách đơn hàng</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PageOrders />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <RoleGuard permissions={pagePermissions.orders}>{page}</RoleGuard>
  </DashboardLayout>
);

export default Page;
