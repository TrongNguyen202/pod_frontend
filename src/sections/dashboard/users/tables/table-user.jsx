import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Popover,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import Link from 'next/link';
import { LoadingCustom } from 'src/components/loading';
import { Scrollbar } from 'src/components/scrollbar';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import DeleteIcon from '@mui/icons-material/Delete';
import { NoData } from 'src/components/nodata';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RepositoryRemote } from 'src/services';
import { fetchGetShopByUser } from 'src/redux/reducers/user';
import { ModalActionUser } from '../modals/modal-action-user';

export const TableUser = (props) => {
  const { count = 0, items, onPageChange = () => {}, onRowsPerPageChange, page = 0, rowsPerPage = 0 } = props;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.users);
  const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false);
  const [dataEdit, setDataEdit] = useState(false);

  const handleDeleteUser = async (userId) => {
    const isToast = toast.loading('Đang thực hiện xóa user. Vui lòng chờ.');
    try {
      const dataUpdate = {
        user_id: userId,
        is_active: false,
      };

      const response = await RepositoryRemote.users.requestUpdateUser(dataUpdate);

      if (response.data) {
        toast.success('Xóa user thành công.');
        dispatch(fetchGetShopByUser());
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Xóa user không thành công. Vui lòng thử lại sau.', { id: isToast });
    }
  };

  return (
    <Card className="relative">
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
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Shops quản lý</TableCell>
              <TableCell>Mã nhân viên</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((user) => {
                  return (
                    <TableRow hover key={`${user?.id}-${user?.user_name}`}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Typography variant="body2">{user?.user_name || ''}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" flexWrap={'wrap'} direction="row" className="max-w-[800px] gap-2">
                          {user.shops.map((shop, index) => {
                            return (
                              <Chip
                                color="info"
                                key={shop?.id}
                                label={
                                  <>
                                    <Link href={`/shops/${shop?.id}`} className="text-white hover:underline text-xs">
                                      <Typography variant="body2" className="!text-xs">
                                        {index + 1}.{shop?.name || ''}
                                      </Typography>
                                    </Link>
                                  </>
                                }
                              ></Chip>
                            );
                          })}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <div>
                            <Typography variant="body2">{user?.user_code || ''}</Typography>
                          </div>
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Tooltip title="Cập Nhật" placement="top">
                            <IconButton
                              onClick={() => {
                                setIsOpenModalUpdateUser(true);
                                setDataEdit(user);
                              }}
                            >
                              <SvgIcon>
                                <Edit02Icon />
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                          <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                              <Box>
                                <Box variant="contained" {...bindTrigger(popupState)} className={'cursor-pointer'}>
                                  <Tooltip title="Xóa" placement="top">
                                    <IconButton>
                                      <SvgIcon>
                                        <DeleteIcon />
                                      </SvgIcon>
                                    </IconButton>
                                  </Tooltip>
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
                                  <Card className="p-3 rounded-md">
                                    <p className="mb-2 block font-semibold text-[14px]">Xác nhận đã xóa</p>

                                    <Stack direction="row" spacing={1} className="mt-2">
                                      <Button size="small" variant="contained" color="error" onClick={handleDeleteUser}>
                                        Delete
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                          bindPopover(popupState).onClose();
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </Stack>
                                  </Card>
                                </Popover>
                              </Box>
                            )}
                          </PopupState>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <TableCell colSpan={4}>
                <NoData className={'min-h-36'} />
              </TableCell>
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
        rowsPerPageOptions={[5, 10, 25]}
      />
      {isOpenModalUpdateUser && (
        <ModalActionUser
          isOpen={isOpenModalUpdateUser}
          dataEdit={dataEdit}
          handleClose={() => setIsOpenModalUpdateUser(false)}
        />
      )}
    </Card>
  );
};
