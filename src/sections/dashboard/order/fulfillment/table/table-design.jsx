import {
  Box,
  Button,
  Card,
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
  Typography,
} from "@mui/material";
import { LoadingCustom } from "src/components/loading";
import { NoData } from "src/components/nodata";
import { Scrollbar } from "src/components/scrollbar";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import { ModalEditDesign } from "../modal/modal-edit-design";
import { useState } from "react";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import toast from "react-hot-toast";
import { fetchGetDesignSku } from "src/redux/reducers/orders";
import { useAppDispatch, useAppSelector } from "src/redux/hook";

export const DesignTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
  } = props;
  const [isShowModal, setIsShowModal] = useState(false);
  const [designUpdate, setDesignUpdate] = useState({});
  const dispatch = useAppDispatch();
  const { designSku } = useAppSelector((state) => state.orders);

  const handleDeleteDesign = async (design) => {
    if (design?.id) {
      try {
        const res = await RepositoryRemote.orders.requestPostDesignSku(
          design?.id
        );
        if (res.data) {
          toast.success("Xóa thiết kế thành công");
          dispatch(fetchGetDesignSku());
        } else {
          toast.error("Xóa thiết kết thất bại vui lòng thử lại!.");
        }
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Có lỗi xảy ra!");
      }
    } else {
      toast.error("Không tìm thấy id design!");
    }
  };

  return (
    <Box sx={{ position: "relative" }} className={"min-h-80"}>
      {designSku.loading && (
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
            <TableCell>STT</TableCell>
            <TableCell>Sku ID</TableCell>
            <TableCell>Product name</TableCell>
            <TableCell>Variation</TableCell>
            <TableCell>Design front image </TableCell>
            <TableCell>Design back image</TableCell>
            <TableCell
              style={{
                position: "sticky",
                right: 0,
                background: "white",
                boxShadow: "5px 2px 5px grey",
              }}
            >
              Actions
            </TableCell>
          </TableHead>
          <TableBody>
            {items.length ? (
              <>
                {items.map((design, index) => {
                  return (
                    <TableRow hover key={design?.sku_id}>
                      <TableCell>
                        <Typography variant="body2">{index + 1}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {design?.sku_id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="min-w-48">
                          {design?.product_name || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {design?.variation || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {design?.image_front || ""}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {design?.image_back || ""}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{
                          position: "sticky",
                          right: "-2px",
                          background: "white",
                          boxShadow: "5px 2px 5px grey",
                        }}
                      >
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <IconButton
                            onClick={() => {
                              setDesignUpdate(design);
                              setIsShowModal(true);
                            }}
                          >
                            <SvgIcon>
                              <BorderColorIcon />
                            </SvgIcon>
                          </IconButton>
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
                                  <IconButton onClick={() => {}}>
                                    <SvgIcon>
                                      <DeleteIcon />
                                    </SvgIcon>
                                  </IconButton>
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
                                      Xác nhận đã xóa design
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
                                        onClick={() => {
                                          handleDeleteDesign(design);
                                          bindPopover(popupState).onClose();
                                        }}
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
              <TableCell colSpan={7}>
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
      {isShowModal && (
        <ModalEditDesign
          isOpen={isShowModal}
          handleClose={() => setIsShowModal(false)}
          design={designUpdate}
        />
      )}
    </Box>
  );
};
