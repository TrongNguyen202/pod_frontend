import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { PageCreateLabel } from '../../../../sections/dashboard/order/create-label';
import { Seo } from '../../../../components/seo';

const Page = () => {
  const settings = useSettings();
  usePageView();

  return (
    <>
      <Seo title="Create Label" />
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
                <Typography variant="h4">Tạo label</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PageCreateLabel />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
