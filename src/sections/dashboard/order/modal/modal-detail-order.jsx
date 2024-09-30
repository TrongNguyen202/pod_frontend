import { Box, Card, Grid, Modal, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from 'src/hooks/use-search-params';
export const ModalDetailOrder = (props) => {
  const { isOpen, handleClose, order } = props;

  const {
    create_time,
    delivery_option,
    warehouse_id,
    paid_time,
    rts_sla,
    rts_time,
    item_list,
    payment_method_name,
    payment,
    payment_info,
    recipient_address,
    buyer_uid,
    order_id,
  } = order;
  const searchParams = useSearchParams();
  const shopId = searchParams.get('id');
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="rounded-2xl overflow-hidden"
      >
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
            // display: "block",
            width: 900,
            maxWidth: 1000,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">{`Chi tiết đơn hàng (#${
            order.id || order_id
          })`}</h1>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card className="p-4">
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <h3 className="font-bold">Location</h3>
                    <span className={"text-[14px] text-gray-600"}>美国</span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold">Created time</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {create_time}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">
                      Delivery option type
                    </h3>
                    <span className={"text-[14px] text-gray-600"}>
                      TikTok shipping
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Delivery option</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {delivery_option}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Order type</h3>
                    <span className={"text-[14px] text-gray-600"}>Normal</span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Fulfilment type</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      Fulfilment by seller
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Warehouse name</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      TikTok Shop Sandbox US Local Sales warehouse
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Warehouse ID</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {warehouse_id}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Prepare order by</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {dayjs(paid_time).format("MMM DD, YYYY hh:mm:ss A")}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Ship order by</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {dayjs(rts_sla).format("MMM DD, YYYY hh:mm:ss A")}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">
                      Late dispatch after
                    </h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {dayjs(rts_time).format("MMM DD, YYYY hh:mm:ss A")}
                    </span>
                  </Grid>
                  <Grid item xs={4}>
                    <h3 className="font-bold text-nowrap">Auto-cancel date</h3>
                    <span className={"text-[14px] text-gray-600"}>
                      {dayjs(rts_time).format("MMM DD, YYYY hh:mm:ss A")}
                    </span>
                  </Grid>
                </Grid>
              </Card>
              <Card className="p-4 mt-4">
                {item_list.map((item) => {
                  return (
                    <Card key={item.product_id} className="p-3">
                      <div className="flex gap-1">
                        <p className="font-bold">SKU ID:</p>
                        <p>{item.sku_id}</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center gap-3 mt-3 w-full">
                          <div className="flex gap-2 justify-between">
                            <div className="flex-grow-0 w-[30px] h-[30px] flex-shrink-0">
                              <Image
                                src={item.sku_image}
                                className="w-[30px] h-[30px] object-cover mt-1 flex-1"
                                width={26}
                                height={26}
                              />
                            </div>
                            <div>
                              <Link
                                href={`/shops/${shopId}/products/${item.product_id}`}
                               
                              >
                                <Tooltip title={item.product_name}>
                                  <p className="font-semibold line-clamp-1">
                                    {item.product_name}
                                  </p>
                                </Tooltip>
                              </Link>
                              <p className="text-[12px] text-gray-500">
                                {item.sku_name}
                              </p>
                              <p className="text-[12px] text-gray-500">
                                {item.seller_sku}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">x{item.quantity}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className="p-4">
                <p className="font-semibold text-[18px]">
                  What your buyer paid
                </p>
                <p className="flex justify-between text-gray-500 my-4">
                  <p className="max-w-[150px]">Payment method</p>
                  <p className="font-semibold text-gray-600">
                    {payment_method_name}
                  </p>
                </p>
                <hr className="my-3 block" />
                <p className="flex justify-between text-gray-500">
                  <p className="max-w-[150px]">
                    Item(s) subtotal after discounts
                  </p>
                  <p className="font-semibold text-gray-600">
                    ${payment?.sub_total || payment_info?.sub_total || "0"}
                  </p>
                </p>
                <p className="flex justify-between text-gray-500">
                  <p className="max-w-[150px]">Shipping fee after discounts</p>
                  <p className="font-semibold text-gray-600">
                    $
                    {payment?.shipping_fee || payment_info?.shipping_fee || "0"}
                  </p>
                </p>
                <p className="flex justify-between text-gray-500">
                  <p className="max-w-[150px]">Taxes</p>
                  <p className="font-semibold text-gray-600">
                    ${payment?.taxes || payment_info?.taxes || "0"}
                  </p>
                </p>
                <p className="flex justify-between text-gray-500 items-center mt-3">
                  <p className="max-w-[150px] text-[20px] text-black">Total</p>
                  <p className="font-semibold text-gray-600 text-[18px]">
                    ${payment?.total_amount || payment_info?.total_amount || ""}
                  </p>
                </p>
              </Card>
              <Card className="p-4 mt-4">
                <p className="font-semibold text-[18px]">Customer info</p>
                <p className="flex justify-between text-gray-500 my-3">
                  <p className="max-w-[150px]">Name</p>
                  <p className="font-semibold text-gray-600">{buyer_uid}</p>
                </p>
                <hr className="my-3 block" />
                <p className="">
                  <p className="max-w-[150px] text-gray-500 mb-2">
                    Shipping address
                  </p>
                  <p className="font-semibold text-gray-800">
                    <p>{recipient_address.name}</p>
                    <p>{recipient_address.phone}</p>
                    <p>{recipient_address.address_detail}</p>
                    <p>{recipient_address.district}</p>
                    <p>{recipient_address.zipcode}</p>
                  </p>
                </p>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};
