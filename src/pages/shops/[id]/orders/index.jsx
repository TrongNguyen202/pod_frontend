import Box from '@mui/material/Box';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Container } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { PageOrdersInShop } from 'src/sections/dashboard/shops/order';
import { Seo } from '../../../../components/seo';

const Page = () => {
  const settings = useSettings();

  return (
    <>
      <Seo title="Shop Orders" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <PageOrdersInShop />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
