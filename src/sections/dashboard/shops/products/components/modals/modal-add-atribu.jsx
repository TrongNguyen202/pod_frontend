import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const ModalAddAtribu = (props) => {
  const { isOpen, handleClose, name, setValueSize, setValueColor } = props;
  const [atribu, setAtribu] = useState("");

  const handleOnAddAtribu = () => {
    if (atribu) {
      if (name === "size") {
        setValueSize(atribu);
      } else {
        setValueColor(atribu);
      }
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        className="rounded-2xl overflow-hidden"
      >
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            p: 3,
            display: "block",
            minWidth: 400,
          }}
        >
          <Typography variant="h6" className="pb-2">
            Thêm {`${name}`}
          </Typography>

          <TextField
            label={`${name}`}
            onChange={(e) => setAtribu(e.target.value)}
            variant="filled"
            fullWidth
            margin="normal"
            required
          />

          <Box className={"mt-4"}>
            <Button
              onClick={handleOnAddAtribu}
              variant="contained"
              className="mb-3"
              size="small"
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};
