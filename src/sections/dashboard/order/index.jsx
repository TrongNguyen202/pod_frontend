import { Button, Card, Checkbox, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { usePageView } from 'src/hooks/use-page-view';
import { resetDataListOrder } from 'src/redux/reducers/orders';
import dayjs from 'dayjs';
import { useSelection } from 'src/hooks/use-selection';
import { fetchGetShopByUser } from 'src/redux/reducers/user';
import { fetchGetListShops } from 'src/redux/reducers/shops';
import { Controller, Form, useForm } from 'react-hook-form';
import { RepositoryRemote } from 'src/services';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateTimeRangePicker } from '@mui/x-date-pickers-pro';
import Autocomplete from '@mui/material/Autocomplete';
import { fullUserRole, statusOrderNew } from '../../../constants';
import Chip from '@mui/material/Chip';
import { Box } from '@mui/system';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TextField from '@mui/material/TextField';
import SvgIcon from '@mui/material/SvgIcon';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import { OrderTable } from './table';
import { ModalOrderCombine } from './modal/modal-order-combine';
import { START_OF_DAY, START_OF_TOMORROW } from '../../../utils';
import { useSearchParams } from 'next/navigation';

export const PageOrders = (props) => {
  const { isInShop } = props;
  usePageView();
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.auth);
  const { orders, packagesBought } = useAppSelector((state) => state.orders);
  const { shops } = useAppSelector((state) => state.shops);
  const { shopByUser } = useAppSelector((state) => state.users);
  const router = useRouter();
  const [orderDataTable, setOrderDataTable] = useState(orders.data?.data || []);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [combineList, setCombineList] = useState([]);
  const [openModalCombine, setOpenModalCombine] = useState(false);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [isActiveFunction, setIsActiveFunction] = useState(false);

  const defaultValues = {
    createdTime: [dayjs(START_OF_DAY * 1000), dayjs(START_OF_TOMORROW * 1000)],
    user: [],
    shop: [],
    status: statusOrderNew.filter((status) => status.value !== 'CANCELLED'),
    paging: {
      currentPage: 0,
      rowsPerPage: 1000,
    },
    sort: {
      createdTime: 'desc',
    },
  };

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues,
  });

  const values = watch();

  const orderIds = useMemo(() => {
    if (orders.data?.data?.length) {
      return orders.data?.data?.map((customer) => customer?.packages[0]?.id);
    }
    return [];
  }, [orders.data]);

  useEffect(() => {
    if (orders?.data?.error) {
      const errorMessage = orders?.data?.error.join('\n');
      toast.error(errorMessage);
    }
  }, [orders?.data]);

  const ordersSelection = useSelection(orderIds);

  const optionShop = useMemo(() => {
    if (!values?.user?.length) {
      return shops.map((shop) => ({
        value: shop.id,
        title: shop.shop_name,
      }));
    }
    if (shopByUser?.users?.length && values?.user?.length) {
      return values?.user?.reduce((acc, cur) => {
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
  }, [shops, shopByUser, values?.user]);

  useEffect(() => {
    if (!values?.user?.length) {
      setValue('shop', []);
      return;
    }
    if (optionShop?.length) {
      setValue('shop', optionShop);
    }
  }, [optionShop, values?.user]);

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
  }, [shops, optionUser]);

  useEffect(() => {
    // dispatch(fetchGetPackageBought());
    dispatch(fetchGetShopByUser());
    dispatch(fetchGetListShops());

    return () => {
      dispatch(resetDataListOrder());
    };
  }, []);

  useEffect(() => {
    setOrderDataTable(orders.data?.data || []);
  }, [orders.data?.data]);

  const onRowsPerPageChange = (event) => {
    setValue('paging.rowsPerPage', parseInt(event.target.value, defaultValues.paging.rowsPerPage));
    onFormSubmit();
  };

  const onPageChange = (_, newPage) => {
    setValue('paging.currentPage', newPage);
    onFormSubmit();
  };

  const onChangeSortCreateTime = () => {
    const value = getValues('sort.createdTime');
    setValue('sort.createdTime', value === 'asc' ? 'desc' : 'asc');
    onFormSubmit();
  };

  const onReset = () => {
    reset(defaultValues);
    setValue('shop', optionShop);
    setValue('user', optionUser);
  };

  const handleSetDataTable = (data) => {
    setOrderDataTable(data);
  };

  const handleShippingService = async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.requestShippingService(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  };

  const handleCreateLabels = async () => {
    const idToast = toast.loading('Đang xử lý label. Vui lòng chờ!');
    try {
      setLoadingTable(true);
      const values = getValues();
      const res = await RepositoryRemote.orders.requestCreateLabel(
        !isInShop ? values?.shop[0].value : shopId,
        ordersSelection?.selected,
      );

      if (res.data?.data) {
        const resConvert = res.data?.data.map((resItem) => ({
          data: {
            ...resItem.data,
            shipping_provider: 'USPS Ground Advantage™',
            shipping_provider_id: '7208502187360519982',
          },
        }));

        const dataUpdate = [...resConvert];

        const promises = dataUpdate.map((item, index) => {
          return new Promise((resolve, reject) => {
            const packageId = {
              package_id: item.data.package_id,
            };

            const onSuccessShipping = (resShipping) => {
              if (resShipping && resShipping.data) {
                const shippingData = resShipping.data[0];
                const dataCreateLabel = {
                  ...item,
                  data: {
                    ...item.data,
                    shipping_provider: shippingData.name,
                    shipping_provider_id: shippingData.id,
                    order_info_list: item.data.order_info_list.map((orderItem) => {
                      return orderDataTable.find((order) => order.id === orderItem.order_id);
                    }),
                  },
                };
                dataUpdate[index] = dataCreateLabel;
                resolve();
              } else {
                reject(new Error('Shipping data is empty'));
              }
            };

            handleShippingService(!isInShop ? values?.shop[0].value : shopId, packageId, onSuccessShipping, (err) => {
              reject(err);
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            toast.success('Xử lý hoàn tất.', { id: idToast });
            sessionStorage.setItem(
              `create_label_${!isInShop ? values?.shop[0].value : shopId}`,
              JSON.stringify(dataUpdate),
            );
            router.push(`/shops/${!isInShop ? values?.shop[0].value : shopId}/create-label`);
          })
          .catch((error) => {
            console.error(error);
            toast.error('Không lấy được thông tin vận chuyển. Đang sử dụng đơn vị vận chuyển mặc định', {
              id: idToast,
            });
            // navigate(`/shops/${shopId}/orders/create-label`, { state: { dataCombine: resConvert } });
          });
      }
    } catch (error) {
      console.error(error);
      toast.error('Tạo label lỗi', { id: idToast });
    } finally {
      setLoadingTable(false);
    }
  };

  const handleGetAllCombine = async () => {
    const idToast = toast.loading('Đang xử lý . Vui lòng chờ!');
    try {
      const values = getValues();
      const response = await RepositoryRemote.orders.requestGetAllCombine(!isInShop ? values?.shop[0].value : shopId);

      if (response?.data?.data?.data?.total !== 0) {
        setCombineList(response?.data?.data?.data);
        setOpenModalCombine(true);
        toast.success('Xử lý hoàn tất.', { id: idToast });
      } else {
        toast.error('Không tìm thấy order nào có thể gộp');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lấy order có thế gộp lỗi');
    }
  };

  const handleStartFulfillment = async () => {
    const idToast = toast.loading('Đang xử lý . Vui lòng chờ!');
    try {
      setLoadingTable(true);
      setLoadingButton(true);
      const ordersHasPackageId = orders?.data?.data?.filter((order) => order.line_items.length > 0);
      const orderBoughtLabel = packagesBought.data
        .map((item) => ordersHasPackageId.filter((order) => item.package_id === order.line_items[0].package_id))
        .filter((item) => item.length);

      const orderBoughtLabelUnique = packagesBought.data
        .map((item) => ordersHasPackageId.find((order) => item.package_id === order.line_items[0].package_id))
        .filter((item) => item !== undefined);

      const packageIds = {
        package_ids: orderBoughtLabelUnique.map((item) => item.line_items[0].package_id),
      };

      const values = getValues();
      const res = await RepositoryRemote.orders.requestGetShippingDoc(
        !isInShop ? values?.shop[0].value : shopId,
        packageIds,
      );

      if (res?.data?.data) {
        const shippingDocData = orderBoughtLabel.map((item, index) => ({
          order_list: item,
          label: res?.data?.data.doc_urls[index],
          package_id: item[0].packages[0].id,
        }));

        sessionStorage.setItem(
          `fulfillment_${!isInShop ? values?.shop[0].value : shopId}`,
          JSON.stringify(shippingDocData),
        );

        toast.success('Đang chuyển trang.', { id: idToast });
        router.push(`/shops/${!isInShop ? values?.shop[0].value : shopId}/fulfillment`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lấy shipping doc lỗi', { id: idToast });
    } finally {
      setLoadingTable(false);
      setLoadingButton(false);
    }
  };

  const handleQuery = (state) => {
    let query = ``;

    if (state?.limit) {
      query += `&limit=${state.limit}`;
    }

    if (state?.offset) {
      query += `&offset=${state.offset}`;
    }

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

  const onFormSubmit = (state) => {
    const values = getValues();
    if (values.shop.length === 1) {
      setIsActiveFunction(true);
    } else {
      setIsActiveFunction(false);
    }

    const formState = {
      limit: values.paging.rowsPerPage,
      offset: values.paging.currentPage || 0,
      filter: {
        status: values.status.map((item) => item.value),
        createdTime: {
          startTime: dayjs(values.createdTime[0]).unix(),
          endTime: dayjs(values.createdTime[1]).unix(),
        },
        shop: !isInShop ? values.shop.map((item) => item.value) : [shopId],
        user: values.user.map((item) => item.value),
      },
      sort: {
        createdTime: values.sort.createdTime === 'desc' ? -1 : 1,
      },
      ...state,
    };
    // dispatch(fetchGetAllOrders(handleQuery(formState)));
  };

  return (
    <Form onSubmit={onFormSubmit} control={control}>
      <Stack direction="column" spacing={{ xs: 2 }}>
        <Card>
          <CardHeader title="Chức năng" sx={{ pb: 0, pt: 2 }} />
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={2}
            className="my-6"
            sx={{
              px: 4,
            }}
          >
            <Button
              size="small"
              variant="contained"
              disabled={(!isInShop && !isActiveFunction) || loadingButton}
              onClick={handleGetAllCombine}
            >
              Lấy order có thể gộp
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={(!isInShop && !isActiveFunction) || loadingButton}
              onClick={handleStartFulfillment}
            >
              Fulfillment
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={
                !!!ordersSelection?.selected?.length ||
                loadingTable ||
                (!isInShop && !isActiveFunction) ||
                loadingButton
              }
              onClick={handleCreateLabels}
            >
              <span variant="subtitle2">{`Tạo label (${ordersSelection?.selected?.length || 0})`}</span>
            </Button>
          </Stack>
        </Card>
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
                          return field.onChange(newValue);
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
              {!isInShop && (
                <>
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
                                <Chip
                                  color="default"
                                  label={`${option.value} | ${option.title}`}
                                  key={key}
                                  {...tagProps}
                                />
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
                                <Chip
                                  color="default"
                                  label={`${option.value} | ${option.title}`}
                                  key={key}
                                  {...tagProps}
                                />
                              );
                            })
                          }
                          renderInput={(params) => <TextField {...params} label="options..." />}
                          onChange={(event, value) => field.onChange(value)}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

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
        <Card>
          <OrderTable
            items={orderDataTable}
            // items={orders.data?.data}
            page={orders?.data?.meta?.offset || 0}
            rowsPerPage={values.paging.rowsPerPage || 0}
            count={orders?.data?.meta?.total_items || 0}
            sort={values.sort}
            onDeselectAll={ordersSelection.handleDeselectAll}
            onDeselectOne={ordersSelection.handleDeselectOne}
            onSelectAll={ordersSelection.handleSelectAll}
            onSelectOne={ordersSelection.handleSelectOne}
            selected={ordersSelection.selected}
            onSortCreateTime={onChangeSortCreateTime}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            handleSetDataTable={handleSetDataTable}
            loadingTable={loadingTable}
          />
        </Card>
        {openModalCombine && (
          <ModalOrderCombine
            isOpen={openModalCombine}
            dataOrderDetail={orderDataTable}
            data={combineList}
            handleClose={() => setOpenModalCombine(false)}
          />
        )}
      </Stack>
    </Form>
  );
};
