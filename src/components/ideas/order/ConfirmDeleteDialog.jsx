import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t(tokens.nav.confirm)}</DialogTitle>
      <DialogContent>
        <Typography>{t(tokens.nav.message_delete)}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t(tokens.nav.cancel)}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t(tokens.nav.submit)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
