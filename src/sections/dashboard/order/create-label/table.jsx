import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  Popover,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { useEffect, useMemo, useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { OrderPackageWeightSize } from 'src/constants';
import { usePageView } from 'src/hooks/use-page-view';
import { useAppDispatch } from 'src/redux/hook';
import { fetchGetPackageBought } from 'src/redux/reducers/orders';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { ModalUpdateInfo } from './modal-update-info';
import { useSelection } from 'src/hooks/use-selection';
import { LoadingButton } from '@mui/lab';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import { useSearchParams } from 'next/navigation';
import { RepositoryRemote } from 'src/services';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Form, Image, Input, Modal, Table as TableAntd } from 'antd';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';

export const CreateLabelTable = (props) => {
  const { items = [] } = props;
  usePageView();
  const dispatch = useAppDispatch();
  const [dataSizeChart, setDataSizeChart] = useState(OrderPackageWeightSize);
  const [dataEdit, setDataEdit] = useState({});
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [startFulfillment, setStartFulfillment] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const [open, setOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      orders: tableData,
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'orders',
  });

  const labelIds = useMemo(() => {
    if (tableData?.length) {
      return tableData?.map((data) => data?.data?.package_id);
    }
    return [];
  }, [tableData]);

  const { selected, handleDeselectAll, handleDeselectOne, handleSelectAll, handleSelectOne } = useSelection(labelIds);

  const dataTableWeightSize = (dataInput) => {
    if (dataInput.length) {
      const labelItems = dataInput.map((label) => {
        const orderList = label.data.order_info_list?.map((order) => {
          const orderItemList = order?.item_list || order?.sku_list;
          const productList = orderItemList?.map((product) => {
            let variationSize = '';
            const variationSplit = product?.sku_name.split(',').map((item) => item.trim());
            if (variationSplit.length === 3) {
              variationSize = variationSplit[1] - variationSplit[2];
            } else {
              variationSize = variationSplit[1];
            }

            const variationSizeSplit = variationSize?.split(/[\s-,]/).filter(Boolean);
            let orderPackageList = dataSizeChart?.find((variant) =>
              variationSizeSplit?.find((item) => item.toUpperCase() === variant.name.toUpperCase()),
            );

            if (orderPackageList === undefined) {
              orderPackageList = dataSizeChart.find((orderPackage) => orderPackage.name === 'shirt');
            }

            let orderPackageSizeChart = orderPackageList?.items.find((orderPackage) =>
              variationSizeSplit?.find((item) => item.toUpperCase() === orderPackage.name.toUpperCase()),
            );

            if (orderPackageSizeChart === undefined) {
              orderPackageSizeChart = dataSizeChart.find((orderPackage) => orderPackage.name === 'shirt').items[0];
            }

            const orderPackageWeight = Number(orderPackageSizeChart.weight) * Number(product.quantity);
            const orderPackageSize = orderPackageSizeChart?.size;
            return { orderPackageWeight, orderPackageSize };
          });

          let sumWeight = productList
            ?.map((product) => product.orderPackageWeight)
            .reduce((partialSum, current) => partialSum + current, 0);
          sumWeight = parseFloat(sumWeight.toFixed(4));
          const sumSize =
            orderItemList.length > 1 ? '10x10x3'.split('x') : productList[0]?.orderPackageSize?.split('x');
          return { sumWeight, sumSize };
        });

        let packageWeight = orderList
          .map((item) => parseFloat(item.sumWeight))
          .reduce((partialSum, current) => partialSum + current, 0);
        packageWeight = parseFloat(packageWeight.toFixed(4));
        const sumPackageCombine = {
          package_weight: packageWeight,
          package_size: orderList.length > 1 ? '10x10x3'.split('x') : orderList[0]?.sumSize,
        };

        return {
          ...label,
          package_weight: sumPackageCombine.package_weight,
          package_size: sumPackageCombine.package_size,
        };
      });
      return labelItems;
    }
    return [];
  };

  useEffect(() => {
    dispatch(fetchGetPackageBought());
  }, []);

  useEffect(() => {
    const updatedTableData = dataTableWeightSize(items);
    setTableData(updatedTableData);
    setValue('orders', updatedTableData);
  }, [items, dataSizeChart]);

  const selectedSome = selected.length && selected.length < items.length;
  const selectedAll = items.length && selected.length === items.length;

  const handleSetDataTable = (data) => {
    setTableData(data);
  };

  const renderPopoverProduct = (data, sumItem) => {
    const { order_info_list } = data.data;
    const skuList = order_info_list.map((item) => (item.item_list ? item.item_list : item.line_items));

    return (
      <Card
        className={'p-3 !rounded-xl'}
        sx={{
          border: '1px solid #e2e8f0',
        }}
      >
        <p className="font-semibold text-[14px]"> Current package: {sumItem} items</p>
        {skuList.map((skuItem, index) => {
          return (
            <Box key={index}>
              {skuItem.map((item) => (
                <Box key={item?.sku_id} className="flex justify-between items-center gap-3 mt-3 w-[300px]">
                  <Box className="flex gap-2">
                    <Box className="w-[26px] flex-shrink-0">
                      <Image
                        src={item?.sku_image}
                        className="w-[26px] h-[26px] object-cover mt-1 block"
                        width={26}
                        height={26}
                      />
                    </Box>
                    <Box>
                      <p className="text-[12px] text-gray-500">{item?.sku_name}</p>
                      <p className="text-[12px] text-gray-500">{item?.sku_id}</p>
                    </Box>
                  </Box>
                  <Box>
                    <p className="font-semibold">x{item.quantity}</p>
                  </Box>
                </Box>
              ))}
            </Box>
          );
        })}
      </Card>
    );
  };

  const contentPopoverSize = (data, key, index) => {
    return (
      <Card
        className={'p-3 !rounded-xl'}
        sx={{
          border: '1px solid #e2e8f0',
        }}
      >
        {key === 'size' && (
          <>
            <Box key={index}>
              <Controller
                name={`package_size[${index}].length`}
                control={control}
                defaultValue=""
                rules={{ required: 'Vui lòng nhập Length' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Length"
                    fullWidth
                    margin="normal"
                    placeholder="VD: White, T-shirt-S"
                    error={!!errors?.orders?.[index]}
                    helperText={
                      errors?.orders?.[index]?.sku_name?.message ? errors.orders?.[index]?.sku_name?.message : ''
                    }
                  />
                )}
              />
              <Controller
                name={`package_size[${index}].width`}
                control={control}
                defaultValue=""
                rules={{ required: 'Vui lòng nhập Width' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Width"
                    fullWidth
                    margin="normal"
                    placeholder="VD: White, T-shirt-S"
                    error={!!errors?.orders?.[index]}
                    helperText={
                      errors?.orders?.[index]?.sku_name?.message ? errors.orders?.[index]?.sku_name?.message : ''
                    }
                  />
                )}
              />
              <Controller
                name={`package_size[${index}].height`}
                control={control}
                defaultValue=""
                rules={{ required: 'Vui lòng nhập Height' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Height"
                    fullWidth
                    margin="normal"
                    placeholder="VD: White, T-shirt-S"
                    error={!!errors?.orders?.[index]}
                    helperText={
                      errors?.orders?.[index]?.sku_name?.message ? errors.orders?.[index]?.sku_name?.message : ''
                    }
                  />
                )}
              />
            </Box>
          </>
        )}
        {key === 'weight' && (
          <Controller
            name={`package_weight`}
            control={control}
            render={({ field }) => <TextField {...field} fullWidth margin="normal" />}
          />
        )}
      </Card>
    );
  };

  const renderCelProduct = (data) => {
    const sumItem = data.data.order_info_list
      .map((item) => {
        if (item.line_items && item.line_items.length > 0) {
          return item.line_items.length;
        }
        return item.sku_list.length;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

    return (
      <Typography variant="body2">
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Box variant="contained" {...bindTrigger(popupState)}>
                <Box className={'cursor-pointer flex gap-1'}>
                  <Box>
                    <p className="text-[13px] font-semibold">{sumItem} sản phẩm</p>
                    {data.data.order_info_list.map((item) => {
                      const orderItemList = item?.line_items || item?.sku_list;
                      return orderItemList.map((prItem) => (
                        <Box key={prItem.sku_id} className="inline-block mr-3 w-10 h-10 [&:nth-child(3+n)]:hidden">
                          <Image
                            preview={false}
                            className="w-full h-full object-cover"
                            width={30}
                            height={30}
                            src={prItem.sku_image}
                          />
                        </Box>
                      ));
                    })}
                  </Box>
                  <Box>
                    <SvgIcon>
                      <KeyboardArrowDownIcon />
                    </SvgIcon>
                  </Box>
                </Box>
              </Box>
              <Popover
                {...bindPopover(popupState)}
                style={{ zIndex: 999 }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {<>{renderPopoverProduct(data, sumItem)}</>}
              </Popover>
            </div>
          )}
        </PopupState>
      </Typography>
    );
  };

  const handleByLabel = async () => {
    const buyLabelSelected = tableData.filter((data) => selected.find((item) => item === data.data.package_id));

    const dataBuyLabel = buyLabelSelected.map((item) => ({
      dimension: {
        length: item.package_size[0],
        width: item.package_size[1],
        height: item.package_size[2],
      },
      dimension_unit: 2,
      package_id: item.data.package_id,
      shipping_service_id: item.data.shipping_provider_id,
      weight: item.package_weight,
      weight_unit: 2,
    }));

    try {
      setLoadingTable(true);
      setLoadingButton(true);
      await RepositoryRemote.orders.requestByLabel(shopId, dataBuyLabel);
      setStartFulfillment(true);
      toast.success('Mua label thành công.');
    } catch (error) {
      toast.error('Mua label thất bại!. Vui lòng thử lại.');
    } finally {
      setLoadingTable(false);
      setLoadingButton(false);
    }
  };

  const handleStartFulfillment = async () => {
    try {
      setLoadingTable(true);
      setLoadingButton(true);

      const buyLabelSelected = tableData.filter((data) => selected.find((item) => item === data.data.package_id));

      const packageIds = {
        package_ids: buyLabelSelected.map((label) => label.data.package_id),
      };

      const res = await RepositoryRemote.orders.requestGetShippingDoc(shopId, packageIds);

      if (res?.data?.data) {
        const shippingDocData = buyLabelSelected.map((item, index) => ({
          order_list: item.data.order_info_list,
          label: res?.data?.data.doc_urls[index],
          package_id: item.data.package_id,
        }));

        sessionStorage.setItem(`fulfillment_${shopId}`, JSON.stringify(shippingDocData));

        router.push(`/shops/${shopId}/fulfillment`);
      }
    } catch (error) {
      console.log(error);
      toast.error('Lấy shipping doc lỗi');
    } finally {
      setLoadingTable(false);
      setLoadingButton(false);
    }
  };

  const columnsSizeChart = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text, _, index) => (
        <Form.Item name={[index, 'type']} initialValue={text}>
          <Input className="pointer-events-none border-0 text-center bg-transparent" />
        </Form.Item>
      ),
      onCell: (record) => ({ rowSpan: record.rowSpan }),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, _, index) => (
        <Form.Item name={[index, 'name']} initialValue={text}>
          <Input className="pointer-events-none border-0 text-center bg-transparent" />
        </Form.Item>
      ),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      render: (text, _, index) => (
        <Form.Item name={[index, 'weight']} initialValue={text}>
          <Input className="text-center" />
        </Form.Item>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      align: 'center',
      render: (text, _, index) => (
        <Form.Item name={[index, 'size']} initialValue={text}>
          <Input className="text-center" />
        </Form.Item>
      ),
    },
  ];

  const dataSizeChartConvert = useMemo(() => {
    if (dataSizeChart) {
      return dataSizeChart
        .map((sizeChart) =>
          sizeChart.items.map((item, index) => ({
            ...item,
            type: sizeChart.name,
            rowSpan: index === 0 ? sizeChart.items.length : 0,
          })),
        )
        .flat();
    }
    return [];
  }, [dataSizeChart]);

  const handleUpdateSizeChart = (values) => {
    const hasTypePosition = Object.keys(values)
      .map((key) => ({ index: key, type: values[key].type }))
      .filter((item) => item.type !== undefined)
      .map((item) => parseInt(item.index));

    const sizeChartSplice = [];
    for (let i = 0; i < hasTypePosition.length - 1; i++) {
      const start = hasTypePosition[i];
      const end = hasTypePosition[i + 1];
      const spliceData = Object.values(values).slice(start, end);
      sizeChartSplice.push(spliceData);
    }

    const result = Object.values(values).slice(hasTypePosition[hasTypePosition.length - 1]);
    sizeChartSplice.push(result);
    const sizeChartUpdate = sizeChartSplice.map((itemUpdate) => ({
      name: itemUpdate[0].type,
      items: itemUpdate.map((item) => ({
        name: item.name,
        weight: item.weight,
        size: item.size,
      })),
    }));
    setDataSizeChart(sizeChartUpdate);
    setOpen(false);
  };

  console.log('fields', fields);
  console.log('fields.length', fields.length);

  const renderTable = useMemo(() => {
    return (
      <Box component="form" onSubmit={handleSubmit(handleByLabel)} sx={{ position: 'relative' }} className={'min-h-40'}>
        {loadingTable && (
          <Box
            className={
              'flex justify-center items-center w-full absolute top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(117,134,149,0.5)]'
            }
          >
            <LoadingCustom />
          </Box>
        )}
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    // disabled={checkDisableAllCheckBox.length === rowsPerPage}
                    onChange={(event) => {
                      if (event.target.checked) {
                        handleSelectAll?.();
                      } else {
                        handleDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>STT</TableCell>
                <TableCell>Đơn hàng</TableCell>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Cân nặng</TableCell>
                <TableCell>Kích thước</TableCell>
                <TableCell>Vận chuyển</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.length ? (
                <>
                  {fields.map((order, index) => {
                    console.log('order', order);
                    const isSelected = selected.includes(order.data.package_id);
                    return (
                      <TableRow hover key={order.data.package_id} selected={isSelected}>
                        <TableCell padding={'none'}>
                          <Checkbox
                            checked={isSelected}
                            // disabled={disableCheckBox}
                            onChange={(event) => {
                              if (event.target.checked) {
                                handleSelectOne?.(order?.data?.package_id);
                              } else {
                                handleDeselectOne?.(order?.id);
                              }
                            }}
                            value={isSelected}
                          />
                        </TableCell>
                        <TableCell padding={'none'}>
                          <Typography variant="body2">{index + 1}</Typography>
                        </TableCell>
                        <TableCell padding={'none'}>
                          <Typography variant="body2">{order.data.order_info_list.length} orders combined</Typography>
                        </TableCell>
                        <TableCell padding={'none'}>{renderCelProduct(order)}</TableCell>
                        <TableCell padding={'none'}>
                          <Typography variant="body2">
                            {order?.package_weight || ''} <span>lb</span>
                          </Typography>
                        </TableCell>
                        <TableCell padding={'none'}>
                          <Typography variant="body2">
                            {order.package_size[0]} x {order.package_size[1]} x {order.package_size[2]} <span>in</span>
                          </Typography>
                        </TableCell>
                        <TableCell padding={'none'}>
                          <Typography variant="body2">
                            {order?.data.shipping_provider || ''} <span>lb</span>
                          </Typography>
                        </TableCell>
                        <TableCell align="center" padding={'none'}>
                          <Stack alignItems="center" direction="row" spacing={1}>
                            <IconButton
                              onClick={() => {
                                setDataEdit(order);
                                setIsOpenModalEdit(true);
                                setActiveItem(index);
                              }}
                            >
                              <SvgIcon>
                                <BorderColorIcon />
                              </SvgIcon>
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              ) : (
                <TableCell colSpan={8}>
                  <NoData className={'min-h-36'} />
                </TableCell>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
        {isOpenModalEdit && (
          <ModalUpdateInfo
            shopId={shopId}
            order={dataEdit}
            handleSetDataTable={handleSetDataTable}
            listOrders={tableData}
            isOpen={isOpenModalEdit}
            handleClose={() => setIsOpenModalEdit(false)}
            activeItem={activeItem}
          />
        )}
      </Box>
    );
  }, [fields]);

  return (
    <>
      <Stack
        justifyContent={'flex-end'}
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={2}
        className="my-6"
        sx={{
          px: 4,
        }}
      >
        {startFulfillment ? (
          <LoadingButton
            size="small"
            variant="contained"
            disabled={!!!selected.length}
            loading={loadingButton}
            onClick={handleStartFulfillment}
          >
            Fulfillment &nbsp;
            {!!selected.length && <span variant="subtitle2">{`(${selected.length})`}</span>}
          </LoadingButton>
        ) : (
          <LoadingButton
            size="small"
            variant="contained"
            disabled={!!!selected.length}
            loading={loadingButton}
            onClick={handleByLabel}
          >
            Mua Label &nbsp;
            {!!selected.length && <span variant="subtitle2">{`(${selected.length})`}</span>}
          </LoadingButton>
        )}

        <Button size="small" variant="contained" onClick={() => setOpen(true)}>
          Sửa Size Chart
        </Button>
      </Stack>
      {renderTable}
      <Modal title="Size Chart" open={open} onCancel={() => setOpen(false)} width={1000} footer={false}>
        <Form name="basic" onFinish={handleUpdateSizeChart}>
          <TableAntd dataSource={dataSizeChartConvert} columns={columnsSizeChart} bordered pagination={false} />
          <Form.Item className="text-right mt-10">
            <Button variant="contained" type="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
