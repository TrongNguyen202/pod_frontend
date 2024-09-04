import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import { RepositoryRemote } from 'src/services';

export const ModalAddShop = (props) => {
  const { isOpen, handleClose } = props;
  const dispatch = useAppDispatch();
  const { shopByUser } = useAppSelector((state) => state.users);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    const toastId = toast.loading('Đang tạo cửa hàng.');
    try {
      await RepositoryRemote.stores.requestCreateStore(data);
      dispatch(fetchGetListShops());
      toast.success('Tạo cửa hàng thành công', { id: toastId });
      handleClose();
    } catch (error) {
      toast.error('Tạo cửa hàng thất bại', { id: toastId });
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
            maxWidth: 600,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">Thông tin cửa hàng</h1>

          <Link
            color="text.primary"
            noWrap
            sx={{ cursor: 'pointer' }}
            // underline="none"
            // variant="subtitle2"
            className="text-[#1772c9] hover:underline text-sm"
            href={process.env.NEXT_PUBLIC_LINK_STORE_CODE}
          >
            Click this link to onother page
          </Link>
          <Controller
            name="auth_code"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Auth Code"
                fullWidth
                margin="normal"
                error={!!errors.authCode}
                helperText={errors.authCode ? errors.authCode.message : ''}
              />
            )}
          />
          <Controller
            name="shop_name"
            control={control}
            defaultValue=""
            rules={{ required: 'Vui lòng nhập Shop name' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Shop Name"
                fullWidth
                margin="normal"
                error={!!errors.shopName}
                helperText={errors.shopName ? errors.shopName.message : ''}
              />
            )}
          />
          <Controller
            name="shop_code"
            control={control}
            defaultValue=""
            rules={{
              required: 'Vui lòng nhập Shop code',
              // pattern: {
              //   value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              //   message: "Invalid email address",
              // },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Shop code"
                fullWidth
                margin="normal"
                error={!!errors.shopCode}
                helperText={errors.shopCode ? errors.shopCode.message : ''}
              />
            )}
          />
          <Controller
            name="user_id"
            control={control}
            defaultValue=""
            rules={{
              required: 'Seller s is required',
            }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" error={!!errors.seller}>
                <InputLabel variant="filled">Seller sở hữu</InputLabel>
                <Select {...field} label="Category" variant="filled">
                  {shopByUser?.users?.map((user) => {
                    return (
                      <MenuItem value={user?.user_id} key={user?.user_id}>
                        {user?.user_name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{errors.seller ? errors.seller.message : ''}</FormHelperText>
              </FormControl>
            )}
          />
          <Stack spacing={1} className="mt-6">
            <Button type="submit" variant="contained">
              Thêm cửa hàng
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};
