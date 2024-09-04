import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { usePageView } from 'src/hooks/use-page-view';
import { useEffect, useState } from 'react';
import { RepositoryRemote } from 'src/services';
import { formatDate } from 'src/utils/date';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { ShopDetailProduct } from './info-detail/shop-detail-product';
import { ShopDetailOrder } from './info-detail/shop-detail-order';
import { ShopDetailFulfillmentComplete } from './info-detail/shop-fulfilment-complete';
import { PromotionCard } from './info-detail/promotions';
import { ShopDetailWareHouse } from './info-detail/shop-detail-ware-house';
import { LoadingCustom } from 'src/components/loading';

export const PageDetailShops = () => {
  usePageView();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [detailShop, setDetailShop] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (shopId) {
      fetchData();
    }
  }, [shopId]);

  const fetchData = async () => {
    if (shopId) {
      try {
        setLoading(true);
        const res = await RepositoryRemote.stores.requestGetStoreById(shopId);
        setDetailShop(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Stack direction="column" spacing={{ xs: 2 }}>
      {!loading ? (
        <>
          <Card>
            <CardHeader title="Thông tin cơ bản" sx={{ pb: 0, pt: 2 }} />
            <CardContent className="!p-6">
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box className="flex gap-1">
                    <Typography variant="h6">Tên cửa hàng:</Typography>
                    <Typography>{detailShop?.shop_name || ''}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="flex gap-1">
                    <Typography variant="h6">Thời gian hết hạn:</Typography>
                    <Typography>{formatDate(new Date(), 'DD/MM/YY, h:mm:ss a')}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box className="flex gap-1">
                    <Typography variant="h6">Mã cửa hàng:</Typography>
                    <Typography>{detailShop?.shop_code || ''}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Thông tin chi tiết" sx={{ pb: 0, pt: 2 }} />
            <CardContent className="!p-6">
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <ShopDetailProduct shopId={shopId} />
                </Grid>
                <Grid item xs={3}>
                  <ShopDetailOrder shopId={shopId} />
                </Grid>
                <Grid item xs={3}>
                  <ShopDetailFulfillmentComplete shopId={shopId} />
                </Grid>
                <Grid item xs={3}>
                  <PromotionCard shopId={shopId} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <ShopDetailWareHouse shopId={shopId} />
        </>
      ) : (
        <Card className="min-h-20 flex items-center justify-center">
          <LoadingCustom />
        </Card>
      )}
    </Stack>
  );
};
