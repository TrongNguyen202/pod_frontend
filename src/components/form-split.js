'use client';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { optionsDesignType, PRICE_OPTIONS, PRICE_OPTIONS_BY_DESIGN_TYPE } from 'src/constants';
import { tokens } from 'src/locales/tokens';

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

  // State để track validation errors
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Thêm state để track xem user có đang edit description manually không
  const [isManuallyEditingDescription, setIsManuallyEditingDescription] = useState(false);

  // Định nghĩa các trường required
  const requiredFields = useMemo(
    () => ({
      title: true,
      images: true,
      price: true,
    }),
    [],
  );

  // Hàm validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate title
    if (requiredFields.title && (!formData.title || formData.title.trim() === '')) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    // Validate images
    if (requiredFields.images && (!formData.images || formData.images.length === 0)) {
      newErrors.images = 'Hình ảnh là bắt buộc';
    }

    // Validate price
    if (requiredFields.price && (!formData.price || formData.price === 0)) {
      newErrors.price = 'Giá là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, requiredFields]);

  // Validate khi formData thay đổi (chỉ khi đã attempt submit)
  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateForm();
    }
  }, [formData, hasAttemptedSubmit, validateForm]);

  const handleOpen = useCallback(() => {
    setFormData(normalizeInitialData(initialData, fields));
    setIsManuallyEditingDescription(false);
    setErrors({});
    setHasAttemptedSubmit(false);
    setOpen(true);
  }, [initialData, fields]);

  const handleClose = useCallback(() => {
    setFormData(normalizeInitialData(initialData, fields));
    setIsManuallyEditingDescription(false);
    setErrors({});
    setHasAttemptedSubmit(false);
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setOpen(false);
    }
  }, [initialData, fields, onCloseOverride]);

  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error khi user bắt đầu nhập
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      // Nếu user đang edit description manually, đánh dấu để không bị ghi đè
      if (name === 'description') {
        setIsManuallyEditingDescription(true);
      }
    },
    [errors],
  );

  const handleNumericInput = (fieldName) => (e) => {
    const value = e.target.value;
    if (value && !/^[0-9]*$/.test(value)) {
      e.preventDefault();
      return;
    }
    handleChange(fieldName, value);
  };

  const mergedDescription = useMemo(() => {
    const selectedTemplateIds = formData['templates'] || [];

    return selectedTemplateIds
      .map((id) => {
        const tpl = templatesData.find((t) => t.id === id);
        return tpl?.description || '';
      })
      .filter((desc) => desc.trim() !== '')
      .join('\n');
  }, [formData['templates'], templatesData]);

  const handleFormSubmit = useCallback(
    async (formData, status) => {
      setHasAttemptedSubmit(true);

      // Validate form trước khi submit
      const isValid = validateForm();

      if (!isValid) {
        return; // Không submit nếu form không hợp lệ
      }

      setIsSubmitting(true);

      const formDataToSubmit = new FormData();
      for (const key in formData) {
        let value = formData[key];

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

      try {
        await onSubmit?.(formDataToSubmit, status);
        handleClose();
      } catch (error) {
        console.error('Submit error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, formData, handleClose, validateForm],
  );

  // Chỉ tự động merge description khi:
  // 1. User chưa manually edit description
  // 2. Templates thay đổi
  useEffect(() => {
    if (!isManuallyEditingDescription) {
      const selectedTemplateIds = formData['templates'] || [];
      const mergedDescription = selectedTemplateIds
        .map((id) => {
          const t = templatesData.find((tpl) => tpl.id === id);
          return t?.description || '';
        })
        .filter((desc) => desc.trim() !== '')
        .join('\n');

      // Chỉ update nếu description thực sự thay đổi
      if (mergedDescription !== formData['description']) {
        setFormData((prev) => ({ ...prev, description: mergedDescription }));
      }
    }
  }, [formData['templates'], templatesData, isManuallyEditingDescription]);

  const productTypeMap = useMemo(() => {
    return productTypeData.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});
  }, [productTypeData]);

  const designTypeMap = useMemo(() => {
    return optionsDesignType.reduce((acc, curr) => {
      acc[curr.value] = curr.label;
      return acc;
    }, {});
  }, [optionsDesignType]);

  const templateMap = useMemo(() => {
    return templatesData.reduce((acc, curr) => {
      acc[curr.id] = curr.title;
      return acc;
    }, {});
  }, [templatesData]);

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
      setIsManuallyEditingDescription(false);
      setErrors({});
      setHasAttemptedSubmit(false);
    }
  }, [dialogOpen, initialData, fields]);

  // Thêm button để merge templates vào description theo ý muốn
  const handleMergeTemplates = useCallback(() => {
    const currentDescription = formData['description'] || '';
    const templateDescription = mergedDescription;

    // Merge mà không duplicate
    const finalDescription = currentDescription.trim()
      ? `${currentDescription}\n${templateDescription}`
      : templateDescription;

    handleChange('description', finalDescription);
  }, [formData, mergedDescription, handleChange]);

  const priceOptions = PRICE_OPTIONS_BY_DESIGN_TYPE[formData['designType']] || [];

  return (
    <>
      {buttonLabel && (
        <Box sx={{ display: 'inline-block', borderRadius: 2, overflow: 'hidden' }}>
          <Button {...buttonProps} onClick={handleOpen} sx={{ borderRadius: 0 }}>
            {buttonLabel}
          </Button>
        </Box>
      )}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth sx={{ height: '80vh', top: '15vh' }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '60%', pr: 1 }}>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  required
                  label={t(tokens.nav.title)}
                  type="text"
                  value={formData['title'] || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  InputLabelProps={{ required: true }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <span>{t(tokens.nav.description)}</span>
                  {mergedDescription && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleMergeTemplates}
                      sx={{ fontSize: '0.75rem', py: 0.5 }}
                    >
                      Thêm từ Templates
                    </Button>
                  )}
                </Box>
                <TextareaAutosize
                  aria-label="Description"
                  minRows={4}
                  placeholder={t(tokens.nav.description)}
                  style={{
                    width: '100%',
                    backgroundColor: '#fafafa',
                    padding: '8px',
                    border: `1px solid ${errors.description ? '#d32f2f' : '#e0e0e0'}`,
                    borderRadius: '4px',
                  }}
                  value={formData['description'] || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
                {errors.description && (
                  <Box sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>{errors.description}</Box>
                )}
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  fullWidth
                  required
                  label={t(tokens.nav.chosseImages)}
                  type="file"
                  inputProps={{ multiple: true, accept: 'image/*' }}
                  error={!!errors.images}
                  helperText={errors.images}
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
                  label={t(tokens.nav.design_type)}
                  SelectProps={{
                    renderValue: (selected) => designTypeMap[selected] || selected,
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
                  label={t(tokens.nav.product_type)}
                  SelectProps={{
                    renderValue: (selected) => productTypeMap[selected] || selected,
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
                  label={t(tokens.nav.quantity)}
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
                  label={t(tokens.nav.number)}
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
                  label={t(tokens.nav.deadline)}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData['completed_at'] ? new Date(formData['completed_at']).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('completed_at', e.target.value)}
                />
              </Box>
              <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  select
                  required
                  fullWidth
                  label={t(tokens.nav.price)}
                  SelectProps={{
                    renderValue: (selected) => PRICE_OPTIONS.find((opt) => opt.value === selected)?.label || selected,
                  }}
                  value={formData['price'] || ''}
                  onChange={(e) => handleChange('price', e.target.value)}
                  InputLabelProps={{ required: true }}
                  error={!!errors.price}
                  helperText={errors.price}
                >
                  {priceOptions.map((option, i) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ mb: 2, borderRadius: 1, bgcolor: '#fafafa' }}>
                <TextField
                  select
                  fullWidth
                  label={t(tokens.nav.templates)}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                      selected.map((v) => <Chip key={v} label={templateMap[v] || v} sx={{ mr: 0.5 }} />),
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
          <Button onClick={() => handleFormSubmit(formData, 'DRAFT')} variant="contained" disabled={isSubmitting}>
            {t(tokens.nav.submit_draft)}
          </Button>
          <Button onClick={() => handleFormSubmit(formData, 'NEW')} variant="contained" disabled={isSubmitting}>
            {t(tokens.nav.submit)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(FormDialogSplitLayout);
