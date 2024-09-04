import { Box, Container } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { useSettings } from 'src/hooks/use-settings';
import { useTheme } from '@mui/material/styles';
import { usePageView } from 'src/hooks/use-page-view';
import { PageDetailShopProduct } from 'src/sections/dashboard/shops/detail/product/detail';
import { Seo } from '../../../../../components/seo';

const Page = () => {
  const settings = useSettings();
  const theme = useTheme();

  usePageView();

  return (
    <>
      <Seo title="Detail Product" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <PageDetailShopProduct />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
