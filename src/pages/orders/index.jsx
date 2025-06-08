import Box from '@mui/material/Box';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Container, Grid, Stack, Typography } from '@mui/material';
import { PageOrders } from 'src/sections/dashboard/order';
import { useSettings } from 'src/hooks/use-settings';
import { pagePermissions } from '../../layouts/dashboard/config';
import { RoleGuard } from '../../guards/role-guard';
import { Seo } from '../../components/seo';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';


const Page = () => {
  const settings = useSettings();
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t(tokens.nav.orders)} />
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
                <Typography variant="h4">{t(tokens.nav.orders)}</Typography>
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
