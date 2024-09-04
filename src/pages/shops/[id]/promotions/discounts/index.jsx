import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useSettings } from 'src/hooks/use-settings';
import { useTheme } from '@mui/material/styles';
import { usePageView } from 'src/hooks/use-page-view';
import PromotionForm from 'src/sections/dashboard/shops/detail/product/promotions/promotion-form';
import { Seo } from '../../../../../components/seo';

const Page = () => {
  const settings = useSettings();
  const theme = useTheme();

  usePageView();

  return (
    <>
      <Seo title="Discounts" />
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
                <Typography variant="h4">Discounts</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <PromotionForm />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
