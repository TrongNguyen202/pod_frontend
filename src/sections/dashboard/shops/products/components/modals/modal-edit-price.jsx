import {
  Box,
  Button,
  Card,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { NoData } from 'src/components/nodata';
import { Scrollbar } from 'src/components/scrollbar';
import { useAppSelector } from 'src/redux/hook';

export const ModalEditPrice = (props) => {
  const { warehouses } = useAppSelector((state) => state.warehouses);
  const { isOpen, handleClose, products, shopId, handSetDataPriceProduct } = props;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      products: products,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = () => {
    const data = watch();
    handSetDataPriceProduct(data.products);
    handleClose();
  };

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
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="rounded-2xl overflow-hidden"
      >
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
            p: 3,
            display: 'block',
            minWidth: 1000,
          }}
          // component="form"
          // onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-xl mb-3 font-bold">{`Chỉnh sửa giá`}</h1>
          <Card>
            <Scrollbar sx={{ maxHeight: 600, opacity: 1 }}>
              <Table stickyHeader sx={{ minWidth: 700 }} aria-label="sticky table">
                <TableHead>
                  <TableCell>Màu sắc</TableCell>
                  <TableCell>Kích cỡ</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Kho</TableCell>
                </TableHead>
                <TableBody>
                  {fields.length ? (
                    <>
                      {fields.map((field, index) => (
                        <TableRow hover key={index}>
                          <TableCell>
                            <Typography variant="body2">{field?.color || ''}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{field?.size || ''}</Typography>
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`products[${index}].price`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField {...field} label="Giá" fullWidth margin="normal" type="number" />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`products[${index}].stock_infos.available_stock`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField {...field} label="Số lượng" fullWidth margin="normal" type="number" />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`products[${index}].seller_sku`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => <TextField {...field} label="SKU" fullWidth margin="normal" />}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`products[${index}].stock_infos.warehouse_id`}
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <FormControl fullWidth margin="normal">
                                  <InputLabel variant="filled">Hãy chọn một kho.</InputLabel>
                                  <Select {...field} label="" variant="filled">
                                    {warehousesOption?.map((user) => {
                                      return (
                                        <MenuItem value={user?.value} key={user?.value}>
                                          {user?.label}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    <TableCell colSpan={6}>
                      <NoData className={'min-h-36'} />
                    </TableCell>
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>
          <Stack spacing={1} className="mt-6" justifyContent={'flex-end'} alignItems={'flex-end'}>
            <Button onClick={onSubmit} size="small" variant="contained">
              Lưu
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
