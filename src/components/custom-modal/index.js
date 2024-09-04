import { Modal } from "@mui/material";
import { Box } from "@mui/system";

export const ModalCustom = (props) => {
  const { isOpen, handleClose, children } = props;

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
        {children}
      </Box>
    </Modal>
  );
};
