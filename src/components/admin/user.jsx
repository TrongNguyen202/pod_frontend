import React, { useState } from "react";
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


const AdminUser = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "nguyen.van.an@email.com",
      phone: "0901234567",
      role: "user",
      points: 150,
      status: "active",
      registrationDate: "2024-01-15",
      lastLogin: "2024-06-12",
      isApproved: true,
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "tran.thi.binh@email.com",
      phone: "0912345678",
      role: "design",
      points: 900,
      status: "active",
      registrationDate: "2024-02-20",
      lastLogin: "2024-06-13",
      isApproved: true,
    },
    {
      id: 3,
      name: "Lê Minh Cường",
      email: "le.minh.cuong@email.com",
      phone: "0923456789",
      role: "user",
      points: 75,
      status: "locked",
      registrationDate: "2024-03-10",
      lastLogin: "2024-06-10",
      isApproved: true,
    },
    {
      id: 4,
      name: "Phạm Thu Dung",
      email: "pham.thu.dung@email.com",
      phone: "0934567890",
      role: "design",
      points: 0,
      status: "pending",
      registrationDate: "2024-06-13",
      lastLogin: null,
      isApproved: false,
    },
  ]);

  /**
   * Update user status/approval.
   */
  const handleUserAction = (userId, action) => {
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
   * Filter users by tab & search term.
   */
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    switch (activeTab) {
      case "users":
        return user.role === "user" && matchesSearch;
      case "designs":
        return user.role === "design" && matchesSearch;
      case "pending":
        return !user.isApproved && matchesSearch;
      case "locked":
        return user.status === "locked" && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  /**
   * Render status chip.
   */
  const getStatusChip = (user) => {
    if (!user.isApproved) {
      return <Chip label="Chờ duyệt" size="small" className="bg-yellow-100 text-yellow-800" />;
    }
    switch (user.status) {
      case "active":
        return <Chip label="Hoạt động" size="small" className="bg-green-100 text-green-800" />;
      case "locked":
        return <Chip label="Bị khóa" size="small" className="bg-red-100 text-red-800" />;
      case "rejected":
        return <Chip label="Từ chối" size="small" className="bg-gray-100 text-gray-800" />;
      default:
        return <Chip label="Không xác định" size="small" className="bg-gray-100 text-gray-800" />;
    }
  };

  /**
   * Render role chip.
   */
  const getRoleChip = (role) => {
    return role === "design" ? (
      <Chip label="Designer" size="small" className="bg-purple-100 text-purple-800" />
    ) : (
      <Chip label="User" size="small" className="bg-blue-100 text-blue-800" />
    );
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Header */}
      {/*<Box className="bg-white shadow-sm border-b">*/}
      {/*  <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">*/}
      {/*    <Box className="flex justify-between items-center py-6">*/}
      {/*      <Box>*/}
      {/*        <Typography variant="h5" className="font-bold text-gray-900">*/}
      {/*          Quản lý User*/}
      {/*        </Typography>*/}
      {/*        <Typography variant="body2" className="text-gray-600 mt-1">*/}
      {/*          Quản lý tài khoản user và designer*/}
      {/*        </Typography>*/}
      {/*      </Box>*/}
      {/*    </Box>*/}
      {/*  </Box>*/}
      {/*</Box>*/}

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
                  Tổng User
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {users.filter((u) => u.role === "user").length}
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
                  {users.filter((u) => u.role === "design").length}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} className="rounded-lg shadow">
            <CardContent className="flex items-center p-6">
              <Box className="p-2 bg-yellow-100 rounded-lg">
                <PersonRemoveIcon className="h-6 w-6 text-yellow-600" />
              </Box>
              <Box className="ml-4">
                <Typography variant="body2" className="text-gray-600">
                  Chờ duyệt
                </Typography>
                <Typography variant="h6" className="font-bold text-gray-900">
                  {users.filter((u) => !u.isApproved).length}
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
                  {users.filter((u) => u.status === "locked").length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Filters & Search */}
        <Card elevation={0} className="rounded-lg shadow">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              className="bg-gray-100 rounded-lg"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="all" label="Tất cả" className="normal-case text-sm font-medium" />
              <Tab value="users" label="User" className="normal-case text-sm font-medium" />
              <Tab value="designs" label="Designer" className="normal-case text-sm font-medium" />
              <Tab value="pending" label="Chờ duyệt" className="normal-case text-sm font-medium" />
              <Tab value="locked" label="Bị khóa" className="normal-case text-sm font-medium" />
            </Tabs>

            {/* Search */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card elevation={0} className="rounded-lg shadow overflow-hidden">
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
                    Points
                  </TableCell>
                  <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </TableCell>
                  <TableCell className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đăng ký
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
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </Avatar>
                        <Box className="ml-4">
                          <Typography variant="body2" className="font-medium text-gray-900">
                            {user.name}
                          </Typography>
                          <Box className="text-sm text-gray-500 flex items-center">
                            <MailIcon className="h-3 w-3 mr-1" />
                            {user.email}
                          </Box>
                          <Box className="text-sm text-gray-500 flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            {user.phone}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getRoleChip(user.role)}
                    </TableCell>

                    {/* Points */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Typography variant="body2" className="font-medium text-gray-900">
                        {user.points.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500 ml-1">
                        points
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {getStatusChip(user)}
                    </TableCell>

                    {/* Dates */}
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Box className="flex items-center text-sm text-gray-900">
                        <CalendarMonthIcon className="h-3 w-3 mr-1" />
                        {new Date(user.registrationDate).toLocaleDateString("vi-VN")}
                      </Box>
                      {user.lastLogin && (
                        <Typography variant="caption" className="text-gray-500">
                          Truy cập: {new Date(user.lastLogin).toLocaleDateString("vi-VN")}
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

                        {!user.isApproved && (
                          <>
                            <IconButton
                              onClick={() => handleUserAction(user.id, "approve")}
                              size="small"
                              className="text-green-600 hover:text-green-900 hover:bg-green-50"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleUserAction(user.id, "reject")}
                              size="small"
                              className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            >
                              <PersonRemoveIcon className="h-4 w-4" />
                            </IconButton>
                          </>
                        )}

                        {user.isApproved && (
                          user.status === "active" ? (
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
                          )
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && (
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
      </Box>
    </Box>
  );
};

export default AdminUser;
