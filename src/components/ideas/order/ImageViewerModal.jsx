import { Box, Modal } from '@mui/material';

const ImageViewerModal = ({ open, onClose, imageUrl }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <img
        src={imageUrl || ''}
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: 8,
          boxShadow: '0 0 10px #000',
          cursor: 'zoom-out',
        }}
      />
    </Box>
  </Modal>
);

export default ImageViewerModal;
