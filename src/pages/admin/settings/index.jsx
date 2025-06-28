'use client';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Notifications, Security, Payment, Email, Edit, Delete, Add } from '@mui/icons-material';
import AdminLayout from '../../../layouts/admin/layout';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
);

const EmailTemplateDialog = ({ open, onClose, template }) => {
  const [subject, setSubject] = useState(template?.subject || '');
  const [content, setContent] = useState(template?.content || '');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{template ? 'Chỉnh sửa mẫu email' : 'Thêm mẫu email mới'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Tiêu đề"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          fullWidth
          label="Nội dung"
          multiline
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained">Lưu</Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    siteName: 'POD Platform',
    siteDescription: 'Nền tảng thiết kế POD hàng đầu',
    adminEmail: 'admin@podplatform.com',
    supportEmail: 'support@podplatform.com',
    autoApproveUsers: false,
    autoApproveTransactions: false,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,png,pdf,ai,psd',
    commissionRate: 15,
    minWithdrawal: 100000,
    maxWithdrawal: 10000000,
  });

  const [emailTemplateDialog, setEmailTemplateDialog] = useState({ open: false, template: null });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const emailTemplates = [
    { id: 1, name: 'Chào mừng người dùng mới', subject: 'Chào mừng đến với POD Platform', type: 'welcome' },
    { id: 2, name: 'Xác nhận giao dịch', subject: 'Xác nhận giao dịch thành công', type: 'transaction' },
    { id: 3, name: 'Thông báo dự án mới', subject: 'Bạn có dự án mới', type: 'project' },
    { id: 4, name: 'Nhắc nhở thanh toán', subject: 'Nhắc nhở thanh toán', type: 'payment' },
  ];

  const handleSaveSettings = () => {
    // Implement save logic
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <Box>
        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Cài đặt đã được lưu thành công!
          </Alert>
        )}

        <Card>
          <CardContent>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Cài đặt chung" />
              <Tab label="Thông báo" />
              <Tab label="Bảo mật" />
              <Tab label="Thanh toán" />
              <Tab label="Email Templates" />
            </Tabs>

            {/* General Settings */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên website"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Mô tả website"
                    multiline
                    rows={3}
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email admin"
                    value={settings.adminEmail}
                    onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email hỗ trợ"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cài đặt tự động
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoApproveUsers}
                        onChange={(e) => handleSettingChange('autoApproveUsers', e.target.checked)}
                      />
                    }
                    label="Tự động duyệt tài khoản mới"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoApproveTransactions}
                        onChange={(e) => handleSettingChange('autoApproveTransactions', e.target.checked)}
                      />
                    }
                    label="Tự động duyệt giao dịch"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Chế độ bảo trì"
                    sx={{ display: 'block' }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Notifications />
                    Cài đặt thông báo
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Thông báo qua Email"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="Thông báo qua SMS"
                    sx={{ display: 'block' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cài đặt file
                  </Typography>
                  <TextField
                    fullWidth
                    label="Kích thước file tối đa (MB)"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', Number.parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Định dạng file cho phép"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                    helperText="Phân cách bằng dấu phẩy (vd: jpg,png,pdf)"
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                Cài đặt bảo mật
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Các cài đặt bảo mật giúp bảo vệ hệ thống khỏi các mối đe dọa
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Thời gian hết hạn session (phút)"
                    type="number"
                    defaultValue={30}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Số lần đăng nhập sai tối đa"
                    type="number"
                    defaultValue={5}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Bắt buộc xác thực 2 bước"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Ghi log hoạt động"
                    sx={{ display: 'block' }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Payment Settings */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Payment />
                Cài đặt thanh toán
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tỷ lệ hoa hồng (%)"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleSettingChange('commissionRate', Number.parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Số tiền rút tối thiểu (VND)"
                    type="number"
                    value={settings.minWithdrawal}
                    onChange={(e) => handleSettingChange('minWithdrawal', Number.parseInt(e.target.value))}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Số tiền rút tối đa (VND)"
                    type="number"
                    value={settings.maxWithdrawal}
                    onChange={(e) => handleSettingChange('maxWithdrawal', Number.parseInt(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Phương thức thanh toán
                  </Typography>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Chuyển khoản ngân hàng"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Ví điện tử"
                    sx={{ display: 'block', mb: 1 }}
                  />
                  <FormControlLabel control={<Switch />} label="Thẻ tín dụng" sx={{ display: 'block' }} />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Email Templates */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email />
                  Mẫu Email
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setEmailTemplateDialog({ open: true, template: null })}
                >
                  Thêm mẫu
                </Button>
              </Box>
              <List>
                {emailTemplates.map((template) => (
                  <ListItem key={template.id} divider>
                    <ListItemText primary={template.name} secondary={template.subject} />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => setEmailTemplateDialog({ open: true, template })} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<Save />} onClick={handleSaveSettings} size="large">
                Lưu cài đặt
              </Button>
            </Box>
          </CardContent>
        </Card>

        <EmailTemplateDialog
          open={emailTemplateDialog.open}
          onClose={() => setEmailTemplateDialog({ open: false, template: null })}
          template={emailTemplateDialog.template}
        />
      </Box>
    </AdminLayout>
  );
}
