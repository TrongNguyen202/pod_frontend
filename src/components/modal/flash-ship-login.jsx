import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ENVIRONMENT_URL } from "src/constants";
import { RepositoryRemote } from "src/services";
import { setTokenExpand } from "src/utils/auth";

export const ModalLoginFlashShip = (props) => {
  const { isOpen, handleClose } = props;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Đang thực hiện đăng nhập. Vui lòng chờ!");
    try {
      const response = await RepositoryRemote.flashShip.requestLoginFlashShip(
        data
      );
      if (response.data) {
        setTokenExpand(
          LOCAL_STORAGE_KEY.TOKEN_FLASH_SHIP,
          response.data.access_token,
          ENVIRONMENT_URL.TOKEN_FLASH_SHIP_EXPIRATION
        );
        toast.success("Vui lòng click lại để xem hoặc huỷ đơn.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.", {
        id: toastId,
      });
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
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
            width: 900,
            maxWidth: 1000,
          }}
          component={"form"}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Card elevation={16}>
            <CardHeader
              sx={{ pb: 0, fontSize: 26 }}
              title="FlashShip Login"
              className="!text-3xl"
            />
            <CardContent>
              <Box>
                <Controller
                  name={`username`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập username" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Username"
                      fullWidth
                      margin="normal"
                      error={!!errors?.username}
                      helperText={
                        errors?.username ? errors.username.message : ""
                      }
                    />
                  )}
                />

                <Controller
                  name={`password`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập password" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      fullWidth
                      margin="normal"
                      type="password"
                      error={!!errors?.password}
                      helperText={
                        errors?.password ? errors.password.message : ""
                      }
                    />
                  )}
                />

                <Stack spacing={1} className="mt-6">
                  <Button type="submit" variant="contained">
                    Login
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};
