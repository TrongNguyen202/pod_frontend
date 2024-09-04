import { Box, Card, Tooltip } from '@mui/material';
import { Image } from 'antd';

export const RenderListItemProduct = (props) => {
  const { line_items, item_list } = props.data;

  return (
    <Card
      className={'p-3 !rounded-xl'}
      sx={{
        border: '1px solid #e2e8f0',
      }}
    >
      <p className="text-[13px] font-semibold">{line_items?.length} sản phẩm</p>
      {item_list.map((item, index) => {
        return (
          <Box className="flex justify-between items-center gap-3 mt-3 w-[300px]" key={index}>
            <Box className="flex gap-2">
              <Box className="w-[26px] flex-shrink-0">
                <Image
                  src={item?.sku_image}
                  className="w-[26px] h-[26px] object-cover mt-1 block"
                  width={26}
                  height={26}
                />
              </Box>
              <Box>
                <Tooltip title={item?.product_name}>
                  <p className="font-semibold line-clamp-1 text-sm">{item?.product_name}</p>
                </Tooltip>
                <p className="text-[12px] text-gray-500">{item?.sku_name}</p>
                <p className="text-[12px] text-gray-500">{item?.seller_sku}</p>
              </Box>
            </Box>
            <Box>
              <p className="font-semibold">x{item.quantity}</p>
            </Box>
          </Box>
        );
      })}
    </Card>
  );
};
