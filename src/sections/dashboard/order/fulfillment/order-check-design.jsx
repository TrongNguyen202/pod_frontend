/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DesignTable } from "./table/table-design";
import { useAppDispatch, useAppSelector } from "src/redux/hook";
import { fetchGetDesignSku } from "src/redux/reducers/orders";
import toast from "react-hot-toast";
import { ModalAddDesign } from "./modal/modal-add-design";

export const OrderCheckDesign = (props) => {
  const { toShipInfoData } = props;
  const dispatch = useAppDispatch();
  const { designSku } = useAppSelector((state) => state.orders);
  const [newDesignSku, setNewDesignSku] = useState([]);
  const [openAddDesignSku, setOpenAddDesignSku] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [state, setState] = useState({
    currentPage: 0,
    rowsPerPage: 10,
    // search: ""
  });
  console.log("Data to ship", toShipInfoData)
  const handleCheckDesign = (data) => {
    const dataCheck = data
      .map((order) => {
        const productList = order.order_list
          .map((item, index) => {
            const productItem = item.item_list
              .map((product) => ({

                ...product,
                order_id: order.order_list[index].id,
               
              }))
              .flat();
            return productItem;
          })
          .flat();

        return productList.map((item) => ({
          order_id: item.order_id,
          label: order.label,
          sku_id: item.sku_id,
          quantity: item.quantity,
          product_name: item.product_name,
          variation: item.sku_name,
          product_id: item.product_id,
          sku_image: item.sku_image
        }));
      })
      .flat();

    const dataCheckSet = new Set();
    const dataCheckResult = dataCheck
      .map((item) => {
        if (!dataCheckSet.has(item.sku_id)) {
          dataCheckSet.add(item.sku_id);
          return item;
        }
        return null;
      })
      .filter((item) => item !== null);

    const dataDesignSku = dataCheckResult.filter((checkItem) => {
      return !designSku?.data.results.some(
        (designItem) => designItem.sku_id === checkItem.sku_id
      );
    });

    if (dataDesignSku.length) {
      setOpenAddDesignSku(true);
      setNewDesignSku(dataDesignSku);
    } else {
      toast.success(
        "Tất cả design đều đã tồn tại. Vui lòng kiểm tra lại bằng chức tìm kiếm"
      );
    }
  };

  useEffect(() => {
    if (designSku?.initial) handleCheckDesign(toShipInfoData);
  }, [toShipInfoData, designSku?.initial]);

  // useEffect(() => {
  //   dispatch(fetchGetDesignSku());
  // }, [dispatch]);

  useEffect(() => {
    handleDataTable();
  }, [designSku, state]);

  const handleDataTable = () => {
    if (designSku?.data?.results) {
      let data = [...designSku?.data?.results];

      // if (state.search) {
      //   data = data.filter((item) =>
      //     item.shop_name.toLowerCase().includes(state.search.toLowerCase())
      //   );
      // }

      const begin = state.currentPage * state.rowsPerPage;
      const end = begin + state.rowsPerPage;
      setTotalItems(data.length);
      setDataTable(data.slice(begin, end));
    }
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

  return (
    <Box className="mb-12">
      <Typography
        sx={{
          position: "relative",
          px: 4,
          pt: 4,
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        Danh sách Design
      </Typography>
      <DesignTable
        count={totalItems || 0}
        items={dataTable || []}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={state.currentPage}
        rowsPerPage={state.rowsPerPage}
      />
      {openAddDesignSku && (
        <ModalAddDesign
         
          isOpen={openAddDesignSku}
          handleClose={() => setOpenAddDesignSku(false)}
          design={newDesignSku}
        />
      )}
    </Box>
  );
};
