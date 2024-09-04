import { Box, SvgIcon } from "@mui/material";
import Image from "next/image";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const RenderItemProduct = (props) => {
  const { order } = props;

  return (
    <Box className={"cursor-pointer flex gap-1"}>
      <Box>
        <p className="text-[13px] font-semibold text-nowrap">
          {order?.line_items?.length} sản phẩm
        </p>
        {order.line_items?.length && (
          <Box>
            <Image
              src={order.line_items[0]?.sku_image}
              className="w-[26px] h-[26px] object-cover mt-1 block"
              width={26}
              height={26}
            />
          </Box>
        )}
      </Box>
      <Box>
        <SvgIcon>
          <KeyboardArrowDownIcon />
        </SvgIcon>
      </Box>
    </Box>
  );
};
