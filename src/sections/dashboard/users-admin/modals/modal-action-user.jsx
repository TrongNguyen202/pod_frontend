import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Autocomplete, Box, Button, Checkbox, Dialog, Grid, Stack, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { toast } from 'react-toastify';
import { RepositoryRemote } from 'src/services';
import { fetchGetShopByUser } from 'src/redux/reducers/user';

export const ModalActionUserAdmin = (props) => {
  const { isOpen, handleClose, dataEdit } = props;
  const [showPassword, setShowPassword] = useState(true);
  const dispatch = useAppDispatch();
  const { shops } = useAppSelector((state) => state.shops);

  const optionsShop = useMemo(() => {
    if (shops?.length) {
      return shops.map((shop) => {
        return {
          id: shop.id,
          name: shop.shop_name,
        };
      });
    }
    return [];
  }, [shops]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: dataEdit || { first_name: '', last_name: '', email: '', password: '', user_code: '', shops: [] },
  });

  const onSubmit = async (data) => {
    const idToast = toast.loading('Đang thực hiện cập nhật thông tin user. Vui lòng chờ.');
    try {
      const dataSubmit = {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.user_name,
        password: data.password,
        user_code: data.user_code,
        shops: data.shops.map((shop) => shop.id),
        user_id: dataEdit?.user_id || '',
      };

      if (dataEdit?.user_id) {
        await RepositoryRemote.users.requestUpdateUser(dataSubmit);
      } else {
        await RepositoryRemote.users.requestCreateUser(dataSubmit);
      }

      toast.success('Cập nhật thông tin user thành công.', { id: idToast });

      dispatch(fetchGetShopByUser());
    } catch (error) {
      toast.error(error?.response?.data.error || 'Cập nhật thông tin user không thành công. Thử lại sau.', {
        id: idToast,
      });
    }
  };

  useEffect(() => {
    dispatch(fetchGetListShops());
  }, []);

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
          <h1 className="text-xl mb-3 font-bold">Thông tin nhân viên</h1>
          <Grid
            container
            spacing={{
              xs: 1,
              lg: 1,
            }}
          >
            <Grid item xs={6}>
              <Controller
                name="first_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.first_name}
                    helperText={errors.first_name ? errors.first_name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="last_name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.last_name}
                    helperText={errors.last_name ? errors.last_name.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="user_name"
                control={control}
                rules={{ required: 'Vui lòng nhập User Name' }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User Name"
                    fullWidth
                    margin="normal"
                    error={!!errors.username}
                    helperText={errors.username ? errors.username.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Vui lòng nhập Password' }}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ''}
                    type={showPassword ? 'password' : 'text'}
                    InputProps={{
                      endAdornment: (
                        <Box className={'cursor-pointer'} onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </Box>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="user_code"
                control={control}
                defaultValue=""
                rules={{ required: 'Vui lòng nhập User code' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="User code"
                    fullWidth
                    margin="normal"
                    error={!!errors.user_code}
                    helperText={errors.user_code ? errors.user_code.message : ''}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="shops"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    limitTags={3}
                    id="status"
                    options={optionsShop}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box key={key} {...optionProps} className="w-[240px] text-sm flex items-center my-1">
                          <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </Box>
                      );
                    }}
                    renderInput={(params) => <TextField {...params} label="Shop" className="p-1" />}
                    onChange={(event, value) => field.onChange(value)}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Stack spacing={1} className="mt-6 !flex-row justify-end gap-2">
            <Button type="submit" variant="contained">
              {dataEdit?.user_id ? 'Cập nhật' : 'Thêm'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                reset();
                handleClose();
              }}
              className="!mt-0"
            >
              Huỷ
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};
