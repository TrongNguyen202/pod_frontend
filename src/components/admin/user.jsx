import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ActivateUserDialog from './dialog/activate-user';
import { fetchUsers } from "src/redux/reducers/user";


const AdminUser = () => {
  const dispatch = useDispatch();
  const { usersList } = useSelector((state) => state.users);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Load users when component mounts or when filters change
  useEffect(() => {
    loadUsers();
  }, [activeTab, currentPage]);

  const loadUsers = () => {
    const requestBody = {
      page: currentPage,
      size: pageSize,
    };

    // Add filters based on active tab
    switch (activeTab) {
      case "users":
        requestBody.roleName = "customer";
        break;
      case "designs":
        requestBody.roleName = "designer";
        break;
      case "locked":
        requestBody.status = 0;
        break;
      default:
        // "all" tab - no additional filters
        break;
    }

    dispatch(fetchUsers(requestBody));
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  /**
   * Update user status/approval.
   */
  const handleUserAction = (userId, action) => {
    if (action === "approve") {
      setActivateDialogOpen(true);
      setSelectedUser(users.find((user) => user.id === userId));
      setIsCreatingNew(false);
      return;
    }
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        switch (action) {
          case "lock":
            return { ...user, status: "locked" };
          case "unlock":
            return { ...user, status: "active" };
          case "approve":
            return { ...user, status: "active", isApproved: true };
          case "reject":
            return { ...user, status: "rejected" };
          default:
            return user;
        }
      })
    );
  };

  /**
   * Open details dialog.
   */
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  /**
   * Handle creating new account
   */
  const handleCreateAccount = () => {
    setIsCreatingNew(true);
    setSelectedUser(null);
    setActivateDialogOpen(true);
  };

  const handleActivateSubmit = (userData) => {
    // Reload users list after successful creation
    loadUsers();
    setActivateDialogOpen(false);
    setSelectedUser(null);
    setIsCreatingNew(false);
  };

  // Get stats from current data
  const getStats = () => {
    const allUsers = usersList.data || [];
    return {
      totalUsers: allUsers.filter(u => u.role_name?.toLowerCase() === "customer").length,
      totalDesigners: allUsers.filter(u => u.role_name?.toLowerCase() === "designer").length,
      totalLocked: allUsers.filter(u => u.status === 0).length,
      totalAll: allUsers.length,
    };
  };

  const stats = getStats();

  // Filter users by search term
  const filteredUsers = (usersList.data || []).filter((user) => {
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
      case 0:
        return <Chip label="Bị khóa" size="small" className="bg-red-100 text-red-800" />;
      default:
        return <Chip label="Không xác định" size="small" className="bg-gray-100 text-gray-800" />;
    }
  };

  /**
   * Render role chip.
   */
  const getRoleChip = (roleName) => {
    return roleName?.toLowerCase() === "designer" ? (
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
                  {stats.totalUsers}
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
                  {stats.totalDesigners}
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
                  {stats.totalAll}
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
                  {stats.totalLocked}
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
          {usersList.loading ? (
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
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getRoleChip(user.role_name)}
                      </TableCell>

                      {/* Coin */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Typography variant="body2" className="font-medium text-gray-900">
                          {user.coin?.toLocaleString() || 0}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500 ml-1">
                          coin
                        </Typography>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        {getStatusChip(user)}
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <Box className="flex items-center text-sm text-gray-900">
                          <CalendarMonthIcon className="h-3 w-3 mr-1" />
                          {user.createdDate ? new Date(user.createdDate * 1000).toLocaleDateString("vi-VN") : 'N/A'}
                        </Box>
                        {user.lastModifiedDate && (
                          <Typography variant="caption" className="text-gray-500">
                            Cập nhật: {new Date(user.lastModifiedDate * 1000).toLocaleDateString("vi-VN")}
                          </Typography>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                        <Box className="flex justify-end space-x-2">
                          <IconButton
                            onClick={() => showUserDetails(user)}
                            size="small"
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                          >
                            <VisibilityIcon className="h-4 w-4" />
                          </IconButton>

                          {user.status === 1 ? (
                            <IconButton
                              onClick={() => handleUserAction(user.id, "lock")}
                              size="small"
                              className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            >
                              <LockIcon className="h-4 w-4" />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleUserAction(user.id, "unlock")}
                              size="small"
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                            >
                              <LockOpenIcon className="h-4 w-4" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {filteredUsers.length === 0 && !usersList.loading && (
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
          {selectedUser && (
            <>
              <DialogContent dividers>
                <Box className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600">
                    <span className="text-white font-bold text-xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-medium text-gray-900">
                      {selectedUser.name}
                    </Typography>
                    <Box className="flex space-x-2 mt-1">
                      {getRoleChip(selectedUser.role)}
                      {getStatusChip(selectedUser)}
                    </Box>
                  </Box>
                </Box>

                <Box className="space-y-3">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Email:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Số điện thoại:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {selectedUser.phone}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Points:
                    </Typography>
                    <Typography variant="body2" className="font-medium text-gray-900">
                      {selectedUser.points.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-gray-500">
                      Ngày đăng ký:
                    </Typography>
                    <Typography variant="body2" className="text-gray-900">
                      {new Date(selectedUser.registrationDate).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                  {selectedUser.lastLogin && (
                    <Box className="flex justify-between">
                      <Typography variant="body2" className="text-gray-500">
                        Lần truy cập cuối:
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {new Date(selectedUser.lastLogin).toLocaleDateString("vi-VN")}
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
        <ActivateUserDialog
          open={activateDialogOpen}
          onClose={() => {
            setActivateDialogOpen(false);
            setSelectedUser(null);
            setIsCreatingNew(false);
          }}
          userEmail={isCreatingNew ? "" : selectedUser?.email || ""}
          onSuccess={handleActivateSubmit}
        />
      </Box>
    </Box>
  );
};

export default AdminUser;
