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

const normalizeInitialData = (initialData = {}, fields = []) => {
  const safeData = initialData || {};
  const normalized = { ...safeData };

  fields.forEach((field) => {
    if (
      field.type === 'select' &&
      field.multiple &&
      Array.isArray(safeData[field.name])
    ) {
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

  return (
    <Grid item size={12}>
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
          onChange={(e) => onChange(field.name, isMultiple ? e.target.value : e.target.value)}
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
