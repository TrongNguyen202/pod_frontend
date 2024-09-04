import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RepositoryRemote } from "src/services";

export const ModalUpdateInfo = (props) => {
  const {
    isOpen,
    handleClose,
    order,
    handleSetDataTable,
    listOrders,
    activeItem,
    shopId,
  } = props;
  const [shippingServiceData, setShippingServiceData] = useState([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      package_size: [
        {
          length: order.package_size[0],
          width: order.package_size[1],
          height: order.package_size[2],
        },
      ],
      package_weight: order.package_weight,
      shipping_provider: `${order.data.shipping_provider_id}-${order.data.shipping_provider}`,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (order?.data?.package_id && shopId) {
      handleGetShippingService();
    }
  }, [order?.data?.package_id, shopId]);

  const handleGetShippingService = async () => {
    try {
      const res = await RepositoryRemote.orders.requestShippingService(shopId, {
        // package_id: order?.data?.package_id,
        package_id: order?.data?.package_id,
      });

      setShippingServiceData(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi lấy thông tin dịch vụ ship!");
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "package_size",
  });

  const onSubmit = async (data) => {
    const dataUpdate = [...listOrders];
    const shippingService = data.shipping_provider.split("-");
    const newOrders = {
      ...order,
      package_size: [
        data.package_size[0].length,
        data.package_size[0].width,
        data.package_size[0].height,
      ],
      package_weight: data.package_weight,
      data: {
        ...order.data,
        shipping_provider_id: shippingService[0],
        shipping_provider: shippingService[1],
      },
    };

    dataUpdate[activeItem] = newOrders;
    handleSetDataTable(dataUpdate);
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
          <h1 className="text-xl mb-3 font-bold">Cập nhật thông tin</h1>

          <Card className="p-3">
            <Typography variant="h6" className="mb-3 text-[#1677ff]">
              Cân nặng
            </Typography>
            <Controller
              name={`package_weight`}
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth margin="normal" />
              )}
            />
          </Card>
          <Card className="p-3 my-3">
            <Typography variant="h6" className="mb-3 text-[#1677ff]">
              Kích thước
            </Typography>
            {fields.map((item, index) => (
              <Box key={item.id}>
                <Controller
                  name={`package_size[${index}].length`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập Length" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Length"
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
                <Controller
                  name={`package_size[${index}].width`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập Width" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Width"
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
                <Controller
                  name={`package_size[${index}].height`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập Height" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Height"
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
          </Card>
          <Card className="p-3">
            <Typography variant="h6" className="mb-3 text-[#1677ff]">
              Vận chuyển
            </Typography>
            <Controller
              name="shipping_provider"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  {shippingServiceData.map((service) => {
                    return (
                      <FormControlLabel
                        key={service.id}
                        value={`${service.id}-${service.name}`}
                        control={<Radio />}
                        label={service.name}
                      />
                    );
                  })}
                </RadioGroup>
              )}
            />
          </Card>
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
