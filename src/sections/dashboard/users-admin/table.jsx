import PropTypes from 'prop-types';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Scrollbar } from 'src/components/scrollbar';
import { Button, Card, Chip, Popover, Tooltip } from '@mui/material';
import { LoadingCustom } from 'src/components/loading';
import { useAppSelector } from 'src/redux/hook';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { RepositoryRemote } from 'src/services';
import { useState } from 'react';
import { ModalActionUserAdmin } from './modals/modal-action-user';

export const UserAdminTable = (props) => {
  const { count = 0, items, onPageChange = () => {}, onRowsPerPageChange, page = 0, rowsPerPage = 0 } = props;
  const { loading } = useAppSelector((state) => state.userAdmin);
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
    <Card sx={{ position: 'relative' }}>
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
              <TableCell>Mã nhân viên </TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((user) => {
              return (
                <TableRow hover key={user?.user_id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={1}>
                      <div>
                        <Typography variant="body2">{user?.user_name || ''}</Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack alignItems="start" direction="row" flexWrap={'wrap'} gap={1}>
                      {user.shops.map((shop, index) => {
                        return (
                          <Chip
                            key={shop.id}
                            label={`${index + 1}. ${shop.name}`}
                            // onClick={() => onChange?.(option.value)}
                            color="primary"
                            sx={{
                              borderColor: 'transparent',
                              borderRadius: 1.5,
                              borderStyle: 'solid',
                              borderWidth: 2,
                              fontSize: 12,
                              // ...(option.value === value && {
                              //   borderColor: "primary.main",
                              // }),
                            }}
                          />
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
        <ModalActionUserAdmin
          isOpen={isOpenModalUpdateUser}
          dataEdit={dataEdit}
          handleClose={() => setIsOpenModalUpdateUser(false)}
        />
      )}
    </Card>
  );
};

UserAdminTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
