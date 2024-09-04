import PropTypes from "prop-types";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { Scrollbar } from "src/components/scrollbar";
import DeleteIcon from "@mui/icons-material/Delete";
import GavelIcon from "@mui/icons-material/Gavel";
import Link from "next/link";
import { ModalUpdateShop } from "./modal/modal-update";
import { useState } from "react";
import { Button, Card, Popover, Tooltip } from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { RepositoryRemote } from "src/services";
import { fetchGetListShops } from "src/redux/reducers/shops";
import { useAppDispatch, useAppSelector } from "src/redux/hook";
import toast from "react-hot-toast";
import { LoadingCustom } from "src/components/loading";
import { NoData } from "src/components/nodata";

export const ShopsTable = (props) => {
  const {
    count = 0,
    items,
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.shops);

  const [isOpenModalUpdateShop, setIsOpenModalUpdateShop] = useState(false);
  const [dataEdit, setDataEdit] = useState(false);

  const handleExtendShop = async (shopId) => {
    const toastId = toast.loading("Đang gia hạn cửa hàng. Vui lòng chờ!");
    try {
      await RepositoryRemote.stores.requestRefreshToken(shopId);
      toast.success("Gia hạn cửa hàng thành công", { id: toastId });
      dispatch(fetchGetListShops());
    } catch (error) {
      toast.error("Gia hạn cửa hàng thất bại", { id: toastId });
    }
  };

  const handleDeleteShop = async (shop) => {
    const toastId = toast.loading("Đang xóa cửa hàng. Vui lòng chờ!");
    try {
      await RepositoryRemote.stores.requestUpdateStore(shop.id, {
        is_active: false,
        access_token: shop.access_token,
        auth_code: shop.auth_code,
        shop_name: shop.shop_name,
      });
      toast.success("Xóa cửa hàng thành công.", { id: toastId });
      dispatch(fetchGetListShops());
    } catch (error) {
      toast.error("Xóa cửa hàng. Vui lòng thử lại sau!", { id: toastId });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {loading && (
        <Box
          className={
            "flex justify-center items-center w-full absolute top-0 left-0 right-0 bottom-0 z-50 bg-[rgba(117,134,149,0.5)]"
          }
        >
          <LoadingCustom />
        </Box>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Cửa Hàng</TableCell>
              <TableCell>Shop Code</TableCell>
              <TableCell className="text-nowrap">Mô Tả</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((shop) => {
                  return (
                    <TableRow hover key={shop?.id}>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <div>
                            <Typography variant="body2">
                              {shop?.id || ""}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Link
                            href={`/shops/${shop.id}`}
                            className="text-[#1772c9] hover:underline text-sm"
                          >
                            <Typography variant="body2">
                              {shop?.shop_name || ""}
                            </Typography>
                          </Link>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <div>
                            <Typography variant="body2">
                              {shop?.shop_code || ""}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          {/* <div>
                        <Typography variant="body2">
                          {user?.shop_code || ""}
                        </Typography>
                      </div> */}
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Tooltip title="Gia Hạn" placement="top">
                            <IconButton
                              onClick={() => handleExtendShop(shop.id)}
                            >
                              <SvgIcon>
                                <GavelIcon />
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cập Nhật" placement="top">
                            <IconButton
                              onClick={() => {
                                setIsOpenModalUpdateShop(true);
                                setDataEdit(shop);
                              }}
                            >
                              <SvgIcon>
                                <Edit02Icon />
                              </SvgIcon>
                            </IconButton>
                          </Tooltip>
                          <PopupState
                            variant="popover"
                            popupId="demo-popup-popover"
                          >
                            {(popupState) => (
                              <Box>
                                <Box
                                  variant="contained"
                                  {...bindTrigger(popupState)}
                                  className={"cursor-pointer"}
                                >
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
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                >
                                  <Card className="p-3 rounded-md">
                                    <p className="mb-2 block font-semibold text-[14px]">
                                      Xác nhận đã xóa
                                    </p>

                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      className="mt-2"
                                    >
                                      <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={handleDeleteShop}
                                      >
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
              <TableCell colSpan={11}>
                <NoData className={"min-h-36"} />
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
      {isOpenModalUpdateShop && (
        <ModalUpdateShop
          isOpen={isOpenModalUpdateShop}
          handleClose={() => setIsOpenModalUpdateShop(false)}
          shop={dataEdit}
        />
      )}
    </Box>
  );
};

ShopsTable.propTypes = {
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
