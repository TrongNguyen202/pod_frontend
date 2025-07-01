import React, { useState, useEffect, use, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Paper,
  Pagination,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ActivateUserDialog from './dialog/activate-user';
import {
  fetchUpdateTaxForDesigner,
  fetchUpdateUserStatus,
  fetchUserByEmail,
  fetchUsers,
} from 'src/redux/reducers/user';
import { users } from 'src/services/user';
import { Edit } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AdminUser = () => {
  const dispatch = useDispatch();
  const { loadingUserList, total, data: usersList } = useSelector((state) => state.users.usersList);

  const [usersStats, setUsersStats] = useState({
    totalCustomer: 0,
    totalDesigner: 0,
    all: 0,
    inactive: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [confirmDialogStatus, setConfirmDialogStatus] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [tax, setTax] = useState(18.5); // Default tax rate for designers
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { loading, data: userData } = useSelector((state) => state.users.userInfo);
  console.log("check user lít", usersList);
  // Load users when component mounts or when filters change
  useEffect(() => {
    loadUsers();
    loadUsersStats(); // Gọi API thống kê khi component mount
  }, [activeTab, currentPage, pageSize]);

  const loadUsers = () => {
    const requestBody = {
      page: currentPage,
      size: pageSize,
    };

    // Add filters based on active tab
    switch (activeTab) {
      case 'users':
        requestBody.roleName = 'customer';
        break;
      case 'designs':
        requestBody.roleName = 'designer';
        break;
      case 'locked':
        requestBody.status = -1;
        break;
      case 'pending':
        requestBody.status = 0; // Assuming 0 is the status for pending users
      default:
        // "all" tab - no additional filters
        break;
    }

    dispatch(fetchUsers(requestBody));
  };

  const loadUsersStats = async () => {
    try {
      setLoadingStats(true);
      const response = await users.requestGetUsersStats();
      setUsersStats(response.data.data);
    } catch (error) {
      console.error('Error fetching users stats:', error);
      // Reset về giá trị mặc định nếu có lỗi
      setUsersStats({
        totalCustomer: 0,
        totalDesigner: 0,
        all: 0,
        inactive: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handlePageSizeChange = (event) => {
    console.log(event.target.value);
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  /**
   * Update user status/approval.
   */
  const handleOpenDialogSetStatus = (userEmail, userStatus) => {
    setSelectedUserEmail(userEmail);
    setSelectedStatus(userStatus);
    setConfirmDialogStatus(true);
    setIsCreatingNew(false);
  };
  const handleConfirmSetStatus = async () => {
    const data = {
      email: selectedUserEmail,
      status: -selectedStatus,
    };
    const response = await dispatch(fetchUpdateUserStatus(data));
    console.log(response);
    if (response.error) {
      toast.error('Error updating user status:', response.error);
    } else {
      toast.success(`User status updated successfully to ${-selectedStatus === 1 ? 'active' : 'locked'}`);
    }
    setConfirmDialogStatus(false);
    setSelectedUserEmail('');
    setSelectedStatus(1);
    setSelectedUser(null);
    setShowUserModal(false);
    loadUsers();
    loadUsersStats(); // Cập nhật lại thống kê sau khi thay đổi status
  };
  const handleShowDialogSetTax = async (email) => {
    setEmail(email);
    const response = await dispatch(fetchUserByEmail({ email }));
    if (response.meta.requestStatus === 'fulfilled') {
      setTax(response.payload?.t ?? 18.5);
      setShowTaxDialog(true);
    } else {
      toast.error('Error fetching user data:', response.error);
    }
  };

  const handleSetTaxForDesigner = useCallback(async () => {
    const data = {
      email,
      taxDeductionRate: parseFloat(tax), // Ensure tax is a float
    };
    const response = await dispatch(fetchUpdateTaxForDesigner(data));
    if (response.error) {
      toast.error('Error setting tax for designer:', response.error);
    } else {
      toast.success('Tax updated successfully for designer');
    }
    setShowTaxDialog(false);
    setSelectedUser(null);
    setShowUserModal(false);
    loadUsers();
    loadUsersStats(); // Cập nhật lại thống kê nếu cần
  }, [email, tax, dispatch, loadUsers]); // Dependencies

  /**
   * Open details dialog.
   */
  const showUserDetails = async (user) => {
    await dispatch(fetchUserByEmail({ email: user.email }));
    setSelectedUser(user);
    setShowUserModal(true);
  };

  /**
   * Handle creating new account
   */
  const handleCreateAccount = () => {
    setActivateDialogOpen(true);
  };

  const handleActivateSubmit = () => {
    // Reload users list and stats after successful creation
    loadUsers();
    loadUsersStats(); // Cập nhật lại thống kê sau khi tạo user mới
    setActivateDialogOpen(false);
    setSelectedUser(null);
    setIsCreatingNew(false);
  };

  // Get stats from current data
  const getStatsFromAPI = () => {
    return {
      totalUsers: usersStats.totalCustomer || 0,
      totalDesigners: usersStats.totalDesigner || 0,
      totalLocked: usersStats.inactive || 0,
      totalAll: usersStats.all || 0,
    };
  };

  const stats = getStatsFromAPI();

  // Filter users by search term
  const filteredUsers = (usersList || []).filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  /**
   * Render status chip.
   */
  const getStatusChip = (user) => {
    switch (user.status) {
      case 1:
        return <Chip label="Hoạt động" size="small" className="bg-green-100 text-green-800" />;
      case -1:
        return <Chip label="Bị khóa" size="small" className="bg-red-100 text-red-800" />;
      case 0:
        return <Chip label="Chờ kích hoạt" size="small" className="bg-red-100 text-red-800" />;
      default:
        return <Chip label="Không xác định" size="small" className="bg-gray-100 text-gray-800" />;
    }
  };

  /**
   * Render role chip.
   */
  const getRoleChip = (roleName) => {
    return roleName?.toLowerCase() === 'designer' ? (
      <Chip label="Designer" size="small" className="bg-purple-100 text-purple-800" />
    ) : (
      <Chip label="Customer" size="small" className="bg-blue-100 text-blue-800" />
    );
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <Box className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card elevation={0} className="rounded-lg shadow">
            <CardContent className="flex items-center p-6">
              <Box className="p-2 bg-blue-100 rounded-lg">
                <PeopleIcon className="h-6 w-6 text-blue-600" />
              </Box>
              <Box className="ml-4">
                <Typography variant="body2" className="text-gray-600">
                  User
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalUsers}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-lg shadow">
            <CardContent className="flex items-center p-6">
              <Box className="p-2 bg-purple-100 rounded-lg">
                <EmojiEventsIcon className="h-6 w-6 text-purple-600" />
              </Box>
              <Box className="ml-4">
                <Typography variant="body2" className="text-gray-600">
                  Designer
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalDesigners}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-lg shadow">
            <CardContent className="flex items-center p-6">
              <Box className="p-2 bg-gray-100 rounded-lg">
                <PeopleIcon className="h-6 w-6 text-gray-600" />
              </Box>
              <Box className="ml-4">
                <Typography variant="body2" className="text-gray-600">
                  Tất cả
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalAll}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-lg shadow">
            <CardContent className="flex items-center p-6">
              <Box className="p-2 bg-red-100 rounded-lg">
                <LockIcon className="h-6 w-6 text-red-600" />
              </Box>
              <Box className="ml-4">
                <Typography variant="body2" className="text-gray-600">
                  Bị khóa
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {loadingStats ? '...' : stats.totalLocked}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Filters & Search */}
        <Card elevation={0} className="rounded-lg shadow">
          <CardContent className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, value) => handleTabChange(value)}
              className="bg-gray-100 rounded-lg"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="all" label="Tất cả" className="normal-case text-sm font-medium" />
              <Tab value="users" label="User" className="normal-case text-sm font-medium" />
              <Tab value="designs" label="Designer" className="normal-case text-sm font-medium" />
              <Tab value="locked" label="Bị khóa" className="normal-case text-sm font-medium" />
            </Tabs>

            {/* Search & Create Button */}
            <Box className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <TextField
                variant="outlined"
                size="small"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<PersonAddIcon />}
                onClick={handleCreateAccount}
                className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                }}
              >
                Tạo tài khoản
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card elevation={0} className="rounded-lg shadow overflow-hidden">
          {loadingUserList ? (
            <Box className="text-center py-12">
              <Typography variant="body2" className="text-gray-500">
                Đang tải dữ liệu...
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHead className="bg-gray-50">
                  <TableRow>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin user
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại tài khoản
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coin
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </TableCell>
                    <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </TableCell>
                    <TableCell className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      {/* User info */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Box className="flex items-center">
                          <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600">
                            <span className="text-white font-medium text-sm">
                              {user.username?.charAt(0).toUpperCase()}
                            </span>
                          </Avatar>
                          <Box className="ml-4">
                            <Typography variant="body2" className="font-medium text-gray-900">
                              {user.username}
                            </Typography>
                            <Box className="text-sm text-gray-500 flex items-center">
                              <MailIcon className="h-3 w-3 mr-1" />
                              {user.email}
                            </Box>
                            {user.phone && (
                              <Box className="text-sm text-gray-500 flex items-center">
                                <PhoneIcon className="h-3 w-3 mr-1" />
                                {user.phone}
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">{getRoleChip(user.role_name)}</TableCell>

                      {/* Coin */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="body2" className="font-medium text-gray-900">
                          {user.coin?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">{getStatusChip(user)}</TableCell>

                      {/* Created Date */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Box className="flex items-center text-sm text-gray-900">
                          <CalendarMonthIcon className="h-3 w-3 mr-1" />
                          {user.createdDate ? new Date(user.createdDate * 1000).toLocaleDateString('vi-VN') : 'N/A'}
                        </Box>
                        {user.lastModifiedDate && (
                          <Typography variant="caption" className="text-gray-500">
                            Cập nhật: {new Date(user.lastModifiedDate * 1000).toLocaleDateString('vi-VN')}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                        <Box className="flex justify-end space-x-2">
                          <IconButton
                            onClick={() => showUserDetails(user)}
                            size="small"
                            className="text-green-600 hover:text-green-900 hover:bg-green-50"
                          >
                            <VisibilityIcon className="h-4 w-4" />
                          </IconButton>

                          {user.status === -1 ? (
                            <IconButton
                              onClick={() => handleOpenDialogSetStatus(user.email, user.status)}
                              size="small"
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                            >
                              <LockIcon className="h-4 w-4" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleOpenDialogSetStatus(user.email, user.status)}
                              size="small"
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                            >
                              <LockOpenIcon className="h-4 w-4" />
                            </IconButton>
                          )}
                          {user.role_name?.toLowerCase() === 'designer' && (
                            <Box>
                              <IconButton
                                onClick={() => handleShowDialogSetTax(user.email)}
                                size="small"
                                className="text-green-600 hover:text-green-900 hover:bg-green-50"
                              >
                                <Edit className="h-4 w-4" />
                              </IconButton>
                            </Box>
                          )}
                          {!loading ? (
                            <Dialog open={showTaxDialog} onClose={() => setShowTaxDialog(false)}>
                              <DialogTitle>Chỉnh sửa thuế cho nhà thiết kế</DialogTitle>
                              <DialogContent>
                                <TextField
                                  label="Tỷ lệ thuế"
                                  value={tax}
                                  onChange={(e) => setTax(e.target.value)}
                                  fullWidth
                                  margin="normal"
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setShowTaxDialog(false)}>Hủy</Button>
                                <Button onClick={() => handleSetTaxForDesigner(user.email, tax)}>Lưu</Button>
                              </DialogActions>
                            </Dialog>
                          ) : null}
                        </Box>
                      </TableCell>
                      <Dialog open={confirmDialogStatus} onClose={() => setConfirmDialogStatus(false)}>
                        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
                        <DialogContent>
                          <Typography variant="body1">
                            Bạn có chắc chắn muốn <strong>{-selectedStatus === 1 ? 'kích hoạt' : 'khóa'}</strong> người
                            dùng {selectedUserEmail} không?
                          </Typography>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setConfirmDialogStatus(false)}>Hủy</Button>
                          <Button onClick={() => handleConfirmSetStatus()}>Đồng ý</Button>
                        </DialogActions>
                      </Dialog>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredUsers.length === 0 && !loadingUserList && (
            <Box className="text-center py-12">
              <PersonRemoveIcon className="mx-auto h-12 w-12 text-gray-400" />
              <Typography variant="body2" className="mt-2 font-medium text-gray-900">
                Không tìm thấy user
              </Typography>
              <Typography variant="caption" className="mt-1 text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </Typography>
            </Box>
          )}
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showUserModal} onClose={() => setShowUserModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Chi tiết tài khoản</DialogTitle>
          {userData && (
            <>
              <DialogContent dividers>
                <Box className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600">
                    <span className="text-white font-bold text-xl">{userData.username?.charAt(0).toUpperCase()}</span>
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-medium text-gray-900">
                      {userData.username}
                    </Typography>
                    <Box className="flex space-x-2 mt-1">
                      {getRoleChip(userData.role_name)}
                      {getStatusChip(userData)}
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-3">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Email:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {userData.email}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Số điện thoại:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {userData.phone}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Points:
                    </Typography>
                    <Typography variant="body2" className="font-medium text-gray-900">
                      {userData.coin?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Ngày đăng ký:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {new Date(userData?.createdDate * 1000).toLocaleString('vi-VN')}
                    </Typography>
                  </Box>
                  {userData?.lastModifiedDate && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-500">
                        Ngày cập nhật:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {new Date(userData?.lastModifiedDate * 1000).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  )}
                  {userData?.role_name === 'designer' && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-500">
                        T:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {userData?.t}
                      </Typography>
                    </Box>
                  )}
                  {userData?.bankName && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-500">
                        Ngân hàng:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {userData?.bankName}
                      </Typography>
                    </Box>
                  )}
                  {userData?.bankingId && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-500">
                        Số tài khoản:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {userData?.bankingId}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="inherit" onClick={() => setShowUserModal(false)}>
                  Đóng
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        {total && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Hiển thị {pageSize} trong tổng số {total} kết quả
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ minWidth: 50, ':placeholder-shown': pageSize }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Box>

              <Pagination
                count={Math.ceil(total / pageSize)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        )}
        <ActivateUserDialog
          open={activateDialogOpen}
          onClose={() => {
            setActivateDialogOpen(false);
          }}
          onSuccess={handleActivateSubmit}
        />
      </Box>
    </Box>
  );
};

export default AdminUser;
