import {
  Box,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { statusProductTikTokShop } from 'src/constants';
import { IntlNumberFormat, removeDuplicates } from 'src/utils';
import { formatDate } from 'src/utils/date';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useAppSelector } from 'src/redux/hook';
import { LoadingCustom } from 'src/components/loading';
import { NoData } from 'src/components/nodata';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Image } from 'antd';

export const ShopProductsTable = (props) => {
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
    stateFilter,
    onSortCreate,
    onSortUpdate,
  } = props;
  const { loading } = useAppSelector((state) => state.products);
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const renderPrice = (product) => {
    const listPrice = product?.skus?.map((item) => item?.price?.original_price || 0);
    const current = removeDuplicates(
      product?.skus?.map((item) => item?.price?.currency || 'USD'),
      'currency',
    );
    const minPrice = IntlNumberFormat(current, 'currency', 6, Math.min(...listPrice));
    const maxPrice = IntlNumberFormat(current, 'currency', 6, Math.max(...listPrice));
    return (
      <>
        {minPrice === maxPrice && <span>{minPrice}</span>}
        {minPrice !== maxPrice && (
          <span className="text-nowrap">
            {minPrice} - {maxPrice}
          </span>
        )}
      </>
    );
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && (
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
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectAll?.();
                    } else {
                      onDeselectAll?.();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Mã sản phẩm</TableCell>
              {/* <TableCell>Ảnh sản phẩm</TableCell> */}
              <TableCell>Tên sản phẩm </TableCell>
              <TableCell>Giá sản phẩm</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>
                <TableSortLabel active={true} direction={stateFilter?.sortCreate} onClick={onSortCreate}>
                  Thời gian tạo
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={true} direction={stateFilter?.sortUpdate} onClick={onSortUpdate}>
                  Thời gian cập nhật
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((product) => {                  
                  const isSelected = selected.includes(product.id);

                  return (
                    <TableRow hover key={product.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(product?.id);
                            } else {
                              onDeselectOne?.(product?.id);
                            }
                          }}
                          value={isSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{product?.id || ''}</Typography>
                      </TableCell>
                      {/* <TableCell>
                        <Image
                          width={50}
                          src={product.images}
                        />
                      </TableCell> */}

                      <TableCell>
                        <Tooltip placement="top" title={product?.name || ''}>
                          <Typography variant="body2" className="line-clamp-2">
                            {product?.name || ''}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{renderPrice(product)}</Typography>
                      </TableCell>
                      <TableCell>
                        {statusProductTikTokShop.map((item, index) => {
                          return (
                            product?.status === index && (
                              <Chip
                                key={index}
                                style={{
                                  backgroundColor: item.backgroundColor,
                                  color: '#fff',
                                  height: 26,
                                }}
                                label={item.title}
                              />
                            )
                          );
                        })}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(product?.create_time * 1000, 'DD/MM/Y, h:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(product?.update_time * 1000, 'DD/MM/Y, h:mm:ss')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Link href={`/shops/${shopId}/products/${product?.id}/edit`}>
                            <Tooltip placement="top" title={'Sửa'}>
                              <IconButton>
                                <SvgIcon>
                                  <BorderColorIcon />
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                          </Link>
                          <Link href={`/shops/${shopId}/products/${product?.id}`}>
                            <Tooltip placement="top" title={'Xem'}>
                              <IconButton>
                                <SvgIcon>
                                  <RemoveRedEyeIcon />
                                </SvgIcon>
                              </IconButton>
                            </Tooltip>
                          </Link>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <>
                <TableCell colSpan={8}>
                  <NoData className={'min-h-36'} />
                </TableCell>
              </>
            )}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[100]}
      />
    </Box>
  );
};
