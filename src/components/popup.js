'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { tokens } from 'src/locales/tokens';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/system';

const normalizeInitialData = (initialData = {}, fields = []) => {
  const safeData = initialData || {};
  const normalized = { ...safeData };

  fields.forEach((field) => {
    if (field.type === 'select' && field.multiple && Array.isArray(safeData[field.name])) {
      const firstItem = safeData[field.name][0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        normalized[field.name] = safeData[field.name].map((item) => item.value);
      }
    }
  });

  return normalized;
};

// Memoized FieldRenderer to prevent unnecessary re-renders
const FieldRenderer = memo(({ field, formData, onChange, passwordVisibility, togglePasswordVisibility }) => {
  const isSelect = field.type === 'select';
  const isMultiple = !!field.multiple;
  const isPassword = field.type === 'password';
  const { t } = useTranslation();
  const labelsVie = {
    Title: t(tokens.nav.title),
    'Product Types': t(tokens.nav.product_type),
    'Default Design Type': t(tokens.nav.design_type),
  };

  return (
    <Grid item size={12}>
      {isSelect ? (
        <TextField
          select
          fullWidth
          required={field.required}
          label={labelsVie[field.label] || field.label}
          sx={{ minWidth: 200 }}
          SelectProps={{
            multiple: isMultiple,
            onClose: (event) => {
              // Ngăn dropdown đóng khi click vào delete icon
              if (event.target.closest('.MuiChip-deleteIcon')) {
                event.preventDefault();
              }
            },
            renderValue: (selected) =>
              isMultiple ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((v) => {
                    const label = field.options.find((o) => o.value === v)?.label || v;
                    const canDelete = selected.length > 1; // Chỉ cho phép xóa khi có > 1 phần tử

                    return (
                      <Chip
                        key={v}
                        label={label}
                        // Chỉ hiển thị onDelete khi có thể xóa
                        {...(canDelete && {
                          onDelete: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newValue = selected.filter((item) => item !== v);
                            onChange(field.name, newValue);
                          },
                        })}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                        sx={{
                          '& .MuiChip-deleteIcon': {
                            '&:hover': {
                              color: 'error.main',
                            },
                          },
                        }}
                      />
                    );
                  })}
                </Box>
              ) : (
                field.options.find((o) => o.value === selected)?.label || selected
              ),
          }}
          value={formData[field.name] || (isMultiple ? [] : '')}
          onChange={(e) => onChange(field.name, isMultiple ? e.target.value : e.target.value)}
          InputLabelProps={{ required: field.required }}
        >
          {field.options?.map((option, i) => {
            const isSelected = isMultiple
              ? formData[field.name]?.includes(option.value)
              : formData[field.name] === option.value;

            const isLastSelected = isMultiple && formData[field.name]?.length === 1 && isSelected;

            return (
              <MenuItem
                key={i}
                value={option.value}
                disabled={isLastSelected}
                sx={{
                  ...(isLastSelected && {
                    opacity: 0.5,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }),
                }}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </TextField>
      ) : (
        <TextField
          fullWidth
          required={field.required}
          label={labelsVie[field.label] || field.label}
          multiline={field.multiline}
          rows={field.rows || 1}
          type={isPassword ? (passwordVisibility[field.name] ? 'text' : 'password') : field.type || 'text'}
          value={formData[field.name] || ''}
          sx={{ minWidth: 200 }}
          onChange={(e) => onChange(field.name, e.target.value)}
          InputLabelProps={{ required: field.required }}
          InputProps={{
            endAdornment: isPassword && (
              <InputAdornment position="end">
                <IconButton onClick={() => togglePasswordVisibility(field.name)} edge="end">
                  {passwordVisibility[field.name] ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    </Grid>
  );
});

FieldRenderer.displayName = 'FieldRenderer';

const FormDialog = ({
  buttonLabel,
  title,
  fields = [],
  onSubmit,
  buttonProps = {},
  initialData = {},
  openOverride,
  onCloseOverride,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(normalizeInitialData(initialData, fields));
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [open, setOpen] = useState(false);

  // Memoized handlers
  const handleOpen = useCallback(() => {
    setFormData(normalizeInitialData(initialData, fields));
    setOpen(true);
  }, [initialData, fields]);

  const handleClose = useCallback(() => {
    setFormData(normalizeInitialData(initialData, fields));
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setOpen(false);
    }
  }, [initialData, fields, onCloseOverride]);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePasswordVisibility = useCallback((fieldName) => {
    setPasswordVisibility((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  }, []);

  const handleFormSubmit = useCallback(() => {
    onSubmit?.(formData);
    handleClose();
  }, [onSubmit, formData, handleClose]);

  useEffect(() => {
    const isOpen = typeof openOverride === 'boolean' ? openOverride : open;

    if (!isOpen) return;

    // Dùng JSON.stringify tránh tham chiếu mới mỗi lần render
    setFormData((prev) => {
      const normalized = normalizeInitialData(initialData, fields);
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(normalized);
      return hasChanged ? normalized : prev;
    });
  }, [open, openOverride, JSON.stringify(initialData), JSON.stringify(fields)]);

  const dialogOpen = typeof openOverride === 'boolean' ? openOverride : open;

  return (
    <>
      {buttonLabel && (
        <Button {...buttonProps} onClick={handleOpen}>
          {buttonLabel}
        </Button>
      )}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {fields.map((field, index) => (
              <FieldRenderer
                key={index}
                field={field}
                formData={formData}
                onChange={handleChange}
                passwordVisibility={passwordVisibility}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {t(tokens.nav.cancel)}
          </Button>
          <Button onClick={handleFormSubmit} variant="contained">
            {t(tokens.nav.submit)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(FormDialog);
