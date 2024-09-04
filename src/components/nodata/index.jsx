import { Box } from "@mui/material";

export const NoData = (props) => {
  const { label, className } = props;

  return (
    <Box
      className={`${
        className || ""
      } text-center text-base font-semibold flex items-center justify-center`}
    >
      <p>{label || "Không có dữ liệu"}</p>
    </Box>
  );
};
