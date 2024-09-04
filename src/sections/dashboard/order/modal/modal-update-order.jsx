import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

export const ModalUpdateOrder = (props) => {
  const { isOpen, handleClose, order, handleSetDataTable, listOrders } = props;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      order: order.line_items.map((item) => {
        return {
          sku_id: item.sku_id,
          sku_name: item.sku_name,
          product_name: item.product_name,
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "order",
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    const orderCustomTable = listOrders.map((orderOrigin) => {
      const newOrder = { ...orderOrigin };
      if (newOrder.id === order.id) {
        const itemListUpdate = data.order.map((value) => {
          const checkOrderEdit = order.line_items?.find(
            (item) => item.sku_id === value.sku_id
          );

          return {
            ...checkOrderEdit,
            sku_name: value.sku_name,
          };
        });

        newOrder.line_items = itemListUpdate;
      }

      return newOrder;
    });
    handleSetDataTable(orderCustomTable);
    handleClose();
    reset();
  };

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
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
            display: "block",
            maxWidth: 1000,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">{`Thêm, chỉnh sửa thông tin cho đơn custom (${
            order?.id || ""
          })`}</h1>

          {fields.map((item, index) => (
            <Box key={item.id}>
              <Typography variant="h6" className="mb-3 text-[#1677ff]">
                {index + 1}. {item.product_name}
              </Typography>
              <Controller
                name={`order[${index}].sku_id`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sku id"
                    fullWidth
                    margin="normal"
                    disabled
                  />
                )}
              />
              <Controller
                name={`order[${index}].sku_name`}
                control={control}
                defaultValue=""
                rules={{ required: "Vui lòng nhập Sku Name" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sku Name"
                    fullWidth
                    margin="normal"
                    placeholder="VD: White, T-shirt-S"
                    error={!!errors?.order?.[index]}
                    helperText={
                      errors?.order?.[index]?.sku_name?.message
                        ? errors.order?.[index]?.sku_name?.message
                        : ""
                    }
                  />
                )}
              />
            </Box>
          ))}
          <Stack spacing={1} className="mt-6">
            <Button type="submit" variant="contained">
              Cập Nhật
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
