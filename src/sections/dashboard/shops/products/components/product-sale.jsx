import {
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchWarehouseByShop } from 'src/redux/reducers/warehouse';

export const ProductSale = (props) => {
  const { control, errors, setValue, shopId } = props;
  const dispatch = useAppDispatch();
  const { warehouses } = useAppSelector((state) => state.warehouses);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchWarehouseByShop(shopId));
    }
  }, [shopId]);

  const warehousesOption = useMemo(() => {
    if (warehouses?.data?.data?.warehouse_list) {
      return warehouses?.data?.data?.warehouse_list
        ?.filter((item) => item.warehouse_type === 1)
        ?.map((item) => ({
          value: item.warehouse_id,
          label: item.warehouse_name,
        }));
    }

    return [];
  }, [shopId, warehouses]);

  return (
    <Card className="p-6 my-6">
      <Typography variant="h6" className="pb-3">
        Thông tin bán hàng
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => <TextField {...field} label="Giá" fullWidth margin="normal" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="available_stock"
            control={control}
            render={({ field }) => <TextField {...field} label="Số lượng" fullWidth margin="normal" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="seller_sku"
            control={control}
            render={({ field }) => <TextField {...field} label="SKU" fullWidth margin="normal" />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Controller
            name="warehouse_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel variant="filled">Chọn kho</InputLabel>
                <Select {...field} label="Category" variant="filled">
                  {warehousesOption.map((warehouse) => {
                    return (
                      <MenuItem value={warehouse?.value} key={warehouse?.value}>
                        {warehouse?.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
