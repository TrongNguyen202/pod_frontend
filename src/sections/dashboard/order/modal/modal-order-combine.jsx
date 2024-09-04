import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  Modal,
  Popover,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { RenderListItemProduct } from "../components/render-list-item";
import { IntlNumberFormat } from "src/utils";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { RenderItemProduct } from "../components/render-item";
import { NoData } from "src/components/nodata";
import { RepositoryRemote } from "src/services";
import toast from "react-hot-toast";

export const ModalOrderCombine = (props) => {
  const { isOpen, handleClose, data, shopId, dataOrderDetail } = props;

  const [dataCombine, setDataCombine] = useState(
    data?.pre_combine_pkg_list || []
  );
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    filterData();
  }, [shopId]);

  const filterData = () => {
    const result = dataCombine?.map((item) => {
      const order = item.order_id_list
        .map((orderId) => {
          const check = dataOrderDetail.find((detail) => detail.id === orderId);

          return check ? orderId : null;
        })
        .filter((order) => order);

      return {
        pre_combine_pkg_id: item.pre_combine_pkg_id,
        order_id_list: order,
      };
    });

    setDataCombine(result);
  };

  const confirmCombine = async () => {
    if (shopId) {
      const idToast = toast.loading("Đang xử lý gộp đơn. Vui lòng chờ!");
      setDisableButton(true);
      try {
        const dataCombineConfirm = {
          pre_combine_pkg_list: dataCombine,
        };

        const response = await RepositoryRemote.orders.requestConfirmCombine(
          shopId,
          dataCombineConfirm
        );

        if (response?.data) {
          toast.success("Gộp đơn thành công", { id: idToast });
        }
      } catch (error) {
        toast.error("Gộp đơn hàng gặp lỗi. Vui lòng thử lại sau!", {
          id: idToast,
        });
      } finally {
        setDisableButton(false);
      }
    }
  };

  const handleRemoveCombineItem = (combinePkgId, orderId) => {
    const dataRemoved = dataCombine.map((item) => {
      return {
        pre_combine_pkg_id: item.pre_combine_pkg_id,
        order_id_list:
          item.pre_combine_pkg_id === combinePkgId
            ? item.order_id_list.filter((order) => order !== orderId)
            : item.order_id_list,
      };
    });

    setDataCombine(dataRemoved);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      disableAutoFocus
      disableScrollLock
      // hideBackdrop
      PaperProps={{
        style: {
          maxWidth: "1200px",
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
            display: "block",
            width: 900,
          }}
          // className={"overflow-x-hidden"}
        >
          <Box>
            {dataCombine.length ? (
              <>
                {dataCombine?.map((item, index) => {
                  const orderCombine = item.order_id_list
                    .map((orderItem) =>
                      dataOrderDetail?.filter(
                        (orderTableItem) => orderTableItem.id === orderItem
                      )
                    )
                    .flat();

                  const orderCombineConvert = orderCombine.map((item2) => ({
                    ...item2,
                    pre_combine_pkg_id: item.pre_combine_pkg_id,
                  }));

                  return (
                    <Card key={index} className="mb-3 !rounded-2xl">
                      <Scrollbar>
                        <Table sx={{ minWidth: 700 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Order ID</TableCell>
                              <TableCell>Sản phẩm</TableCell>
                              <TableCell>Tổng</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {orderCombineConvert.length ? (
                              <>
                                {orderCombineConvert.map((order) => {
                                  return (
                                    <TableRow hover key={order.id}>
                                      <TableCell>
                                        <Typography variant="body2">
                                          {order?.id ? order?.id : ""}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2">
                                          <PopupState
                                            variant="popover"
                                            popupId="demo-popup-popover"
                                          >
                                            {(popupState) => (
                                              <div>
                                                <Box
                                                  variant="contained"
                                                  {...bindTrigger(popupState)}
                                                >
                                                  <RenderItemProduct
                                                    order={order}
                                                  />
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
                                                  <RenderListItemProduct
                                                    data={order}
                                                  />
                                                </Popover>
                                              </div>
                                            )}
                                          </PopupState>
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2">
                                          {IntlNumberFormat(
                                            order?.payment?.currency,
                                            "currency",
                                            5,
                                            order?.payment?.total_amount
                                          )}
                                        </Typography>
                                      </TableCell>
                                      <TableCell
                                        align="center"
                                        // style={{
                                        //   position: "sticky",
                                        //   right: "-2px",
                                        //   background: "white",
                                        //   boxShadow: "5px 2px 5px grey",
                                        //   borderRight: "2px solid black",
                                        // }}
                                      >
                                        <Stack
                                          alignItems="center"
                                          direction="row"
                                          spacing={1}
                                        >
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
                                                  <Tooltip
                                                    title={"Xóa"}
                                                    placement="top"
                                                  >
                                                    <IconButton
                                                      onClick={() => {}}
                                                    >
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
                                                          handleRemoveCombineItem(
                                                            order.pre_combine_pkg_id,
                                                            order.id
                                                          );
                                                          bindPopover(
                                                            popupState
                                                          ).onClose();
                                                        }}
                                                      >
                                                        Delete
                                                      </Button>
                                                      <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => {
                                                          bindPopover(
                                                            popupState
                                                          ).onClose();
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
                                <NoData className={"min-h-36"} />
                              </TableCell>
                            )}
                          </TableBody>
                        </Table>
                      </Scrollbar>
                    </Card>
                  );
                })}
              </>
            ) : (
              <>
                <NoData className={"min-h-36"} />
              </>
            )}
          </Box>

          <Stack spacing={1} className="mt-6">
            <Button
              disabled={disableButton || !dataCombine.length}
              onClick={confirmCombine}
              variant="contained"
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
