import {
  Box,
  Card,
  Checkbox,
  Popover,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import { Scrollbar } from 'src/components/scrollbar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppSelector } from 'src/redux/hook';
import { Image } from 'antd';

export const TableOrderFlashShip = (props) => {
  const { items = [], onDeselectAll, onDeselectOne, onSelectAll, onSelectOne, selected = [], loadingTable } = props;

  const { toShipInfor } = useAppSelector((state) => state.orders);

  const selectedSome = selected.length && selected.length < items.length;
  const selectedAll = items.length && selected.length === items.length;

  const renderListItemProduct = (product) => {
    const { order_list } = product;
    return order_list.map((item, index) => {
      return (
        <Card
          key={index}
          className={'p-3 !rounded-xl'}
          sx={{
            border: '1px solid #e2e8f0',
          }}
        >
          <p className="text-[13px] font-semibold">{order_list?.length} sản phẩm</p>
          <Box className="flex justify-between items-center gap-3 mt-3 w-[300px]">
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
                <Tooltip title={item?.product_name}>
                  <p className="font-semibold line-clamp-1 text-sm">{item?.product_name}</p>
                </Tooltip>
                <p className="text-[12px] text-gray-500">{item?.sku_name}</p>
                <p className="text-[12px] text-gray-500">{item?.seller_sku}</p>
              </Box>
            </Box>
            <Box>
              <p className="font-semibold">x{item.quantity}</p>
            </Box>
          </Box>
        </Card>
      );
    });
  };

  return (
    <Box sx={{ position: 'relative' }} className={'min-h-20 rounded-lg overflow-hidden mt-4'}>
      {(toShipInfor.loading || loadingTable) && (
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
                onChange={(event) => {
                  if (event.target.checked) {
                    onSelectAll?.();
                  } else {
                    onDeselectAll?.();
                  }
                }}
              />
            </TableCell>
            <TableCell>Package ID</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Product items</TableCell>
            <TableCell>Tracking ID</TableCell>
            <TableCell>Name buyer</TableCell>
            <TableCell>Shipping information</TableCell>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((order) => {
                  const isSelected = selected.includes(order?.order_id);
                  return (
                    <TableRow hover key={order.order_id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          // disabled={disableCheckBox}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(order?.order_id);
                            } else {
                              onDeselectOne?.(order?.order_id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order?.package_id || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order?.order_id || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                              <div>
                                <Box variant="contained" {...bindTrigger(popupState)}>
                                  <Box className={'cursor-pointer flex gap-1'}>
                                    <Box>
                                      <p className="text-[13px] font-semibold">{order?.order_list?.length} sản phẩm</p>
                                      {order.order_list?.length && (
                                        <Box>
                                          <Image
                                            src={order.order_list[0]?.sku_image}
                                            className="w-[26px] h-[26px] object-cover mt-1 block"
                                            width={26}
                                            height={26}
                                          />
                                        </Box>
                                      )}
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
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  {renderListItemProduct(order)}
                                </Popover>
                              </div>
                            )}
                          </PopupState>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order?.tracking_id || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order?.name_buyer || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <ul>
                          <li>
                            <span className="font-bold">State: </span>
                            {order.state}
                          </li>
                          <li>
                            <span className="font-bold">Street: </span>
                            {order.street}
                          </li>
                          <li>
                            <span className="font-bold">zip code: </span>
                            {order.zip_code}
                          </li>
                        </ul>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <>
                <TableCell colSpan={7}>
                  <NoData className={'min-h-36'} />
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};
