import React, { useState } from 'react';
import { Avatar, Button, Card, CardContent, Chip, Container, IconButton, Typography, Box } from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  MonetizationOn as CoinIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Delete as DeletedIcon,
} from '@mui/icons-material';
import EditProfileDrawer from 'src/components/drawer/edit-profile-drawer';
import PageLayout from '../../components/ideas/page-layout';
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { fetchUserByEmail, updateUserProfile } from '../../redux/reducers/user';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { data: userData } = useAppSelector((state) => state.users.userInfo);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const profileUpdateData = {
        email: updatedData.email,
        username: updatedData.username,
        phone: updatedData.phone,
        link_telegram: updatedData.link_telegram,
        bankName: updatedData.bankName,
        bankNumber: updatedData.bankNumber,
        bankAccountName: updatedData.bankAccountName,
      };

      // Dispatch action update profile
      const result = await dispatch(updateUserProfile(profileUpdateData));

      if (updateUserProfile.fulfilled.match(result)) {
        toast.success('Cập nhật thông tin thành công!');
        await dispatch(fetchUserByEmail({ email: updatedData.email }));
        setIsEditProfileOpen(false);
      } else {
        toast.error('Cập nhật thông tin thất bại!');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hàm xử lý trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case 1:
        return { label: 'Hoạt động', color: '#15803d', icon: <ActiveIcon /> };
      case 0:
        return { label: 'Không hoạt động', color: '#dc2626', icon: <InactiveIcon /> };
      case -1:
        return { label: 'Đã xóa', color: '#6b7280', icon: <DeletedIcon /> };
      default:
        return { label: 'Không xác định', color: '#6b7280', icon: <InactiveIcon /> };
    }
  };

  const statusInfo = getStatusInfo(userData?.status);

  const InfoItem = ({ icon, label, value, action }) => (
    <Box
      sx={{
        backgroundColor: '#f3f4f6',
        padding: 2,
        borderRadius: '12px',
        marginBottom: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        minHeight: '80px',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ fontSize: '14px', color: '#6b7280' }}>{label}</Box>
        <Box sx={{ fontSize: '16px', fontWeight: 500, color: '#1f2937' }}>{value}</Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );

  return (
    <PageLayout>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Profile Card */}
          <Box
            sx={{
              background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
              color: 'white',
              padding: 3,
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Avatar
                  src={userData?.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '4px solid white',
                    fontSize: '24px',
                  }}
                >
                  {userData?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {userData?.username}
                  </Typography>
                  <Chip
                    icon={<SecurityIcon />}
                    label={userData?.role_name}
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'white',
                    color: '#1d4ed8',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    boxShadow: 3,
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                      color: '#1e3a8a',
                    },
                    transition: 'all 0.2s',
                  }}
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditProfileOpen(true)}
                >
                  Chỉnh sửa
                </Button>
              </Box>
            </Box>
          </Box>

          <Card
            sx={{
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              boxShadow: 2,
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { md: 'repeat(3, 1fr)' },
                  gap: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                    Thông tin cơ bản
                  </Typography>
                  <InfoItem
                    icon={<PersonIcon sx={{ color: '#2563eb' }} />}
                    label="Tên người dùng"
                    value={userData?.username}
                  />
                  <InfoItem icon={<EmailIcon sx={{ color: '#2563eb' }} />} label="Email" value={userData?.email} />
                  <InfoItem
                    icon={<SecurityIcon sx={{ color: statusInfo.color }} />}
                    label="Trạng thái"
                    value={
                      <Chip
                        label={statusInfo.label}
                        variant="outlined"
                        size="small"
                        sx={{ color: statusInfo.color, borderColor: statusInfo.color }}
                        icon={statusInfo.icon}
                      />
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                    Thông tin liên hệ
                  </Typography>
                  <InfoItem
                    icon={<PhoneIcon sx={{ color: '#15803d' }} />}
                    label="Số điện thoại"
                    value={userData?.phone}
                  />
                  <InfoItem
                    icon={<TelegramIcon sx={{ color: '#3b82f6' }} />}
                    label="Telegram"
                    value={userData?.link_telegram}
                  />
                  <InfoItem
                    icon={<SecurityIcon sx={{ color: '#7c3aed' }} />}
                    label="Vai trò"
                    value={<Chip label={userData?.role_name} variant="outlined" size="small" />}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                    Thông tin ngân hàng
                  </Typography>
                  <InfoItem
                    icon={<PersonIcon sx={{ color: '#059669' }} />}
                    label="Chủ tài khoản"
                    value={userData?.bankAccountName}
                  />
                  <InfoItem
                    icon={<BankIcon sx={{ color: '#059669' }} />}
                    label="Ngân hàng"
                    value={userData?.bankName}
                  />
                  <InfoItem
                    icon={<CardIcon sx={{ color: '#059669' }} />}
                    label="Số tài khoản"
                    value={userData?.bankNumber}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
              gap: 2,
              marginTop: 3,
            }}
          >
            {[
              { value: formatCurrency(userData?.coin), label: 'Số dư hiện tại', color: '#f59e0b' },
              { value: statusInfo.label, label: 'Trạng thái tài khoản', color: statusInfo.color },
              { value: userData?.bankName, label: 'Ngân hàng', color: '#059669' },
              { value: userData?.role_name?.toUpperCase(), label: 'Vai trò', color: '#7c3aed' },
            ].map((item, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: '12px',
                  boxShadow: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: item.color, fontSize: { xs: '14px', sm: '18px' } }}
                  >
                    {item.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', marginTop: 0.5 }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Drawer */}
          <EditProfileDrawer
            open={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            userData={userData}
            onSubmit={handleUpdateProfile}
          />
        </Container>
      </Box>
    </PageLayout>
  );
}
