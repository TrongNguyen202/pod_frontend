import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Box, Button, Card, Checkbox, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { Controller, Form, useForm } from 'react-hook-form';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { fullUserRole, statusOrderNew } from 'src/constants';
import { LoadingCustom } from 'src/components/loading';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { useEffect, useMemo } from 'react';
import { fetchGetShopByUser } from 'src/redux/reducers/user';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import { START_OF_DAY, START_OF_TOMORROW } from 'src/utils';
import dayjs from 'dayjs';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import { ChartOrder } from '../charts/chart-order';
import { fetchGetStatisticsOrder } from '../../../redux/reducers/statistics';
import { TopSellingProduct } from '../top-selling-product';

export const OrderStatistics = () => {
  const defaultValues = {
    createdTime: [dayjs(START_OF_DAY * 1000), dayjs(START_OF_TOMORROW * 1000)],
    shop: [],
    status: statusOrderNew.filter((status) => status.value !== 'CANCELLED'),
    user: [],
  };
  const { account } = useAppSelector((state) => state.auth);
  const { shops } = useAppSelector((state) => state.shops);
  const { shopByUser } = useAppSelector((state) => state.users);
  const { order } = useAppSelector((state) => state.statistics);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues,
  });
  const formValueUser = watch('user');

  useEffect(() => {
    dispatch(fetchGetShopByUser());
    dispatch(fetchGetListShops());
  }, []);

  const handleQuery = (state) => {
    let query = ``;

    if (state?.sort?.createdTime) {
      query += `&sort.create_time=${state?.sort?.createdTime}`;
    }

    if (state?.filter?.createdTime?.startTime) {
      query += `&filter.create_time=$gte:${state.filter?.createdTime?.startTime || START_OF_DAY}`;
    }

    if (state?.filter?.createdTime?.endTime) {
      query += `&filter.create_time=$lt:${state.filter?.createdTime?.endTime}`;
    }

    if (state?.filter?.status?.length) {
      query += `&filter.order_status=$in:${state?.filter?.status}`;
    }

    if (state?.filter?.shop?.length) {
      query += `&filter.shop_id=$in:${state.filter.shop}`;
    }
    if (state?.filter?.user?.length) {
      query += `&filter.user_id=$in:${state.filter.user}`;
    }

    return query.replace('?&', '?');
  };

  const optionShop = useMemo(() => {
    if (!formValueUser?.length) {
      return shops.map((shop) => ({
        value: shop.id,
        title: shop.shop_name,
      }));
    }
    if (shopByUser?.users?.length && formValueUser?.length) {
      return formValueUser?.reduce((acc, cur) => {
        const userShops = shopByUser?.users?.find((user) => user?.user_id === cur?.value)?.shops || [];
        userShops.forEach((shop) => {
          if (!acc.some((item) => item.value === shop.id)) {
            acc.push({ value: shop.id, title: shop.name });
          }
        });
        return acc;
      }, []);
    }
    return [];
  }, [shops, shopByUser, formValueUser]);

  useEffect(() => {
    if (!formValueUser?.length) {
      setValue('shop', []);
      return;
    }
    if (optionShop?.length) {
      setValue('shop', optionShop);
    }
  }, [optionShop, formValueUser]);

  const optionUser = useMemo(() => {
    if (shopByUser?.users) {
      if (fullUserRole.some((role) => account?.role?.includes(role))) {
        return shopByUser?.users.map((user) => ({
          value: user.user_id,
          title: user.user_name,
        }));
      }
      return shopByUser?.users
        .filter((item) => Number(item.user_id) === Number(account.id))
        .map((user) => ({
          value: user.user_id,
          title: user.user_name,
        }));
    }
    return [];
  }, [shopByUser]);

  useEffect(() => {
    if (optionUser?.length) {
      setValue('user', optionUser);
    }
  }, [optionUser]);

  useEffect(() => {
    if (optionUser?.length) {
      setValue('user', optionUser);
    }
  }, [optionUser]);

  const onReset = () => {
    reset(defaultValues);
    setValue('shop', optionShop);
    setValue('user', optionUser);
  };

  const onFormSubmit = () => {
    const values = getValues();
    console.log('Submitted form values:', values); // Debugging line
    const formState = {
      filter: {
        status: values.status.map((item) => item.value),
        createdTime: {
          startTime: dayjs(values.createdTime[0]).unix(),
          endTime: dayjs(values.createdTime[1]).unix(),
        },
        shop: values.shop.map((item) => item.value),
        user: values.user.map((item) => item.value),
      },
    };
    dispatch(fetchGetStatisticsOrder(handleQuery(formState)));
  };
  

  return (
    <Form onSubmit={onFormSubmit} control={control}>
      <Stack direction="column" spacing={{ xs: 2 }}>
        <Card>
          <CardContent className="!p-4">
            <Grid container xs={12} spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h7">{`Khoảng thời gian (UTC +0)`}</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
  name="createdTime"
  control={control}
  render={({ field }) => (
    <DateTimeRangePicker
      {...field}
      localeText={{
        start: 'Bắt đầu',
        end: 'Kết thúc',
      }}
      onChange={(newValue) => {
        field.onChange(newValue); // Đảm bảo điều này hoạt động đúng
        console.log('createdTime đã cập nhật:', newValue); // Dòng kiểm tra để debug
      }}
    />
  )}
/>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h7">Trạng thái</Typography>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      limitTags={3}
                      id="status"
                      options={statusOrderNew}
                      disableCloseOnSelect
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      getOptionLabel={(option) => option.title}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return <Chip color={option.color} label={option.title} key={key} {...tagProps} />;
                        })
                      }
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
                            {option.title}
                          </Box>
                        );
                      }}
                      renderInput={(params) => <TextField {...params} label="options..." className="p-1" />}
                      onChange={(event, value) => field.onChange(value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h7">Người dùng</Typography>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      limitTags={2}
                      id="user"
                      options={optionUser}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
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
                            {option.value} | {option.title}
                          </Box>
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip color="default" label={`${option.value} | ${option.title}`} key={key} {...tagProps} />
                          );
                        })
                      }
                      renderInput={(params) => <TextField {...params} label="options..." />}
                      onChange={(event, value) => field.onChange(value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h7">Cửa hàng</Typography>
                <Controller
                  name="shop"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      limitTags={2}
                      id="shop"
                      options={optionShop}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
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
                            {option.value} | {option.title}
                          </Box>
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => {
                          const { key, ...tagProps } = getTagProps({ index });
                          return (
                            <Chip color="default" label={`${option.value} | ${option.title}`} key={key} {...tagProps} />
                          );
                        })
                      }
                      renderInput={(params) => <TextField {...params} label="options..." />}
                      onChange={(event, value) => field.onChange(value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack direction="row-reverse" spacing={{ xs: 1 }}>
                  <Button size="small" variant="outlined" onClick={onReset}>
                    Mặc định
                  </Button>
                  <Button
                    type="submit"
                    startIcon={
                      <SvgIcon>
                        <RefreshCcw01Icon />
                      </SvgIcon>
                    }
                    variant="contained"
                    size="small"
                    className="text-nowrap h-9"
                    onSubmit={handleSubmit}
                  >
                    Làm mới
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <>
          {order.loading ? (
            <Stack justifyContent="center" alignItems="center">
              <LoadingCustom />
            </Stack>
          ) : (
            <>
              <ChartOrder optionShop={optionShop} />
              <TopSellingProduct />
            </>
          )}
        </>
      </Stack>
    </Form>
  );
};
