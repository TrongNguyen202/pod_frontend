"use client"

import { useState, useEffect } from "react"
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  Divider,
  InputAdornment
} from "@mui/material"
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckCircleIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon
} from "@mui/icons-material"

export default function EditProfileDrawer({ open, onClose, userData, onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    link_telegram: "",
    bankAccountName: "",
    bankNumber: "",
    bankName: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData?.username || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
        link_telegram: userData?.link_telegram || "",
        bankAccountName: userData?.bankAccountName || "",
        bankNumber: userData?.bankNumber || "",
        bankName: userData?.bankName || "",
      })
    }
  }, [userData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (successMessage) {
      setSuccessMessage("")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Tên người dùng không được để trống"
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (formData.phone && !/^[+]?[0-9\s\-()]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    }

    // if (formData.link_telegram && !formData.link_telegram.startsWith("@")) {
    //   newErrors.link_telegram = "Link Telegram phải bắt đầu bằng @"
    // }

    if (formData.bankAccountName && formData.bankAccountName.length < 2) {
      newErrors.bankAccountName = "Tên chủ tài khoản phải có ít nhất 2 ký tự"
    }

    if (formData.bankNumber && !/^[0-9]{8,20}$/.test(formData.bankNumber)) {
      newErrors.bankNumber = "Số tài khoản phải từ 8-20 chữ số"
    }

    if (formData.bankName && formData.bankName.length < 2) {
      newErrors.bankName = "Tên ngân hàng phải có ít nhất 2 ký tự"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSubmit(formData)
      setSuccessMessage("Cập nhật thông tin thành công!")
      setTimeout(() => {
        setSuccessMessage("")
        onClose()
      }, 2000)
    } catch (error) {
      setErrors({ submit: "Có lỗi xảy ra khi cập nhật thông tin" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setErrors({})
    setSuccessMessage("")
    onClose()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange("avatar", e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 400 } }
      }}
    >
      <Box sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6">Chỉnh sửa thông tin</Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Cập nhật thông tin cá nhân của bạn. Nhấn lưu để áp dụng thay đổi.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Avatar Section */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box position="relative">
            <Avatar
              src={formData?.avatar}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {formData?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <IconButton
              component="label"
              sx={{
                position: "absolute",
                bottom: 8,
                right: -8,
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": { backgroundColor: "primary.dark" },
                width: 32,
                height: 32
              }}
            >
              <CameraIcon fontSize="small" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Nhấn vào icon camera để thay đổi ảnh đại diện
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            label="Tên người dùng"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            error={!!errors.username}
            helperText={errors.username}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email || "Email không thể chỉnh sửa"}
            margin="normal"
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Telegram"
            value={formData.link_telegram}
            onChange={(e) => handleInputChange("link_telegram", e.target.value)}
            error={!!errors.link_telegram}
            helperText={errors.link_telegram}
            margin="normal"
            placeholder="@username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TelegramIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Thông tin ngân hàng
            </Typography>
          </Divider>

          <TextField
            fullWidth
            label="Tên chủ tài khoản"
            value={formData.bankAccountName}
            onChange={(e) => handleInputChange("bankAccountName", e.target.value)}
            error={!!errors.bankAccountName}
            helperText={errors.bankAccountName}
            margin="normal"
            placeholder="Nguyễn Văn A"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Số tài khoản"
            value={formData.bankNumber}
            onChange={(e) => handleInputChange("bankNumber", e.target.value)}
            error={!!errors.bankNumber}
            helperText={errors.bankNumber}
            margin="normal"
            placeholder="1234567890"
            inputProps={{ maxLength: 20 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CardIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Tên ngân hàng"
            value={formData.bankName}
            onChange={(e) => handleInputChange("bankName", e.target.value)}
            error={!!errors.bankName}
            helperText={errors.bankName}
            margin="normal"
            placeholder="Vietcombank, BIDV, Techcombank..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BankIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Footer */}
        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            fullWidth
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}