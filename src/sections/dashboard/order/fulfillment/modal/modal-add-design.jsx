import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Modal,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import { Scrollbar } from 'src/components/scrollbar';
import { useAppDispatch } from 'src/redux/hook';
import { fetchGetDesignSku } from 'src/redux/reducers/orders';
import { RepositoryRemote } from 'src/services';

export const ModalAddDesign = (props) => {
  const { isOpen, handleClose, design } = props;
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      designs: design,
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'designs',
  });
  console.log("field", fields)

  const onSubmit = async (data) => {
    const newData = data.designs;
    console.log("data design",newData)
    const convertData = newData.map((product) => {
      return {
        sku_id: product.sku_id,
        product_name: product.product_name,
        variation: product.variation,
        ...(product.image_back && { image_back: product.image_back }),
        ...(product.image_front && { image_front: product.image_front }),
        ...(product.mockup_back && { mockup_back: product.mockup_back }),
        ...(product.mockup_front && { mockup_front: product.mockup_front }),
        
      };
    });
    console.log("convert data des", convertData)

    try {
      const res = await RepositoryRemote.orders.requestPostDesignSku(convertData);
      if (res.data) {
        toast.success('Thêm thiết kế thành công');
        dispatch(fetchGetDesignSku());
        handleClose();
      } else {
        toast.error('Thêm thiết kết thất bại vui lòng thử lại!.');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
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
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
            p: 3,
            display: 'block',
            maxWidth: 2000,
            width: 1200,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">{`Thêm ${design.length} design mới`}</h1>
          <DialogContent className="!p-0">
            <Card>
              <Box sx={{ position: 'relative' }} className={'min-h-40'}>
                {false && (
                  <Box
                    className={
                      'flex justify-center items-center w-full absolute top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(117,134,149,0.5)]'
                    }
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <LoadingCustom />
                  </Box>
                )}
                <Scrollbar className="max-h-[70dvh]">
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableCell>STT</TableCell>
                      <TableCell>Sku ID</TableCell>
                      <TableCell>Product name</TableCell>
                      <TableCell>Variation</TableCell>
                      <TableCell>Design front image</TableCell>
                      <TableCell>Design back image</TableCell>
                      <TableCell>Mockup front image</TableCell>
                      <TableCell>Mockup back image</TableCell>
                    </TableHead>
                    <TableBody>
                      {fields.length ? (
                        <>
                          {fields.map((field, index) => (
                            <TableRow hover key={index}>
                              <TableCell>
                                <Typography variant="body2">{index + 1}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{field.sku_id}</Typography>
                              </TableCell>
                              <TableCell className="max-w-60">
                                <TextField value={field.product_name} disabled fullWidth margin="normal" />
                                {/* <Tooltip title={field.product_name} placement="top">
                                  <Typography variant="body2" className="line-clamp-1">
                                    {field.product_name}
                                  </Typography>
                                </Tooltip> */}
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{field.variation}</Typography>
                              </TableCell>
                              <TableCell>
                                <Controller
                                  name={`designs[${index}].image_front`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <TextField {...field} label="Design front image" fullWidth margin="normal" />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Controller
                                  name={`designs[${index}].image_back`}
                                  control={control}
                                  defaultValue=""
                                  render={({ field }) => (
                                    <TextField {...field} label="Design back image" fullWidth margin="normal" />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                              <Controller
                                name={`designs[${index}].mockup_front`}
                                control={control}
                                defaultValue={field.sku_image || ""} // Gán giá trị sku_image vào mockup_front nếu có
                                render={({ field }) => (
                                  <TextField {...field} label="Mockup front image" fullWidth margin="normal" />
                                )}
                              />
                            </TableCell>
                              <TableCell>
                                <Controller
                                name = {`designs[${index}].mockup_back`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <TextField {...field} label="Mockup back image" fullWidth margin="normal" />
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
                <Stack spacing={1} className="mt-6 p-6" justifyContent={'flex-end'} alignItems={'flex-end'}>
                  <Button type="submit" variant="contained">
                    Cập Nhật
                  </Button>
                </Stack>
              </Box>
            </Card>
          </DialogContent>
        </Box>
      </Box>
    </Dialog>
  );
};
