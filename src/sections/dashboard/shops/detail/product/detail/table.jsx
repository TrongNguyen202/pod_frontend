import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { IntlNumberFormat } from "src/utils";

export const ProductTypeTable = (props) => {
  const { skus } = props.data;

  return (
    <Box sx={{ position: "relative" }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Color</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>SKU</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skus.map((type) => {
              return (
                <TableRow key={type.id}>
                  <TableCell>
                    {type.sales_attributes.map((item) => (
                      <span key={item.value_id}>
                        {item.name === "Color" && item.value_name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    {type.sales_attributes.map((item) => (
                      <span key={item.value_id}>
                        {item.name === "Size" && item.value_name}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    {IntlNumberFormat(
                      type?.price?.currency || "",
                      "currency",
                      3,
                      type?.price?.original_price || 0
                    )}
                  </TableCell>
                  <TableCell>
                    {type?.stock_infos[0]?.available_stock > 0 ? (
                      type?.stock_infos[0]?.available_stock
                    ) : (
                      <Chip color="error" label={"Hết hàng"} />
                    )}
                  </TableCell>
                  <TableCell>{type?.seller_sku}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};
