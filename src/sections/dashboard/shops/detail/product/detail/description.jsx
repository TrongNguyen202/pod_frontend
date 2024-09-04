import { Box } from "@mui/material";

export const DescriptionShopProduct = (props) => {
  const { description } = props.data;
  return (
    <Box className="break-words flex-nowrap">
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </Box>
  );
};
