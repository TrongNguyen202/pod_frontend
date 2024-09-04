import Box from '@mui/material/Box';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { Container } from '@mui/material';
import { useSettings } from 'src/hooks/use-settings';
import { FulfillmentCompleted } from 'src/sections/dashboard/order/fulfillment/completed';
import { Seo } from '../../../../../components/seo';

const Page = () => {
  const settings = useSettings();

  return (
    <>
      <Seo title="Fulfillment Complete" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <FulfillmentCompleted />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
