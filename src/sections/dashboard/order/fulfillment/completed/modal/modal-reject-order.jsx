import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Modal,
  TextareaAutosize,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const ModalRejectOrderFulfillment = (props) => {
  const { isOpen, handleClose, rejectOrderNoteData, data } = props;

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
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
          }}
        >
          <Card elevation={16}>
            <CardHeader
              sx={{ pb: 0, fontSize: 26 }}
              title={`Confirm Reject Order (#${data?.order_id})`}
              className="!text-3xl"
            />
            <CardContent>
              <Box onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller
                  name={`note`}
                  control={control}
                  defaultValue=""
                  rules={{ required: "Vui lòng nhập note!" }}
                  render={({ field }) => (
                    <TextareaAutosize
                      {...field}
                      label="Note"
                      fullWidth
                      margin="normal"
                      error={!!errors?.note}
                      helperText={errors?.note ? errors.note : ""}
                    />
                  )}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Modal>
  );
};
