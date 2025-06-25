import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import { Scrollbar } from 'src/components/scrollbar';
import { ModalDetailOrder } from '../modal/modal-detail-order';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
// import { fetchPackageFulfillmentCompleted } from 'src/redux/reducers/orders';
import { useSearchParams } from 'next/navigation';

export const OrderLabelComponent = (props) => {
  const {
    items = [],
    onDeselectAll,
    onDeselectOne,
    onSelectAll,
    onSelectOne,
    selected = [],
    toShipInfoData,
    changeNextStep,
  } = props;
  const dispatch = useAppDispatch();
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  const selectedSome = selected.length && selected.length < items.length;
  const selectedAll = items.length && selected.length === items.length;
  const { packageFulfillmentCompleted } = useAppSelector((state) => state.orders);

  const checkDisableCheckbox = (order) => {
    const disabledOrderCompleted = packageFulfillmentCompleted.data.filter(
      (item) => item.pack_id === order.package_id && item.package_status,
    );

    return {
      disabled: !order.label || disabledOrderCompleted.length,
    };
  };

  const checkDisableAllCheckBox = useMemo(() => {
    const result = items.map((order) => {
      return !checkDisableCheckbox(order).disabled && order?.package_id ? order?.package_id : null;
    });

    return result;
  }, [items]);

  useEffect(() => {
    if (shopId) {
      // dispatch(fetchPackageFulfillmentCompleted('6'));
    }
  }, [shopId]);

  useEffect(() => {
    toShipInfoData(items.filter((item) => selected.find((select) => select === item.package_id)));

    if (!!selected.length) {
      changeNextStep(true);
    } else {
      changeNextStep(false);
    }
  }, [selected]);

  return (
    <Box sx={{ position: 'relative' }} className={'min-h-80'}>
      {false && (
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
            <TableCell>
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                disabled={!checkDisableAllCheckBox.filter((check) => check).length}
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelectAll?.(checkDisableAllCheckBox.filter((check) => check));
                  } else {
                    onDeselectAll?.();
                  }
                }}
              />
            </TableCell>
            <TableCell>STT</TableCell>
            <TableCell>Package ID </TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Label URL</TableCell>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((order, index) => {
                  const isSelected = selected.includes(order.package_id);
                  const disableCheckBox = checkDisableCheckbox(order);

                  return (
                    <TableRow hover key={order.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          disabled={disableCheckBox.disabled}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(order?.package_id);
                            } else {
                              onDeselectOne?.(order?.package_id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{index + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order?.package_id ? order?.package_id : ''}</Typography>
                      </TableCell>
                      <TableCell>
                        {order.order_list.map((item) => {
                          return (
                            <Box
                              key={item.id}
                              onClick={() => {
                                console.log('item', item);
                                setOrderDetail(item);
                                setOpenModalDetail(true);
                              }}
                              className="font-medium mb-5 last:mb-0 cursor-pointer"
                            >
                              <Chip color="info" label={item.id} className="hover:underline"></Chip>
                            </Box>
                          );
                        })}
                      </TableCell>
                      <TableCell>
                        {order?.label ? (
                          <Link
                            key={order?.label}
                            href={order?.label}
                            className="line-clamp-1 font-medium mb-5 last:mb-0 text-[#1677ff] hover:underline text-[14px]"
                            target="_blank"
                          >
                            <p>{order?.label}</p>
                          </Link>
                        ) : (
                          <Chip color="error" label="Không lấy được label" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableCell colSpan={5}>
                <NoData className={'min-h-36'} />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      {openModalDetail && (
        <ModalDetailOrder
          isOpen={openModalDetail}
          handleClose={() => {
            setOpenModalDetail(false);
          }}
          order={orderDetail}
        />
      )}
    </Box>
  );
};
