import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useSettings } from 'src/hooks/use-settings';
import { useTheme } from '@mui/material/styles';
import { usePageView } from 'src/hooks/use-page-view';
import { PageShops } from '../../sections/dashboard/shops';
import { pagePermissions } from '../../layouts/dashboard/config';
import { RoleGuard } from '../../guards/role-guard';
import { Seo } from '../../components/seo';

const Page = () => {
  const settings = useSettings();
  const theme = useTheme();

  usePageView();

  return (
    <>
      <Seo title="Shops" />
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
                <Typography variant="h4">Danh sách cửa hàng</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PageShops />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    <RoleGuard permissions={pagePermissions.shops}>{page}</RoleGuard>
  </DashboardLayout>
);

export default Page;
