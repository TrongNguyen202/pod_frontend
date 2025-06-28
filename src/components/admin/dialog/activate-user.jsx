"use client"

import { useState, useEffect } from "react"
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
} from "@mui/material"
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
} from "@mui/icons-material"

const roles = [
  { id: "1", name: "User" },
  { id: "2", name: "Designer" },
  { id: "3", name: "Admin" },
]

const statusOptions = [
  { value: 1, label: "Hoạt động" },
  { value: 0, label: "Không hoạt động" },
  { value: 2, label: "Chờ duyệt" },
]

export default function ActivateUserDialog({ open, onClose, onSubmit, userEmail = "" }) {
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    phone: "",
    status: 1,
    link_telegram: "",
    role_id: "",
    role_name: "",
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData({
        email: userEmail || "",
        userName: "",
        password: "",
        phone: "",
        status: 1,
        link_telegram: "",
        role_id: "1",
        role_name: "User",
      })
      setErrors({})
      setShowPassword(false)
    }
  }, [open, userEmail])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUserName = (userName) => {
    const userNameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return userNameRegex.test(userName)
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
  }

  const validatePhone = (phone) => {
    if (!phone) return true // Phone is optional
    const phoneRegex = /^[0-9]{10,11}$/
    return phoneRegex.test(phone)
  }

  const handleInputChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }

    // Update role_name when role_id changes
    if (field === "role_id") {
      const selectedRole = roles.find((role) => role.id === value)
      setFormData((prev) => ({
        ...prev,
        role_name: selectedRole ? selectedRole.name : "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    // Username validation
    if (!formData.userName.trim()) {
      newErrors.userName = "Tên người dùng là bắt buộc"
    } else if (!validateUserName(formData.userName)) {
      newErrors.userName = "Tên người dùng phải có 3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới"
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    }

    // Phone validation (optional)
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số"
    }

    // Role validation
    if (!formData.role_id) {
      newErrors.role_id = "Vui lòng chọn vai trò"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      email: "",
      userName: "",
      password: "",
      phone: "",
      status: 1,
      link_telegram: "",
      role_id: "",
      role_name: "",
    })
    setErrors({})
    setShowPassword(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon color="primary" />
          <Typography variant="h6">Kích hoạt tài khoản người dùng</Typography>
        </Box>
        {userEmail && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Kích hoạt tài khoản cho: <strong>{userEmail}</strong>
          </Typography>
        )}
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
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email || "Địa chỉ email của người dùng"}
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
              onChange={handleInputChange("userName")}
              error={!!errors.userName}
              helperText={errors.userName || "3-20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới"}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mật khẩu *"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!errors.password}
              helperText={errors.password || "Ít nhất 8 ký tự, bao gồm chữ hoa, thường, số và ký tự đặc biệt"}
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
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              error={!!errors.phone}
              helperText={errors.phone || "Tùy chọn - 10-11 chữ số"}
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
              <InputLabel>Vai trò *</InputLabel>
              <Select
                value={formData.role_id}
                onChange={handleInputChange("role_id")}
                label="Vai trò *"
                startAdornment={
                  <InputAdornment position="start">
                    <BadgeIcon color="action" />
                  </InputAdornment>
                }
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
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
              <Select value={formData.status} onChange={handleInputChange("status")} label="Trạng thái">
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
              onChange={handleInputChange("link_telegram")}
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
        <Button onClick={handleClose} color="inherit" size="large">
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" size="large" startIcon={<CheckCircleIcon />}>
          Kích hoạt tài khoản
        </Button>
      </DialogActions>
    </Dialog>
  )
}
