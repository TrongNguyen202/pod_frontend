import PropTypes from 'prop-types';
import Image01Icon from '@untitled-ui/icons-react/build/esm/Image01';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Scrollbar } from 'src/components/scrollbar';

export const EcommerceProducts = (props) => {
  const { products } = props;

  return (
    <Card>
      <CardHeader title="Top sản phẩm bán chạy nhất" />
      <Scrollbar>
        <Table sx={{ minWidth: 300 }}>
          <TableBody>
            {products.map((product, index) => {
              return (
                <TableRow hover key={product.id}>
                  <TableCell>
                    <Stack alignItems="center" direction="row" spacing={2}>
                      {product?.sku_image ? (
                        <Box
                          sx={{
                            alignItems: 'center',
                            backgroundColor: 'neutral.50',
                            backgroundImage: `url(${product.sku_image})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            borderRadius: 1,
                            display: 'flex',
                            height: 120,
                            minHeight: 120,
                            maxHeight: 120,
                            justifyContent: 'center',
                            overflow: 'hidden',
                            width: 120,
                            minWidth: 120,
                            maxWidth: 120,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            alignItems: 'center',
                            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.700' : 'neutral.50'),
                            borderRadius: 1,
                            display: 'flex',
                            height: 120,
                            minHeight: 120,
                            maxHeight: 120,
                            justifyContent: 'center',
                            width: 120,
                            minWidth: 120,
                            maxWidth: 120,
                          }}
                        >
                          <SvgIcon>
                            <Image01Icon />
                          </SvgIcon>
                        </Box>
                      )}
                      <div>
                        <Typography variant="subtitle2" className="line-clamp-2">
                          {product?.product_name || ''}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          # {product.product_id}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography color="success.main" variant="subtitle2">
                      {product?.status.TOTAL || ''}
                    </Typography>
                    <Typography color="text.secondary" noWrap variant="body2">
                      đã bán
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.700' : 'neutral.200'),
                        borderRadius: 1.5,
                        px: 1,
                        py: 0.5,
                        display: 'inline-block',
                      }}
                    >
                      <Typography variant="subtitle2">#{index + 1}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          See All
        </Button>
      </CardActions> */}
    </Card>
  );
};

EcommerceProducts.propTypes = {
  products: PropTypes.array.isRequired,
};
