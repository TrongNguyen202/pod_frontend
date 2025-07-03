'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Telegram as TelegramIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { createUserAccount } from 'src/redux/reducers/user';

const roles = [
  { id: 'e02c4f2d-2482-4327-8cd1-4a8f090e6159', lable: 'Admin', name: 'admin' },
  { id: '3c6c55d4-8e21-40f4-8391-2a561e28599f', lable: 'Customer', name: 'customer' },
  { id: '439c3f44-de92-4cd3-a11e-994b37082987', lable: 'Designer', name: 'designer' },
];

const statusOptions = [
  { value: 1, label: 'Hoạt động' },
  { value: 0, label: 'Không hoạt động' },
  { value: -1, label: 'Chờ duyệt' },
];

export default function ActivateUserDialog({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    password: '',
    phone: '',
    status: 1,
    link_telegram: '',
    role_id: '',
    role_name: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form completely when dialog opens
      setFormData({
        email: '',
        userName: '',
        password: '',
        phone: '',
        status: 1,
        link_telegram: '',
        role_id: '',
        role_name: '',
      });
      setErrors({});
      setShowPassword(false);
    }
  }, [open]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validateUserName = (userName) => {
  //   const userNameRegex = /^[a-zA-Z0-9_]{3,20}$/
  //   return userNameRegex.test(userName)
  // }

  // const validatePassword = (password) => {
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return passwordRegex.test(password);
  // };

  const validatePhone = (phone) => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }

    // Update role_name when role_id changes
    if (field === 'role_id') {
      const selectedRole = roles.find((role) => role.id === value);
      setFormData((prev) => ({
        ...prev,
        role_name: selectedRole ? selectedRole.name : '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Username validation
    // if (!formData.userName.trim()) {
    //   newErrors.userName = "Tên người dùng là bắt buộc"
    // } else if (!validateUserName(formData.userName)) {
    //   newErrors.userName = "Tên người dùng phải có 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới"
    // }

    // Password validation
    // if (!formData.password.trim()) {
    //   newErrors.password = 'Mật khẩu là bắt buộc';
    // } else if (!validatePassword(formData.password)) {
    //   newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    // }

    // Phone validation (optional)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    // Role validation
    if (!formData.role_id) {
      newErrors.role_id = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormData = () => {
    setFormData({
      email: '',
      userName: '',
      password: '',
      phone: '',
      status: 1,
      link_telegram: '',
      role_id: '',
      role_name: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowCloseConfirmation(false);
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const userData = {
          email: formData.email,
          userName: formData.userName,
          // password: formData.password,
          password: 'Sun@123',
          phone: formData.phone || null,
          status: formData.status,
          link_telegram: formData.link_telegram || null,
          role_id: formData.role_id,
          role_name: formData.role_name,
        };

        await dispatch(createUserAccount(userData)).unwrap();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }

        handleClose();
      } catch (error) {
        console.error('Error creating user:', error);
        // You can add error handling here (show toast, etc.)
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      email: '',
      userName: '',
      password: '',
      phone: '',
      status: 1,
      link_telegram: '',
      role_id: '',
      role_name: '',
    });
    setErrors({});
    setShowPassword(false);
    setShowCloseConfirmation(false);
    onClose();
  };

  const handleCloseClick = () => {
    setShowCloseConfirmation(true);
  };

  const handleConfirmClose = () => {
    handleClose(); // This will reset form and close dialog
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false); // Just hide confirmation, don't reset anything
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}} // Disable clicking outside to close
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}s
        disableEscapeKeyDown // Disable ESC key to close
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <CheckCircleIcon color="primary" />
              <Typography variant="h6">Kích hoạt tài khoản người dùng</Typography>
            </Box>
            <IconButton onClick={handleCloseClick} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" mt={1}>
            Kích hoạt tài khoản
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 3 }}>
            Vui lòng điền đầy đủ thông tin để kích hoạt tài khoản người dùng. Tất cả các trường có dấu (*) là bắt buộc.
          </Alert>

          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email *"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email || 'Địa chỉ email của người dùng'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Username */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên người dùng *"
                value={formData.userName}
                onChange={handleInputChange('userName')}
                error={!!errors.userName}
                // helperText={errors.userName || "3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Password */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mật khẩu *"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password || 'Ít nhất 8 ký tự, bao gồm chữ hoa, thường, số và ký tự đặc biệt'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid> */}

            {/* Phone */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone || 'Tùy chọn - 10-11 chữ số'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role_id}>
                <InputLabel>Chọn vai trò *</InputLabel>
                <Select
                  value={formData.role_id}
                  onChange={handleInputChange('role_id')}
                  label="Chọn vai trò *"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="" disabled>
                    <em>Chọn vai trò</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.lable}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role_id && <FormHelperText>{errors.role_id}</FormHelperText>}
                {!errors.role_id && <FormHelperText>Chọn vai trò cho người dùng</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select value={formData.status} onChange={handleInputChange('status')} label="Trạng thái">
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Trạng thái tài khoản sau khi kích hoạt</FormHelperText>
              </FormControl>
            </Grid>

            {/* Telegram Link */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link Telegram"
                value={formData.link_telegram}
                onChange={handleInputChange('link_telegram')}
                placeholder="https://t.me/username"
                helperText="Tùy chọn - Liên kết Telegram của người dùng"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TelegramIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseClick} color="inherit" size="large">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CheckCircleIcon />}
          >
            Kích hoạt tài khoản
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Confirmation Dialog */}
      <Dialog open={showCloseConfirmation} onClose={handleCancelClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="warning" />
            <Typography variant="h6">Xác nhận thoát</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Bạn có chắc chắn muốn thoát? Mọi thay đổi chưa được lưu sẽ bị mất.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleConfirmClose} variant="contained" color="warning">
            Thoát
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
