import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useState } from 'react';

export default function ModalAssignDesigner({
  open = true,
  title,
  fields,
  onSubmit,
  onClose,
  buttonLabel,
  buttonProps,
}) {
  const [formData, setFormData] = useState({});

  const handleChange = (name) => (event) => {
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => {
          if (field.type === 'select') {
            return (
              <FormControl fullWidth sx={{ mt: 2 }} key={field.name}>
                <InputLabel>{field.label}</InputLabel>
                <Select value={formData[field.name] || ''} label={field.label} onChange={handleChange(field.name)}>
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          return null;
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} {...buttonProps}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
