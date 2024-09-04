import { Box, Dialog, Typography } from '@mui/material';
import { ProductCreateAddVariationForm } from '../product-create-variation-form';

export const ModalCreateVariation = (props) => {
  const { isOpen, handleClose, setValueOrigin } = props;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="rounded-2xl overflow-hidden"
      >
        <Box
          sx={{
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
            p: 3,
            display: 'block',
            minWidth: 600,
          }}
        >
          <Typography variant="h6" className="pb-6">
            Thêm giá trị thuộc tính
          </Typography>
          <ProductCreateAddVariationForm setValueOrigin={setValueOrigin} closeModal={handleClose} />
        </Box>
      </Box>
    </Dialog>
  );
};
