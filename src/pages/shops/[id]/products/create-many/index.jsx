import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useSettings } from 'src/hooks/use-settings';
import { usePageView } from 'src/hooks/use-page-view';
import dynamic from 'next/dynamic';
import { Seo } from '../../../../../components/seo';

const PageCreateManyProduct = dynamic(() => import('src/sections/dashboard/shops/products/create-many'), {
  ssr: false,
});

const Page = () => {
  const settings = useSettings();

  usePageView();

  return (
    <>
      <Seo title="Create Many Product" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
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
                <Typography variant="h4">Thêm mới nhiều sản phẩm</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PageCreateManyProduct />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
