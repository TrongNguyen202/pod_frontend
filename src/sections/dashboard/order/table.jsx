import {
  Box,
  Card,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { formatDate } from 'src/utils/date';
import { statusOrderNew } from 'src/constants';
import Popover from '@mui/material/Popover';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { useAppSelector } from 'src/redux/hook';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import { useMemo, useState } from 'react';
import { ModalUpdateOrder } from './modal/modal-update-order';
import { ModalRejectOrder } from './modal/modal-reject-order';
import DeleteIcon from '@mui/icons-material/Delete';
import { RenderListItemProduct } from './components/render-list-item';
import { RenderItemProduct } from './components/render-item';
import { ModalDetailOrder } from './modal/modal-detail-order';

export const OrderTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    sort,
    onSortCreateTime,
    handleSetDataTable,
    loadingTable,
  } = props;
  const { orders, packagesBought } = useAppSelector((state) => state.orders);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [orderCustomEdit, settOrderCustomEdit] = useState({});
  const [openModalRejectOrder, setOpenModalRejectOrder] = useState(false);
  const [openModalDetailOrder, setOpenModalDetailOrder] = useState(false);

  const checkDisableCheckBox = (order) => {
    const disabledStatus = ['CANCELLED', 'COMPLETED', 'DELIVERED', 'IN_TRANSIT', 'ON_HOLD', 'UNPAID'];
    const disabledLabel = packagesBought.data.map((item) => item.package_id);

    const isDisabledStatus = disabledStatus.includes(order.status);

    const isDisabledLabel = disabledLabel.includes(order.packages.length && order.packages[0]?.id);

    return isDisabledStatus || isDisabledLabel;
  };

  const checkDisableAllCheckBox = useMemo(() => {
    const result = items.map((order) => {
      return !checkDisableCheckBox(order) && order?.packages.length ? order?.packages[0]?.id : null;
    });

    return result;
  }, [items]);

  const selectedSome = selected.length && selected.length < items.length;
  const selectedAll = items.length && selected.length === items.length;

  return (
    <Card className={'min-h-80 relative z-[1]'}>
      {(orders.loading || loadingTable) && (
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
              {/* <TableCell>STT</TableCell> */}
              <TableCell>STT</TableCell>
              <TableCell>Package ID</TableCell>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>người sở hữu</TableCell>
              <TableCell>shop</TableCell>
              <TableCell>Trạng thái đơn hàng</TableCell>
              <TableCell>
                <TableSortLabel active={true} direction={sort?.createdTime} onClick={onSortCreateTime}>
                  Thời gian tạo đơn
                </TableSortLabel>
              </TableCell>
              <TableCell>Vận chuyển</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((order, index) => {
                  const isSelected = selected.includes(order.packages[0]?.id);
                  const disableCheckBox = checkDisableCheckBox(order);

                  return (
                    <TableRow hover key={order.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          disabled={disableCheckBox}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(order?.packages[0]?.id);
                            } else {
                              onDeselectOne?.(order?.packages[0]?.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{index + 1 + page * rowsPerPage}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order?.packages.length ? order?.packages[0]?.id : 'Hiện chưa có package ID'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="flex flex-col">
                          <Typography
                            noWrap
                            variant="body2"
                            sx={{ cursor: 'pointer' }}
                            className="text-[#1772c9] hover:underline text-"
                            onClick={() => {
                              setOpenModalDetailOrder(true);
                              settOrderCustomEdit(order);
                            }}
                          >
                            {order?.id || ''}
                          </Typography>
                          <span variant="subtitle1" className="text-xs">
                            {formatDate(order?.update_time * 1000, 'DD/MM/YYYY, h:mm:ss a')}
                          </span>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                              <div>
                                <Box variant="contained" {...bindTrigger(popupState)}>
                                  <RenderItemProduct order={order} />
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
                                  <RenderListItemProduct data={order} />
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.shop_owner?.username || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.shop?.name || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {statusOrderNew.map(
                            (item) =>
                              item.value === order?.status && (
                                <Chip key={item.title} color={item.color} label={item.title}></Chip>
                              ),
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {' '}
                          <Typography variant="body2">
                            {formatDate(order?.create_time * 1000, 'DD/MM/YYYY, h:mm:ss a')}
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {' '}
                          <Typography variant="body2">{order?.shipping_provider || ''}</Typography>
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <IconButton
                            onClick={() => {
                              setOpenModalUpdate(true);
                              settOrderCustomEdit(order);
                            }}
                          >
                            <SvgIcon>
                              <BorderColorIcon />
                            </SvgIcon>
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setOpenModalRejectOrder(true);
                              settOrderCustomEdit(order);
                            }}
                          >
                            <SvgIcon>
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableCell colSpan={11}>
                <NoData className={'min-h-36'} />
              </TableCell>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      {openModalUpdate && (
        <ModalUpdateOrder
          isOpen={openModalUpdate}
          handleClose={() => setOpenModalUpdate(false)}
          order={orderCustomEdit}
          handleSetDataTable={handleSetDataTable}
          listOrders={items}
        />
      )}
      {openModalRejectOrder && (
        <ModalRejectOrder
          isOpen={openModalRejectOrder}
          handleClose={() => setOpenModalRejectOrder(false)}
          order={orderCustomEdit}
        />
      )}
      {openModalDetailOrder && (
        <ModalDetailOrder
          isOpen={openModalDetailOrder}
          handleClose={() => setOpenModalDetailOrder(false)}
          order={orderCustomEdit}
        />
      )}
      {!orders.loading && (
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 100, 500, 1000]}
        />
      )}
    </Card>
  );
};
