import { Autocomplete, Box, Button, Card, Checkbox, Stack, TextField, Typography } from '@mui/material';
import { ShopProductsTable } from './table';
import { useEffect, useMemo, useState } from 'react';
import { usePageView } from 'src/hooks/use-page-view';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchGetProductsBuyShop } from 'src/redux/reducers/products';
import { Controller, useForm } from 'react-hook-form';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { statusProductTikTokShop } from 'src/constants';
import { useSelection } from 'src/hooks/use-selection';
import toast from 'react-hot-toast';
import { RepositoryRemote } from 'src/services';
import { useRouter } from 'next/router';

export const PageShopProducts = () => {
  usePageView();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: [
        {
          title: 'All',
          value: 0,
        },
      ],
    },
  });
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [totalItems, setTotalItems] = useState(0);
  const [dataTable, setDataTable] = useState([]);
  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 100,
    searchProductId: '',
    searchProductName: '',
    sortCreate: 'desc',
    sortUpdate: 'desc',
    status: [],
  });
  const router = useRouter();

  const productIds = useMemo(() => {
    if (dataTable?.length) {
      return dataTable?.map((product) => product?.id);
    }
    return [];
  }, [products.data]);

  const productsSelection = useSelection(productIds);

  useEffect(() => {
    handleDataTable();
  }, [products, state]);

  const statusProduct = statusProductTikTokShop.map((status) => {
    return {
      title: status.title,
      value: status.index,
    };
  });

  const handleDataTable = () => {
    if (products?.data?.products) {
      let data = products.data.products;
      if (state.searchProductId) {
        data = data.filter((item) => item.id.toLowerCase().includes(state.searchProductId.toLowerCase()));
      } else {
        data = data;
      }
      if (state.searchProductName) {
        data = data.filter((item) => item.name.toLowerCase().includes(state.searchProductName.toLowerCase()));
      } else {
        data = data;
      }
      if (state.status.length) {
        if (state.status.includes(0)) {
          data = data;
        } else {
          data = data.filter((item) => state.status.find((status) => item.status === status));
        }
      } else {
        data = data;
      }

      if (state.sortCreate === 'desc') {
        data = [...data].sort((a, b) => a.create_time - b.create_time);
      } else {
        data = [...data].sort((a, b) => b.create_time - a.create_time);
      }

      if (state.sortUpdate === 'desc') {
        data = [...data].sort((a, b) => a.update_time - b.update_time);
      } else {
        data = [...data].sort((a, b) => b.update_time - a.update_time);
      }

      setDataTable(data);
    } else {
      setTotalItems(0);
      setDataTable([]);
    }
  };

  const onRowsPerPageChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  };

  const onPageChange = (_, newPage) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    dispatch(fetchGetProductsBuyShop({ shopId, page: newPage + 1 }));
  };

  useEffect(() => {
    if (shopId) {
      dispatch(fetchGetProductsBuyShop({ shopId, page: 1 }));
    }
  }, [shopId]);

  const onSubmitFilter = (value) => {
    setState((prevState) => ({
      ...prevState,
      status: value.status.map((item) => item.value),
      searchProductId: value.product_id,
      searchProductName: value.product_name,
    }));
  };

  const resetFilter = () => {
    reset({
      status: [
        {
          title: 'All',
          value: 0,
        },
      ],
    });
    setState((prevState) => ({
      ...prevState,
      searchProductId: '',
      searchProductName: '',
      status: [0],
    }));
  };

  const onSortCreate = () => {
    if (state.sortCreate === 'desc') {
      setState((prevState) => ({
        ...prevState,
        sortCreate: 'asc',
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        sortCreate: 'desc',
      }));
    }
  };

  const onSortUpdate = () => {
    if (state.sortUpdate === 'desc') {
      setState((prevState) => ({
        ...prevState,
        sortUpdate: 'asc',
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        sortUpdate: 'desc',
      }));
    }
  };

  const deleteProduct = async () => {
    if (shopId) {
      const idToast = toast.loading('Đang xử lý . Vui lòng chờ!');
      try {
        const dataSubmit = {
          product_ids: productsSelection.selected,
        };
        const response = await RepositoryRemote.products.requestRemoveProduct(shopId, dataSubmit);
        if (response.data) {
          toast.success('Xóa sản phầm thành công.', { id: idToast });
        }
      } catch (error) {
        toast.error('Xóa sản phẩm lỗi. Vui lòng thử lại.');
      }
    } else {
      toast.error('Không tìm thấy shopId');
    }
  };

  const handleCreateProduct = () => {
    router.push(`/shops/${shopId}/products/create`);
  };

  const handleCreateManyProduct = () => {
    router.push(`/shops/${shopId}/products/create-many`);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Card className="p-4">
        {/* <Typography variant="h4" className="flex gap-2">
          Danh sách sản phẩm
          <Typography variant="h4">{`(${products?.data?.total || 0})`}</Typography>
        </Typography> */}
        <Stack alignItems="center" direction="row" flexWrap="wrap" spacing={2} className="my-6">
          <Button size="small" variant="contained" onClick={handleCreateProduct}>
            Thêm sản phẩm
          </Button>
          <Button size="small" variant="contained" onClick={handleCreateManyProduct}>
            Thêm hàng loạt
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={!productsSelection.selected.length}
            onClick={deleteProduct}
          >
            Xoá sản phẩm {`${productsSelection.selected.length ? `(${productsSelection.selected.length})` : ''}`}
          </Button>
        </Stack>
        <Card
          className="px-4 flex items-center gap-4"
          component="form"
          onSubmit={handleSubmit(onSubmitFilter)}
          noValidate
        >
          <Box>
            <Controller
              name="product_id"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mã sản phẩm"
                  variant="filled"
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ''}
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="product_name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên sản phẩm"
                  variant="filled"
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ''}
                  fullWidth
                  margin="normal"
                />
              )}
            />
          </Box>
          <Box>
            <Controller
              name="status"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  multiple
                  limitTags={2}
                  id="status"
                  options={statusProduct}
                  disableCloseOnSelect
                  // size="small"
                  className="w-96"
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box key={key} {...optionProps} className="w-[200px] text-sm flex items-center">
                        <Checkbox
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          style={{ marginRight: 6 }}
                          checked={selected}
                        />
                        {option.title}
                      </Box>
                    );
                  }}
                  renderInput={(params) => <TextField {...params} placeholder="Trạng thái" />}
                  onChange={(event, value) => field.onChange(value)}
                />
              )}
            />
          </Box>
          <Box className={'flex gap-3 justify-end flex-row'}>
            <Button type="submit" size="small" variant="contained">
              Lọc
            </Button>
            <Button onClick={resetFilter} size="small" variant="outlined" className="">
              Reset
            </Button>
          </Box>
        </Card>
        <ShopProductsTable
          count={products?.data?.total || 0}
          items={dataTable || []}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={state.currentPage}
          rowsPerPage={state.rowsPerPage}
          stateFilter={state}
          onSortCreate={onSortCreate}
          onSortUpdate={onSortUpdate}
          onDeselectAll={productsSelection.handleDeselectAll}
          onDeselectOne={productsSelection.handleDeselectOne}
          onSelectAll={productsSelection.handleSelectAll}
          onSelectOne={productsSelection.handleSelectOne}
          selected={productsSelection.selected}
        />
      </Card>
    </Box>
  );
};
