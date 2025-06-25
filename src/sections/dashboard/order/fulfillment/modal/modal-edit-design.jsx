import { Box, Button, Modal, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch } from "src/redux/hook";
// import { fetchGetDesignSku } from "src/redux/reducers/orders";
import { RepositoryRemote } from "src/services";

export const ModalEditDesign = (props) => {
  const { isOpen, handleClose, design } = props;
  const dispatch = useAppDispatch();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      image_back: design?.image_back || "",
      image_front: design?.image_front || "",
      sku_id: design?.sku_id || "",
      product_name: design?.product_name || "",
      variation: design?.variation || "",
      mockup_front: design?.mockup_front || "",
      mockup_back: design?.mockup_back || "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    const updateItem = {
      image_front: data.image_front,
      image_back: data.image_back,
      mockup_front: data.mockup_front,
      mockup_back: data.mockup_back,
    };
    try {
      const res = await RepositoryRemote.orders.requestPutDesignSku(updateItem,  design.id);
      if (res.data) {
        toast.success("Cập nhật thiết kế thành công");
        // dispatch(fetchGetDesignSku());
        handleClose();
      } else {
        toast.error("Cập nhật thiết kết thất bại vui lòng thử lại!.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
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
          <h1 className="text-xl mb-3 font-bold">{`Sửa Design SKU`}</h1>
          <Controller
            name="sku_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sku ID"
                fullWidth
                margin="normal"
                disabled
              />
            )}
          />
          <Controller
            name="product_name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product name"
                fullWidth
                margin="normal"
                disabled
              />
            )}
          />
          <Controller
            name="variation"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Product variation"
                fullWidth
                margin="normal"
                disabled
              />
            )}
          />
          <Controller
            name="image_front"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image front"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="image_back"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Image back"
                fullWidth
                margin="normal"
                disabledx
              />
            )}
          />
          <Controller
            name="mockup_front"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="mockup_front"
                fullWidth
                margin="normal"
                disabledx
              />
            )}
          />
             <Controller
            name="mockup_back"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="mockup_back"
                fullWidth
                margin="normal"
                disabledx
              />
            )}
          />
          <Stack spacing={1} className="mt-6">
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
