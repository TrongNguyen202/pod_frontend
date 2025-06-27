import { Card } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "src/redux/hook";
// import {
//   fetchAllOrderByShop,
//   fetchPackageFulfillmentCompleted,
// } from "src/redux/reducers/orders";
import { TableOrderFulfillment } from "./table";
import { useEffect, useMemo } from "react";

export const FlashShip = () => {
  const dispatch = useAppDispatch();
  const { packageFulfillmentCompleted } = useAppSelector(
    (state) => state.orders
  );
  const searchParams = useSearchParams();
  const shopId = searchParams.get("id");

  const dataTableFlashShip = useMemo(() => {
    return packageFulfillmentCompleted?.data.filter(
      (item) => item.fulfillment_name === "FlashShip"
    );
  }, [packageFulfillmentCompleted]);

  const dataTablePrintCare = useMemo(() => {
    return packageFulfillmentCompleted?.data.filter(
      (item) => item.fulfillment_name === "PrintCare"
    );
  }, [packageFulfillmentCompleted]);

  // useEffect(() => {
  //   if (shopId) {
  //     dispatch(fetchAllOrderByShop(shopId));
  //     // dispatch(fetchPackageFulfillmentCompleted(shopId));
  //   }
  // }, [shopId]);

  return (
    <Card className="p-4">
      <TableOrderFulfillment
        data={dataTableFlashShip}
        tableName={"flashShip"}
      />
      <TableOrderFulfillment
        data={dataTablePrintCare}
        tableName={"printCare"}
      />
    </Card>
  );
};
