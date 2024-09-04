import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import { OrderCheckBoughtLabel } from 'src/sections/dashboard/check-bought-label';
import { pagePermissions } from '../../layouts/dashboard/config';
import { RoleGuard } from '../../guards/role-guard';
import { Seo } from '../../components/seo';

const Page = () => {
  const settings = useSettings();

  usePageView();

  return (
    <>
      <Seo title="Check Label" />
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
                <Typography variant="h4">Kiểm tra Label đã mua theo Package ID</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <OrderCheckBoughtLabel />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <RoleGuard permissions={pagePermissions.check_label}>{page}</RoleGuard>
  </DashboardLayout>
);

export default Page;
