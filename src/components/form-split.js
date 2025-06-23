import React, { useState, useCallback, useEffect, memo } from 'react';
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
  TextareaAutosize,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import { Box } from '@mui/system';
import { optionsDesignType } from 'src/constants';
import handleAmountFormat from 'src/utils/amount-vnd';

const normalizeInitialData = (initialData = {}, fields = []) => {
  const normalized = { ...initialData };
  fields.forEach((field) => {
    if (field.type === 'select' && field.multiple && Array.isArray(initialData[field.name])) {
      const firstItem = initialData[field.name][0];
      if (typeof firstItem === 'object' && firstItem !== null) {
        normalized[field.name] = initialData[field.name].map((item) => item.value);
      }
    }
    if (field.default !== undefined && normalized[field.name] === undefined) {
      normalized[field.name] = field.default;
    }
  });
  return normalized;
};

const FormDialogSplitLayout = ({
  buttonLabel,
  title,
  fields = [],
  onSubmit,
  buttonProps = {},
  initialData = {},
  productTypeData = [],
  templatesData = [],
  openOverride,
  onCloseOverride,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(() => normalizeInitialData(initialData, fields));
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionByTemplates, setDescriptionByTemplates] = useState('');

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

  const handleNumericInput = (fieldName) => (e) => {
    const value = e.target.value;
    if (value && !/^[0-9]*$/.test(value)) {
      e.preventDefault();
      return;
    }
    handleChange(fieldName, value);
  };

  const handleFormSubmit = useCallback(
    async (status) => {
      setIsSubmitting(true);

      const selectedTemplateIds = formData['templates'] || [];
      const mergedDescription = selectedTemplateIds
        .map((id) => {
          const t = templatesData.find((tpl) => tpl.id === id);
          return t?.description || '';
        })
        .filter((desc) => desc.trim() !== '')
        .join('\n');

      setDescriptionByTemplates(mergedDescription);

      const formDataToSubmit = new FormData();
      for (const key in formData) {
        let value = formData[key];
        if (key === 'description') {
          value = mergedDescription;
        }

        if (Array.isArray(value)) {
          value.forEach((file) => {
            formDataToSubmit.append(`${key}[]`, file);
          });
        } else if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else {
          formDataToSubmit.append(key, value);
        }
      }

      await onSubmit?.(formDataToSubmit, status);
      setIsSubmitting(false);
      handleClose();
    },
    [onSubmit, formData, handleClose, templatesData],
  );

  // Tự động cập nhật khi chọn templates
  useEffect(() => {
    const selectedTemplateIds = formData['templates'] || [];
    const mergedDescription = selectedTemplateIds
      .map((id) => {
        const t = templatesData.find((tpl) => tpl.id === id);
        return t?.description || '';
      })
      .filter((desc) => desc.trim() !== '')
      .join('\n');

    setDescriptionByTemplates(mergedDescription);

    handleChange('description', mergedDescription);
  }, [formData['templates'], templatesData]);

  const dialogOpen = typeof openOverride === 'boolean' ? openOverride : open;

  useEffect(() => {
    if (dialogOpen) {
      const normalized = normalizeInitialData(initialData, fields);
      setFormData((prev) => {
        const prevString = JSON.stringify(prev);
        const newString = JSON.stringify(normalized);
        if (prevString === newString) return prev;
        return normalized;
      });
    }
  }, [dialogOpen, initialData, fields]);

  const handlePriceInput = (key) => (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({
      ...prev,
      [key]: raw,
    }));
  };

  return (
    <>
      {buttonLabel && (
        <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden' }}>
          <Button {...buttonProps} onClick={handleOpen} sx={{ borderRadius: 0 }}>
            {buttonLabel}
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', pr: 1 }}>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  required
                  label="Title"
                  type="text"
                  value={formData['title'] || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  InputLabelProps={{ required: true }}
                />
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextareaAutosize
                  aria-label="Description"
                  minRows={4}
                  placeholder="Description"
                  style={{
                    width: '100%',
                    backgroundColor: '#fafafa',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                  }}
                  value={formData['description'] || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  required
                  label="Images"
                  type="file"
                  inputProps={{ multiple: true, accept: 'image/*' }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleChange('images', files);
                  }}
                />
                {formData['images'] && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, gap: 1 }}>
                    {(Array.isArray(formData['images']) ? formData['images'] : [formData['images']]).map(
                      (file, idx) => {
                        const objectUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
                        return (
                          <Box
                            key={idx}
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: '1px solid #ccc',
                              position: 'relative',
                            }}
                          >
                            <img
                              src={objectUrl}
                              alt={file.name || 'image'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        );
                      },
                    )}
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '30%', pl: 1 }}>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  select
                  fullWidth
                  label="Design Type"
                  SelectProps={{
                    renderValue: (selected) => optionsDesignType.find((o) => o.value === selected)?.label || selected,
                  }}
                  value={formData['designType'] || ''}
                  onChange={(e) => handleChange('designType', e.target.value)}
                >
                  {optionsDesignType.map((option, i) => (
                    <MenuItem key={i} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  select
                  fullWidth
                  label="Product Type"
                  SelectProps={{
                    renderValue: (selected) => productTypeData.find((o) => o.id === selected)?.name || selected,
                  }}
                  value={formData['productTypeId'] || ''}
                  onChange={(e) => handleChange('productTypeId', e.target.value)}
                >
                  {productTypeData.map((option, i) => (
                    <MenuItem key={i} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="text"
                  value={formData['quantity'] !== undefined ? formData['quantity'] : 1}
                  onChange={handleNumericInput('quantity')}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    onKeyPress: (e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  label="Number"
                  type="text"
                  value={formData['number'] !== undefined ? formData['number'] : 1}
                  onChange={handleNumericInput('number')}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    onKeyPress: (e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData['completed_at'] ? new Date(formData['completed_at']).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('completed_at', e.target.value)}
                />
              </Box>
              <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  label="Price"
                  type="text"
                  value={handleAmountFormat(formData['price'])}
                  onChange={handlePriceInput('price')}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    onKeyPress: (e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  select
                  fullWidth
                  label="Template"
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected.map((v) => {
                        const label = templatesData.find((o) => o.id === v)?.title || v;
                        return <Chip key={v} label={label} sx={{ mr: 0.5 }} />;
                      }),
                  }}
                  value={formData['templates'] || []}
                  onChange={(e) => handleChange('templates', e.target.value)}
                >
                  {templatesData.map((option, i) => (
                    <MenuItem key={i} value={option.id}>
                      {option.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {t(tokens.nav.cancel)}
          </Button>
          <Button onClick={() => handleFormSubmit('DRAFT')} variant="contained" disabled={isSubmitting}>
            {t(tokens.nav.submit_draft)}
          </Button>
          <Button onClick={() => handleFormSubmit('NEW')} variant="contained" disabled={isSubmitting}>
            {t(tokens.nav.submit)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(FormDialogSplitLayout);
