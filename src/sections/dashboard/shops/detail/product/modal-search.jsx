import { Box, Button, Modal, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const ModalSearchProduct = (props) => {
  const { isOpen, handleClose } = props;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    console.log(data);
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
            maxWidth: 600,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">Tìm kiếm</h1>

          <Controller
            name="product_id"
            control={control}
            defaultValue=""
            rules={{ required: "Vui lòng nhập Mã sản phẩm" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mã sản phẩm"
                fullWidth
                margin="normal"
                error={!!errors.product_id}
                helperText={errors?.product_id ? errors.product_id.message : ""}
              />
            )}
          />
          <Controller
            name="product_name"
            control={control}
            defaultValue=""
            rules={{ required: "Vui lòng nhập Tên sản phẩm" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên sản phẩm"
                // variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.product_name}
                helperText={errors.product_name ? errors.product_name.message : ""}
              />
            )}
          />
          <Stack spacing={1} className="mt-6">
            <Button type="submit" variant="contained">
              Tìm kiếm
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
