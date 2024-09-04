import {
  Box,
  Button,
  Card,
  IconButton,
  Popover,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ModalCreateVariation } from './modals/modal-create-variation';
import { useState } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import { NoData } from 'src/components/nodata';
import { Controller } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

export const ProductCreateAddVariation = (props) => {
  const { isProductCreate, shopId, setValue, errors, fieldSku, control, removeSku } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteSku = (index) => {
    removeSku(index);
  };

  return (
    <Card className="p-6">
      {isProductCreate && (
        <Button onClick={() => setIsModalOpen(true)} variant="contained" className="mb-3">
          Thêm biến thể
        </Button>
      )}

      <Card className={'mt-5'}>
        <Scrollbar>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell>Color</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell className="text-nowrap">Price</TableCell>
                <TableCell className="text-nowrap">Số lượng </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fieldSku.length ? (
                <>
                  {fieldSku.map((sku, index) => {
                    return (
                      <TableRow hover key={index}>
                        <TableCell>
                          <Typography variant="body2">{sku?.color || ''}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{sku?.size || ''}</Typography>
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`skus[${index}].seller_sku`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => <TextField {...field} label="SKU" fullWidth margin="normal" />}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`skus[${index}].price`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField {...field} label="Price" fullWidth margin="normal" type="number" />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`skus[${index}].stock_infos.available_stock`}
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField {...field} label="Số lượng" fullWidth margin="normal" type="number" />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <PopupState variant="popover" popupId="demo-popup-popover">
                            {(popupState) => (
                              <Box>
                                <Box variant="contained" {...bindTrigger(popupState)} className={'cursor-pointer'}>
                                  <Tooltip title="Xóa" placement="top">
                                    <IconButton>
                                      <SvgIcon>
                                        <DeleteIcon />
                                      </SvgIcon>
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                                <Popover
                                  {...bindPopover(popupState)}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  <Card className="p-3 rounded-md">
                                    <p className="mb-2 block font-semibold text-[14px]">Xác nhận đã xóa</p>

                                    <Stack direction="row" spacing={1} className="mt-2">
                                      <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                          handleDeleteSku(index);
                                          bindPopover(popupState).onClose();
                                        }}
                                      >
                                        Delete
                                      </Button>
                                      <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                          bindPopover(popupState).onClose();
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </Stack>
                                  </Card>
                                </Popover>
                              </Box>
                            )}
                          </PopupState>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              ) : (
                <>
                  <TableCell colSpan={6}>
                    <NoData className={'min-h-36'} />
                  </TableCell>
                </>
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card>

      {isModalOpen && (
        <ModalCreateVariation
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
          setValueOrigin={setValue}
        />
      )}
    </Card>
  );
};
