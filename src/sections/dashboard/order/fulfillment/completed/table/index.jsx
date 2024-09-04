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
} from "@mui/material";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import Link from "next/link";
import { LoadingCustom } from "src/components/loading";
import { Scrollbar } from "src/components/scrollbar";
import { ModalDetailOrder } from "../../../modal/modal-detail-order";
import { ModalLoginFlashShip } from "src/components/modal/flash-ship-login";
import { ModalRejectOrderFulfillment } from "../modal/modal-reject-order";
import { NoData } from "src/components/nodata";
import { useEffect, useState } from "react";
import { useAppSelector } from "src/redux/hook";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { LOCAL_STORAGE_KEY } from "src/constants";

export const TableOrderFulfillment = (props) => {
  const { data, tableName } = props;

  const tokenFlashShip = localStorage.getItem(
    LOCAL_STORAGE_KEY.TOKEN_FLASH_SHIP
  );
  const flashShipTokenExpiration = localStorage.getItem(
    `${LOCAL_STORAGE_KEY.TOKEN_FLASH_SHIP}-expiration`
  );
  const { packageFulfillmentCompleted, orderByShop } = useAppSelector(
    (state) => state.orders
  );
  const currentTime = Date.now();
  const [loadingTable, setLoadingTable] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [openModalDetailOrder, setOpenModalDetailOrder] = useState(false);
  const [openModalLoginFlashShip, setOpenModalLoginFlashShip] = useState(false);
  const [orderDetail, settOrderDetail] = useState({});
  const [rejectOrderNote, setRejectOrderNote] = useState("");
  const [rejectOrder, setRejectOrder] = useState({});
  const [openFlashShipReject, setOpenFlashShipReject] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 5,
  });

  useEffect(() => {
    handleDataTable();
  }, [data, state]);

  const handleDataTable = () => {
    const dataConvert = [...data];
    const begin = state.currentPage * state.rowsPerPage;
    const end = begin + state.rowsPerPage;
    setTotalItems(dataConvert.length);
    setDataTable(dataConvert.slice(begin, end));
  };

  const onRowsPerPageChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  };

  const onPageChange = (_, newPage) => {
    setState((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
  };

  const handleOrderPackage = (index) => {
    if (orderByShop?.data?.data) {
      const orderPackageFlashShip = dataTable[index];
      const orderList = orderByShop?.data?.data?.flatMap(
        (order) => order?.data?.order_list
      );

      const orderListHasPackageId = orderList?.filter(
        (order) => order?.package_list?.length
      );
      const packageOrders = orderListHasPackageId?.filter(
        (order) =>
          order.package_list[0].package_id ===
          orderPackageFlashShip?.pack_id?.toString()
      );

      return (
        <ul>
          {packageOrders.map((item) => (
            <li key={item.order_id} className="mb-4 block">
              <Box
                onClick={() => {
                  settOrderDetail(item);
                  setOpenModalDetailOrder(true);
                }}
                className="font-medium mb-5 last:mb-0 hover:underline"
              >
                <Chip
                  color="info"
                  label={item.order_id}
                  className="hover:underline"
                ></Chip>
              </Box>
            </li>
          ))}
        </ul>
      );
    }
  };

  const handleCancelOrderFlashShip = (order) => {
    if (
      !tokenFlashShip ||
      currentTime >= parseInt(flashShipTokenExpiration, 10)
    ) {
      toast.error("Đăng nhập tài khoản Flashship để có thể xem hoặc huỷ đơn.");
      setOpenModalLoginFlashShip(true);
    } else {
      setOpenFlashShipReject(true);
      setRejectOrder(order);
    }
  };

  const handleDetailFlashShip = (orderCode) => {
    if (
      !tokenFlashShip ||
      currentTime >= parseInt(flashShipTokenExpiration, 10)
    ) {
      toast.error("Đăng nhập tài khoản Flashship để có thể xem hoặc huỷ đơn.");
      setOpenModalLoginFlashShip(true);
    } else {
      handleDetailFlashShipAPI(orderCode);
    }
  };

  const handleDetailFlashShipAPI = (orderCode) => {};

  return (
    <Card className="p4 mb-5">
      <Typography
        sx={{
          position: "relative",
          px: 4,
          pt: 4,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        {tableName === "flashShip"
          ? `Orders that have been Fulfillment completed and sent to FlashShip `
          : `Orders that have been Fulfillment completed and sent to PrintCare `}

        {dataTable.length > 0 ? `(${dataTable?.length})` : "(0)"}
      </Typography>
      <Card className="p-4">
        <Box
          sx={{ position: "relative" }}
          className={"min-h-20 rounded-lg overflow-hidden mt-4"}
        >
          {(packageFulfillmentCompleted?.loading || loadingTable) && (
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
                <TableCell align="center">STT</TableCell>
                {tableName === "flashShip" && (
                  <TableCell className="text-nowrap">Order code</TableCell>
                )}
                <TableCell>Order Id</TableCell>
                <TableCell>Package Id</TableCell>
                <TableCell>Product items</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Shipping information</TableCell>
                <TableCell
                  align="center"
                  style={{
                    position: "sticky",
                    right: "-2px",
                    background: "white",
                  }}
                >
                  Action
                </TableCell>
              </TableHead>
              <TableBody>
                {dataTable.length ? (
                  <>
                    {dataTable.map((order, index) => {
                      return (
                        <TableRow hover key={order.order_id}>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {state.currentPage * state.rowsPerPage +
                                index +
                                1 || ""}
                            </Typography>
                          </TableCell>
                          {tableName === "flashShip" && (
                            <TableCell align="center">
                              <Typography variant="body2">
                                {order.order_code || ""}
                              </Typography>
                            </TableCell>
                          )}
                          <TableCell align="center">
                            {handleOrderPackage(index)}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {order.pack_id || ""}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {order.products?.length || ""} Sản phẩm
                            </Typography>
                          </TableCell>
                          <TableCell align="center" className="">
                            <Box className={"max-w-[300px]"}>
                              <Link
                                className="text-[#1772c9] hover:underline line-clamp-1"
                                href={order?.linkLabel}
                                target="_blank"
                              >
                                <p>{order?.linkLabel}</p>
                              </Link>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li>
                                <span className="font-bold">Buyer name: </span>
                                {order.buyer_first_name} {order.buyer_last_name}
                              </li>
                              <li>
                                <span className="font-bold">Buyer email: </span>
                                <Link
                                  href={`mailto:${order.buyer_email}`}
                                  className="text-[#1772c9] hover:underline"
                                >
                                  {order.buyer_email}
                                </Link>
                              </li>
                              <li>
                                <span className="font-bold">Address: </span>
                                {order.buyer_address1}
                              </li>
                              <li>
                                <span className="font-bold">City: </span>
                                {order.buyer_city}
                              </li>
                              <li>
                                <span className="font-bold">State: </span>
                                {order.buyer_province_code}
                              </li>
                              <li>
                                <span className="font-bold">Country: </span>
                                {order.buyer_country_code}
                              </li>
                              <li>
                                <span className="font-bold">Zip code: </span>
                                {order.buyer_zip}
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{
                              position: "sticky",
                              right: "-2px",
                              background: "white",
                            }}
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
                                      <Tooltip title={"Xóa"} placement="top">
                                        <IconButton onClick={() => {}}>
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
                                            onClick={() => {
                                              handleCancelOrderFlashShip(order);
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
                              <Tooltip
                                title={"Xem thông tin chi tiết"}
                                placement="top"
                              >
                                <IconButton onClick={handleDetailFlashShip}>
                                  <SvgIcon>
                                    <RemoveRedEyeIcon />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <TableCell colSpan={tableName === "flashShip" ? 6 : 7}>
                      <NoData className={"min-h-36"} />
                    </TableCell>
                  </>
                )}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePagination
            component="div"
            count={totalItems}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            page={state.currentPage}
            rowsPerPage={state.rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
      </Card>
      {openModalDetailOrder && (
        <ModalDetailOrder
          isOpen={openModalDetailOrder}
          handleClose={() => setOpenModalDetailOrder(false)}
          order={orderDetail}
        />
      )}
      {openModalLoginFlashShip && (
        <ModalLoginFlashShip
          isOpen={openModalLoginFlashShip}
          handleClose={() => setOpenModalLoginFlashShip(false)}
        />
      )}
      {openFlashShipReject && (
        <ModalRejectOrderFulfillment
          isOpen={openFlashShipReject}
          handleClose={() => setOpenFlashShipReject(false)}
          data={rejectOrder}
        />
      )}
    </Card>
  );
};
