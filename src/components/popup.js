import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';

const normalizeInitialData = (initialData, fields) => {
  const normalized = { ...initialData };

  fields.forEach((field) => {
    if (field.type === 'select' && field.multiple && Array.isArray(initialData[field.name])) {
      // Nếu là array của object → chuyển sang array của string `value`
      const firstItem = initialData[field.name][0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        normalized[field.name] = initialData[field.name].map((item) => item.value);
      }
    }
  });

  return normalized;
};

export default function FormDialog({ buttonLabel, title, fields = [], onSubmit, buttonProps = {}, initialData = {} }) {
  const [formData, setFormData] = useState(initialData || {});
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setFormData(normalizeInitialData(initialData, fields));
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    onSubmit?.(formData);
    handleClose();
  };

  useEffect(() => {
    if (open) {
      setFormData(normalizeInitialData(initialData, fields));
    }
  }, [open, initialData, fields]);

  return (
    <>
      <Button {...buttonProps} onClick={handleOpen}>
        {buttonLabel}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {fields.map((field, index) => {
              const isSelect = field.type === 'select';
              const isMultiple = !!field.multiple;
              return (
                <Grid item size={12} key={index}>
                  {isSelect ? (
                    <TextField
                      select
                      fullWidth
                      required={field.required}
                      label={field.label}
                      sx={{ minWidth: 200 }}
                      SelectProps={{
                        multiple: isMultiple,
                        renderValue: (selected) =>
                          isMultiple
                            ? selected.map((v) => {
                                const label = field.options.find((o) => o.value === v)?.label || v;
                                return <Chip key={v} label={label} sx={{ mr: 0.5 }} />;
                              })
                            : field.options.find((o) => o.value === selected)?.label || selected,
                      }}
                      value={formData[field.name] || (isMultiple ? [] : '')}
                      onChange={(e) => handleChange(field.name, isMultiple ? e.target.value : e.target.value)}
                      InputLabelProps={{ required: field.required }}
                    >
                      {field.options?.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      required={field.required}
                      label={field.label}
                      multiline={field.multiline}
                      rows={field.rows || 1}
                      value={formData[field.name] || ''}
                      sx={{ minWidth: 200 }}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      InputLabelProps={{ required: field.required }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
