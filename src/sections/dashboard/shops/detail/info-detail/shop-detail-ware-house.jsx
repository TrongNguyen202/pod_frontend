import { Box, Card, Chip, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchWarehouseByShop } from 'src/redux/reducers/warehouse';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Spin } from 'antd';

export const ShopDetailWareHouse = (props) => {
  const { shopId } = props;
  const dispatch = useAppDispatch();
  const { warehouses } = useAppSelector((state) => state.warehouses);
  const [dateWarehouse, setDataWarehouse] = useState([]);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchWarehouseByShop(shopId));
    }
  }, [shopId]);

  useEffect(() => {
    setDataWarehouse(
      warehouses?.data?.data?.warehouse_list
        ? [...warehouses?.data?.data?.warehouse_list]?.sort((a, b) => {
            if (a?.is_default && !b?.is_default) {
              return -1;
            } else if (!a?.is_default && b?.is_default) {
              return 1;
            }
            return 0;
          })
        : [],
    );
  }, [warehouses]);

  return (
    <Card>
      <CardHeader
        title={`Thông tin kho ${warehouses?.data?.data?.warehouse_list?.length || '0'}`}
        sx={{ pb: 0, pt: 2 }}
      />
      <Spin spinning={warehouses.loading}>
        <CardContent className="!p-6">
          <Grid container spacing={3}>
            {dateWarehouse.map((warehouse) => (
              <Grid item xs={6} key={warehouse.warehouse_id}>
                <Card className="p-5 !rounded-lg relative" style={{ overflow: 'unset' }}>
                  {warehouse.is_default && (
                    <Chip color="primary" label="Kho mặc định" size="small" className="absolute top-[-6px] right-6" />
                  )}
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Tên kho:</Typography>
                    <Typography>{warehouse?.warehouse_name || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Mã kho:</Typography>
                    <Typography>{warehouse?.warehouse_id || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Số điện thoại:</Typography>
                    <Typography>{warehouse?.warehouse_address?.phone || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Địa chỉ:</Typography>
                    <Typography>{warehouse?.warehouse_address?.full_address || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Quốc gia:</Typography>
                    <Typography>{warehouse?.warehouse_address?.region || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Tiểu bang/Tỉnh:</Typography>
                    <Typography>{warehouse.warehouse_address?.state || ''}</Typography>
                  </Box>
                  <Box className="flex gap-1 mb-2">
                    <Typography variant="h6">Mã zip/postal:</Typography>
                    <Typography>{warehouse.warehouse_address?.zipcode || ''}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Spin>
    </Card>
  );
};
