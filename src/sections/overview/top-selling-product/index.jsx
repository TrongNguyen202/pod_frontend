import { EcommerceProducts } from "src/sections/dashboard/ecommerce/ecommerce-products";
import { useEffect, useState } from "react";
import { useAppSelector } from "src/redux/hook";
import { Card } from "@mui/material";
import { NoData } from "src/components/nodata";

export const TopSellingProduct = () => {
  const { order } = useAppSelector((state) => state.statistics);
  const [data, setData] = useState([]);

  useEffect(() => {
    handleData();
  }, [order]);

  const handleData = () => {
    // const result = [...dataMockChart].sort(
    //   (a, b) => new Date(a.date) - new Date(b.date)
    // )[0];
    if (order?.data?.length) {
      const result = [...order.data][0];
      setData([...result.products].splice(0, 5));
    }
  };

  console.log("data", data);

  return (
    <>
      {data.length > 0 ? (
        <EcommerceProducts products={data} />
      ) : (
        <Card className="!flex-grow-1 p-8">
          <NoData />
        </Card>
      )}
    </>
  );
};
