import { Box, Button, MenuItem, Modal, Select, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "src/redux/hook";

export const ModalSelectShop = (props) => {
  const { isOpen, handleClose } = props;
  const { shops } = useAppSelector((state) => state.shops);
  const [shop, setShop] = useState();
  const router = useRouter();

  const optionShop = useMemo(() => {
    if (shops.length) {
      return shops.map((shop) => {
        return {
          value: shop.id,
          title: shop.shop_name,
        };
      });
    }
    return [];
  }, [shops]);

  const handleNavigateShop = () => {
    if (shop) {
      router.push("#");
    } else {
      toast.error("Vui lòng chọn shop!");
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
            display: "block",
            widths: 400,
          }}
        >
          <h1 className="text-xl mb-3 font-bold">{`Vui lòng chọn shop!`}</h1>
          <Select
            label=""
            variant="filled"
            onChange={(e) => setShop(e.target.value)}
            className="w-full"
            placeholder="shop"
          >
            {optionShop.map((option) => {
              return (
                <MenuItem value={option.value} key={option.value}>
                  {option.title}
                </MenuItem>
              );
            })}
          </Select>

          <Stack spacing={1} className="mt-6">
            <Button onClick={handleNavigateShop} variant="contained">
              Chuyển trang
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
