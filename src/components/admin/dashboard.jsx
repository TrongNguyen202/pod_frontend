'use client';

import {
  AttachMoney as AttachMoneyIcon,
  Clear as ClearIcon,
  DashboardCustomize as DashboardCustomizeIcon,
  FilterList as FilterListIcon,
  Groups as GroupsIcon,
  PersonOff,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';
import { fetchResetOrderToNew } from 'src/redux/reducers/orders';
import { fetchGetStatisticsOrder } from 'src/redux/reducers/statistics';
import handleAmountFormat from 'src/utils/amount-vnd';
import { formatDateTime } from 'src/utils/date';

const formatDateTimeForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getStatusColor = (status) => {
  const colors = {
    DRAFT: 'primary',
    IN_REVIEW: 'warning',
    DONE: 'success',
    NEW: 'primary',
    DOING: 'secondary',
    NEED_FIX: 'error',
    ARCHIVED: 'info',
  };
  return colors[status] || 'default';
};

const getStatusLabel = (status) => {
  const labels = {
    DRAFT: 'Bản nháp',
    IN_REVIEW: 'Kiểm tra',
    DONE: 'Hoàn thành',
    NEW: 'Mới',
    DOING: 'Đang xử lý',
    NEED_FIX: 'Cần sửa',
    ARCHIVED: 'Đã lưu trữ',
  };
  return labels[status] || status;
};

export default function AdminDashboard() {
  const dispatch = useAppDispatch();

  // Filter states
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusToSearch, setStatusToSearch] = useState('');
  const [emailToSearch, setEmailToSearch] = useState('');
  const [nameToSearch, setNameToSearch] = useState('');
  const [customerNameToSearch, setCustomerNameToSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Temporary states for advanced filters - chỉ apply khi bấm search
  const [tempNameToSearch, setTempNameToSearch] = useState('');
  const [tempMinPrice, setTempMinPrice] = useState('');
  const [tempMaxPrice, setTempMaxPrice] = useState('');
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [tempCustomerNameToSearch, setTempCustomerNameToSearch] = useState('');

  const [showConfirmRemoveDesigner, setShowConfirmRemoveDesigner] = useState(false);
  const [orderToRemoveDesigner, setOrderToRemoveDesigner] = useState(null);

  // Get data from Redux store
  const { data: statisticsOrderData, loading, error } = useAppSelector((state) => state.statistics.order);

  // Xử lý thay đổi datetime cho temp states
  const handleTempDateTimeChange = (type, value) => {
    if (!value) {
      if (type === 'start') {
        setTempStartDate(null);
      } else {
        setTempEndDate(null);
      }
      return;
    }

    const dateTime = new Date(value);
    if (type === 'start') {
      setTempStartDate(dateTime);
    } else {
      setTempEndDate(dateTime);
    }
  };

  // Format datetime để gửi lên API (ISO string) - xử lý GMT+7
  const formatDateTimeForAPI = (date) => {
    if (!date) return null;
    // Không cần cộng thêm 7 giờ vì date đã là local time
    return date.toISOString();
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (statusToSearch) {
      params.append('status', statusToSearch);
    }

    if (emailToSearch) {
      params.append('email', emailToSearch);
    }

    if (nameToSearch) {
      params.append('orderName', nameToSearch);
    }

    if (customerNameToSearch) {
      params.append('customerName', customerNameToSearch);
    }

    if (minPrice) {
      params.append('minPrice', minPrice);
    }

    if (maxPrice) {
      params.append('maxPrice', maxPrice);
    }

    params.append('sort', sortBy);
    params.append('direction', sortDirection);

    params.append('page', (page - 1).toString());
    params.append('size', pageSize.toString());

    if (startDate) {
      params.append('startDate', formatDateTimeForAPI(startDate));
    }

    if (endDate) {
      params.append('endDate', formatDateTimeForAPI(endDate));
    }

    return params.toString();
  };

  // Fetch data function
  const fetchData = useCallback(async () => {
    const query = buildQueryString();
    dispatch(fetchGetStatisticsOrder({ query }));
  }, [
    dispatch,
    page,
    pageSize,
    statusToSearch,
    emailToSearch,
    nameToSearch,
    customerNameToSearch,
    minPrice,
    maxPrice,
    sortBy,
    sortDirection,
    startDate,
    endDate,
  ]);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create statistics cards data from API response
  const getStatisticsCards = () => {
    if (!statisticsOrderData?.todayTransactions || !statisticsOrderData?.statistics) {
      return [];
    }

    const { statistics, todayTransactions } = statisticsOrderData;

    return [
      {
        title: 'Tổng đơn hàng',
        value: statistics.totalOrders?.toLocaleString() || '0',
        diff: `Hôm nay: ${todayTransactions.newOrders || 0}`,
        icon: GroupsIcon,
        circle: 'blue-circle',
      },
      {
        title: 'Doanh thu thuần',
        value: handleAmountFormat(statistics.netRevenue || 0),
        diff: `Từ ${statistics.totalOrders || 0} đơn hàng`,
        icon: AttachMoneyIcon,
        circle: 'green-circle',
      },
      {
        title: 'Giá trị TB/đơn',
        value: handleAmountFormat(statistics.averageOrderValue || 0),
        diff: 'Trung bình mỗi đơn hàng',
        icon: ShowChartIcon,
        circle: 'purple-circle',
      },
      {
        title: 'Hoàn thành hôm nay',
        value: todayTransactions.doneOrders?.toString() || '0',
        diff: `Trong tổng ${statistics.statusBreakdown?.DONE || 0} đã hoàn thành`,
        icon: DashboardCustomizeIcon,
        circle: 'orange-circle',
      },
    ];
  };

  // Event handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleSearch = () => {
    // Set all search values from inputs
    setEmailToSearch(searchInput.trim());
    setPage(1);
  };

  const handleAdvancedSearch = () => {
    // Apply tất cả temp values vào actual search states
    setNameToSearch(tempNameToSearch.trim());
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setCustomerNameToSearch(tempCustomerNameToSearch.trim());
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setEmailToSearch('');
    setNameToSearch('');
    setTempNameToSearch('');
    setStatusToSearch('');
    setMinPrice('');
    setMaxPrice('');
    setTempMinPrice('');
    setTempMaxPrice('');
    setStartDate(null);
    setEndDate(null);
    setTempStartDate(null);
    setTempEndDate(null);
    setCustomerNameToSearch('');
    setSortBy('createdDate');
    setSortDirection('DESC');
    setPage(1);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusToSearch(event.target.value === 'ALL' ? '' : event.target.value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleShowConfirmRemoveDesigner = (orderSelected) => {
    setShowConfirmRemoveDesigner(true);
    setOrderToRemoveDesigner(orderSelected);
  };

  const sendNotificationSafely = useCallback(
    async (notificationData) => {
      try {
        await dispatch(fetchSendPushNotifications(notificationData));
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    },
    [dispatch],
  );

  const handleRemoveDesigner = async () => {
    if (orderToRemoveDesigner?.status === 'DOING') {
      const response = await dispatch(
        fetchResetOrderToNew({ data: { orderIds: [Number(orderToRemoveDesigner?.id)] } }),
      );
      if (response?.meta?.requestStatus === 'fulfilled') {
        (sendNotificationSafely({
          customerIds: orderToRemoveDesigner?.userid ? [orderToRemoveDesigner.userid] : [],
          title: 'Trạng thái đơn hàng',
          message: `Đơn hàng của bạn vừa được cập nhật trạng thái, xem ngay!`,
        }),
          toast.success('Gỡ designer thành công!'));
      } else {
        toast.error('Gỡ designer thất bại!');
      }
    } else {
      toast.error('Đơn hàng phải ở trạng thái Đang xử lý mới có thể gỡ');
    }
    setShowConfirmRemoveDesigner(false);
    setOrderToRemoveDesigner(null);
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const statisticsCards = getStatisticsCards();
  const orders = statisticsOrderData?.orders || [];
  const pagination = statisticsOrderData?.pagination;

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statisticsCards.map(({ title, value, diff, icon: Icon, circle }, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index} size={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {title}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {value}
                    </Typography>
                    {diff && (
                      <Typography variant="body3" color="text.secondary">
                        {diff}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: circle.includes('blue')
                        ? '#e3f2fd'
                        : circle.includes('green')
                          ? '#e8f5e8'
                          : circle.includes('purple')
                            ? '#f3e5f5'
                            : '#fff3e0',
                    }}
                  >
                    <Icon
                      sx={{
                        color: circle.includes('blue')
                          ? '#1976d2'
                          : circle.includes('green')
                            ? '#2e7d32'
                            : circle.includes('purple')
                              ? '#7b1fa2'
                              : '#f57c00',
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Advanced Filter Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon />
              Bộ lọc tìm kiếm
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                color={showAdvancedFilters ? 'primary' : 'default'}
                size="small"
                sx={{
                  backgroundColor: showAdvancedFilters ? 'primary.main' : 'transparent',
                  color: showAdvancedFilters ? 'white' : 'primary.light',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: showAdvancedFilters ? 'primary.dark' : 'transparent',
                  },
                }}
              >
                Tìm kiếm nâng cao
                <FilterListIcon />
              </IconButton>
              <IconButton onClick={handleClearFilters} size="small" color="error">
                <ClearIcon />
              </IconButton>
              <IconButton onClick={handleRefresh} disabled={loading} size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Basic Search Row */}
          <Grid container spacing={2} sx={{ mb: showAdvancedFilters ? 2 : 0 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm email, tên designer..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusToSearch}
                  sx={{ minWidth: '150px' }}
                  label="Trạng thái"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="ALL">Tất cả</MenuItem>
                  <MenuItem value="NEW">{getStatusLabel('NEW')}</MenuItem>
                  <MenuItem value="DOING">{getStatusLabel('DOING')}</MenuItem>
                  <MenuItem value="IN_REVIEW">{getStatusLabel('IN_REVIEW')}</MenuItem>
                  <MenuItem value="NEED_FIX">{getStatusLabel('NEED_FIX')}</MenuItem>
                  <MenuItem value="DONE">{getStatusLabel('DONE')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Hiển thị</InputLabel>
                <Select value={pageSize} label="Hiển thị" onChange={handlePageSizeChange}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={`${sortBy}-${sortDirection}`}
                  label="Sắp xếp"
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy(field);
                    setSortDirection(direction);
                  }}
                >
                  <MenuItem value="createdDate-DESC">Mới nhất</MenuItem>
                  <MenuItem value="createdDate-ASC">Cũ nhất</MenuItem>
                  <MenuItem value="price-DESC">Giá cao nhất</MenuItem>
                  <MenuItem value="price-ASC">Giá thấp nhất</MenuItem>
                  {/* <MenuItem value="status-ASC">Trạng thái A-Z</MenuItem> */}
                  {/* <MenuItem value="status-DESC">Trạng thái Z-A</MenuItem> */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Bộ lọc nâng cao
              </Typography>

              <Grid container spacing={2}>
                {/* Hàng 1: Tên đơn hàng - Tên khách hàng */}
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tên đơn hàng"
                    placeholder="Nhập tên đơn hàng..."
                    value={tempNameToSearch}
                    onChange={(e) => setTempNameToSearch(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tên khách hàng"
                    placeholder="Nhập tên khách hàng..."
                    value={tempCustomerNameToSearch}
                    onChange={(e) => setTempCustomerNameToSearch(e.target.value)}
                  />
                </Grid>

                {/* Hàng 2: Giá từ - Giá đến */}
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Giá từ"
                    placeholder="0"
                    type="number"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Giá đến"
                    placeholder="999999999"
                    type="number"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                    }}
                  />
                </Grid>

                {/* Hàng 3: Từ ngày - Đến ngày */}
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Từ ngày"
                    type="datetime-local"
                    value={formatDateTimeForInput(tempStartDate)}
                    onChange={(e) => handleTempDateTimeChange('start', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6} size={5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Đến ngày"
                    type="datetime-local"
                    value={formatDateTimeForInput(tempEndDate)}
                    onChange={(e) => handleTempDateTimeChange('end', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SearchIcon />}
                      onClick={handleAdvancedSearch}
                    >
                      Tìm kiếm
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                      Xoá bộ lọc
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Danh sách đơn hàng
              {statisticsOrderData?.pagination && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({statisticsOrderData.pagination.totalElements} kết quả)
                </Typography>
              )}
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tên đơn hàng</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Designer</TableCell>
                      <TableCell align="center">Giá gốc</TableCell>
                      <TableCell align="center">Giá thiết kế</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ngày tạo</TableCell>
                      <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Tooltip title={order.name} arrow>
                            <span>{order.name}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Tooltip title={order.customer?.username} arrow>
                            <span>{order.customer?.username || 'N/A'}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 246,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Tooltip title={order.customer?.email} arrow>
                            <span>{order.customer?.email || 'N/A'}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{order.customer?.phone || 'N/A'}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Tooltip title={order.designer?.username} arrow>
                            <span>{order.designer?.username || 'N/A'}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">{handleAmountFormat(order.price)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">{handleAmountFormat(order.pricede)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDateTime(order.createdDate)}</TableCell>
                        <TableCell align="center">{order.quantity}</TableCell>
                        <TableCell align="center" onClick={() => handleShowConfirmRemoveDesigner(order)}>
                          <PersonOff />{' '}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Dialog open={showConfirmRemoveDesigner} onClose={() => setShowConfirmRemoveDesigner(false)}>
                <DialogTitle>Xác nhận gỡ designer khỏi đơn hàng?</DialogTitle>
                <DialogContent>Xác nhận gỡ designer khỏi đơn hàng và chuyển trạng thái đơn hàng về Mới?</DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowConfirmRemoveDesigner(false)}>Hủy</Button>
                  <Button onClick={() => handleRemoveDesigner()}>Lưu</Button>
                </DialogActions>
              </Dialog>

              {/* Pagination */}
              {pagination && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Hiển thị {pagination.numberOfElements} trong tổng số {pagination.totalElements} kết quả
                  </Typography>

                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage + 1}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
