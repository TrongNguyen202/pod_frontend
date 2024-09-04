import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "src/redux/hook";
import { fetchGetAllOrders } from "src/redux/reducers/orders";
import { RepositoryRemote } from "src/services";

export const ModalRejectOrder = (props) => {
  const { isOpen, handleClose, order } = props;
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: "seller_cancel_reason_out_of_stock",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      const dataSubmit = {
        cancel_reason_key: data.reason,
        order_id: order.id,
      };

      const res = await RepositoryRemote.orders.requestCancelOder(
        order.shop.id,
        dataSubmit
      );

      if (res.data) {
        toast.success("Huỷ đơn thành công!");
      } else {
        toast.warning(res.message);
      }
      dispatch(fetchGetAllOrders(order.query));
    } catch (error) {
      toast.error(`Huỷ đơn thất bại. ${error}`);
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
          <h1 className="text-xl mb-3 font-bold">{`Select cancellation reason:`}</h1>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel
                  value="seller_cancel_reason_out_of_stock"
                  control={<Radio />}
                  label="Out of stock"
                />
                <FormControlLabel
                  value="seller_cancel_reason_wrong_price"
                  control={<Radio />}
                  label="Pricing error"
                />
                <FormControlLabel
                  value="seller_cancel_paid_reason_address_not_deliver"
                  control={<Radio />}
                  label="Unable to deliver to buyer address"
                />
                <FormControlLabel
                  value="seller_cancel_paid_reason_buyer_requested_cancellation"
                  control={<Radio />}
                  label="Buyer requested cancellation"
                />
              </RadioGroup>
            )}
          />
          <Stack spacing={1} flexDirection={"row"} className="mt-6 gap-2">
            <Button size="small" type="submit" variant="contained">
              Ok
            </Button>
            <Button
              className="!mt-0"
              size="small"
              variant="outlined"
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
