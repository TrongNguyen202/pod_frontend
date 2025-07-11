'use client';

import {
  AttachMoney as AttachMoneyIcon,
  Clear as ClearIcon,
  FactCheck,
  FilterList as FilterListIcon,
  FunctionsOutlined,
  IosShare,
  PaymentsOutlined,
  PriceCheckOutlined,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  TrendingDownOutlined,
  TrendingUpOutlined,
  VerifiedOutlined,
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
  DialogContentText,
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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import AdminLayout from 'src/layouts/admin/layout';
import { tokens } from 'src/locales/tokens';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchExportExcelStatisticTransaction, fetchGetStatisticsTransaction } from 'src/redux/reducers/statistics';
import { fetchUserByEmail } from 'src/redux/reducers/user';
import { fetchUpdateStatusTransaction } from 'src/redux/reducers/usertopups';
import handleAmountFormat from 'src/utils/amount-vnd';
import { formatDateTime } from 'src/utils/date';

const formatTransactionType = (type) => {
  const types = {
    IN: 'Nạp tiền',
    OUT: 'Rút tiền',
    USE: 'Sử dụng',
    MAKE: 'Designer làm',
    REFUND: 'Hoàn tiền',
  };
  return types[type] || type;
};

const getTransactionTypeColor = (type) => {
  const colors = {
    IN: 'success',
    OUT: 'error',
    USE: 'info',
    MAKE: 'warning',
    REFUND: 'success',
  };
  return colors[type] || 'default';
};

const formatStatusTransaction = (status) => {
  const list = {
    '-1': 'Hủy',
    1: 'Thành công',
    0: 'Chờ duyệt',
  };
  return list[status] || status;
};

const getStatusTransactionColor = (status) => {
  const colors = {
    1: 'success',
    '-1': 'error',
    0: 'warning',
  };
  return colors[status] || 'default';
};

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

const Page = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
  const [transactionCodeToSearch, setTransactionCodeToSearch] = useState('');
  const [minCoin, setMinCoin] = useState('');
  const [maxCoin, setMaxCoin] = useState('');
  const [page, setPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openDialogExportExcelTransaction, setOpenDialogExportExcelTransaction] = useState(false);

  // Temporary states for advanced filters - chỉ apply khi bấm search
  const [tempNameToSearch, setTempNameToSearch] = useState('');
  const [tempMinCoin, setTempMinCoin] = useState('');
  const [tempMaxCoin, setTempMaxCoin] = useState('');
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [tempTransactionIdToSearch, setTempTransactionIdToSearch] = useState('');

  const [openDialogConfirmWithdraw, setOpenDialogConfirmWithdraw] = useState(false);
  const [coinWithdraw, setCoinWithdraw] = useState(0);
  const [bankName, setBankName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  // Get data from Redux store
  const {
    dataTopup: transactionTopupData,
    dataStatistics: statisticsTransactionData,
    loading,
    error,
  } = useAppSelector((state) => state.statistics.transaction);

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

    const dateTime = new Date(value); // local
    if (type === 'start') {
      setTempStartDate(dateTime);
    } else {
      setTempEndDate(dateTime);
    }
  };

  // Format datetime để gửi lên API
  const formatDateTimeForAPI = (date) => {
    if (!date) return null;

    const plus7H = new Date(date.getTime());

    return plus7H.toISOString();
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (statusToSearch) {
      params.append('transactionType', statusToSearch);
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

    if (minCoin) {
      params.append('minCoin', minCoin);
    }

    if (maxCoin) {
      params.append('maxCoin', maxCoin);
    }

    if (transactionCodeToSearch) {
      params.append('transactionCode', transactionCodeToSearch);
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
    dispatch(fetchGetStatisticsTransaction({ query }));
  }, [
    dispatch,
    page,
    pageSize,
    statusToSearch,
    emailToSearch,
    nameToSearch,
    customerNameToSearch,
    minCoin,
    maxCoin,
    transactionCodeToSearch,
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
    if (!statisticsTransactionData) {
      return [];
    }

    return [
      {
        title: 'Tổng giao dịch',
        value: statisticsTransactionData.totalTransactions?.toLocaleString() || '0',
        icon: FunctionsOutlined,
        circle: 'blue-circle',
      },
      {
        title: 'Tổng nạp',
        value: handleAmountFormat(statisticsTransactionData.totalIn || 0),
        icon: TrendingUpOutlined,
        circle: 'green-circle',
      },
      {
        title: 'Tổng dùng',
        value: handleAmountFormat(statisticsTransactionData.totalUse || 0),
        diff: 'Trung bình mỗi đơn hàng',
        icon: PaymentsOutlined,
        circle: 'purple-circle',
      },
      {
        title: 'Tổng rút',
        value: handleAmountFormat(statisticsTransactionData.totalOut || 0),
        icon: TrendingDownOutlined,
        circle: 'orange-circle',
      },
      {
        title: 'Tổng desginer làm ',
        value: handleAmountFormat(statisticsTransactionData.totalMake || 0),
        icon: PriceCheckOutlined,
        circle: 'yellow-circle',
      },
      {
        title: 'Tổng thu',
        value: handleAmountFormat(statisticsTransactionData.netBalance || 0),
        icon: AttachMoneyIcon,
        circle: 'greenlight-circle',
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
    setEmailToSearch(searchInput);
    setPage(1);
  };

  const handleAdvancedSearch = () => {
    // Apply tất cả temp values vào actual search states
    setNameToSearch(tempNameToSearch);
    setMinCoin(tempMinCoin);
    setMaxCoin(tempMaxCoin);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setTransactionCodeToSearch(tempTransactionIdToSearch);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setEmailToSearch('');
    setNameToSearch('');
    setTransactionCodeToSearch('');
    setTempNameToSearch('');
    setStatusToSearch('');
    setMinCoin('');
    setMaxCoin('');
    setTempMinCoin('');
    setTempMaxCoin('');
    setStartDate(null);
    setEndDate(null);
    setTempStartDate(null);
    setTempEndDate(null);
    setTempTransactionIdToSearch('');
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

  const handleExportExcelTransaction = () => {
    const query = buildQueryString();
    dispatch(fetchExportExcelStatisticTransaction({ query }))
      .then(() => {
        // Handle success if needed
      })
      .catch((error) => {
        console.error('Error exporting Excel:', error);
        // Handle error if needed
      });
    setOpenDialogExportExcelTransaction(false);
  };

  const handleOpenConfirmWithdraw = async (email, code, coin) => {
    try {
      const response = await dispatch(fetchUserByEmail({ email }));
      if (response.meta.requestStatus === 'fulfilled') {
        setBankName(response.payload.bankName);
        setBankNumber(response.payload.bankNumber);
        setBankAccountName(response.payload.bankAccountName);
        setCoinWithdraw(coin);
        setTransactionCode(code);
        setOpenDialogConfirmWithdraw(true);
      } else {
        toast.error('Error when fetch user data!');
      }
    } catch (error) {
      toast.error('Error when open confirm withdraw');
    }
  };

  const handleVetifyWithdrawRequest = async () => {
    try {
      const data = {
        status: 1,
        transactionCode,
      };
      const response = await dispatch(fetchUpdateStatusTransaction(data));
      if (response.meta.requestStatus === 'fulfilled') {
        fetchData();
        toast.success('Xác thực thành công.');
      } else {
        toast.error('Xác thực thất bại!');
      }
      setOpenDialogConfirmWithdraw(false);
    } catch (error) {
      toast.error('Loi khi thao tac');
    }
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
  const contents = transactionTopupData?.content || [];
  const pagination = transactionTopupData?.pageable;

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statisticsCards.map(({ title, value, diff, icon: Icon, circle }, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index} size={4}>
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
                  placeholder="Tìm kiếm theo email..."
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
                    <MenuItem value="IN">{formatTransactionType('IN')}</MenuItem>
                    <MenuItem value="USE">{formatTransactionType('USE')}</MenuItem>
                    <MenuItem value="MAKE">{formatTransactionType('MAKE')}</MenuItem>
                    <MenuItem value="OUT">{formatTransactionType('OUT')}</MenuItem>
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
                    <MenuItem value="coin-DESC">Giá cao nhất</MenuItem>
                    <MenuItem value="coin-ASC">Giá thấp nhất</MenuItem>
                    <MenuItem value="transactionType-ASC">Trạng thái A-Z</MenuItem>
                    <MenuItem value="transactionType-DESC">Trạng thái Z-A</MenuItem>
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
                  {/* Hàng 1: Mã giao dịch */}
                  <Grid item xs={12} md={6} size={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Mã giao dịch"
                      placeholder="Nhập mã giao dịch..."
                      value={tempTransactionIdToSearch}
                      onChange={(e) => setTempTransactionIdToSearch(e.target.value)}
                    />
                  </Grid>
                  {/* Hàng 2: Giá từ - Giá đến */}
                  <Grid item xs={12} md={6} size={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Giá từ"
                      placeholder="0"
                      type="number"
                      value={tempMinCoin}
                      onChange={(e) => setTempMinCoin(e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} size={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Giá đến"
                      placeholder="999999999"
                      type="number"
                      value={tempMaxCoin}
                      onChange={(e) => setTempMaxCoin(e.target.value)}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">₫</InputAdornment>,
                      }}
                    />
                  </Grid>

                  {/* Hàng 3: Từ ngày - Đến ngày */}
                  <Grid item xs={12} md={6} size={4}>
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
                  <Grid item xs={12} md={6} size={4}>
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

                  <Grid item xs={12} size={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
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
                {transactionTopupData?.pageable && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({transactionTopupData.totalElements} kết quả)
                  </Typography>
                )}
              </Typography>
              <Button
                title="Xuất Excel"
                variant="outlined"
                color="primary"
                startIcon={<IosShare />}
                onClick={() => setOpenDialogExportExcelTransaction(true)}
                disabled={loading}
              >
                Xuất Excel
              </Button>
            </Box>
            <Dialog open={openDialogExportExcelTransaction} onClose={() => setOpenDialogExportExcelTransaction(false)}>
              <DialogTitle>Xuất Excel</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bạn có chắc chắn muốn xuất danh sách đơn hàng theo bộ lọc đã chọn ra file Excel không?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialogExportExcelTransaction(false)} color="primary">
                  {t(tokens.nav.cancel)}
                </Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: 'primary.main', color: 'white' }}
                  onClick={handleExportExcelTransaction}
                  color="primary"
                  autoFocus
                >
                  {t(tokens.nav.submit)}
                </Button>
              </DialogActions>
            </Dialog>

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
                        <TableCell>Người tạo</TableCell>
                        <TableCell>Số tiền</TableCell>
                        <TableCell>Nội dung</TableCell>
                        <TableCell align="center">Mã giao dịch</TableCell>
                        <TableCell align="center">Loại giao dịch</TableCell>
                        <TableCell>Ngày tạo</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contents.map((contents) => (
                        <TableRow key={contents.id} hover>
                          <TableCell
                            title={`ID: ${contents.id}`}
                            sx={{
                              maxWidth: 80,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            #{contents.id}
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 246,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Tooltip title={contents.user.email} arrow>
                              <span>{contents.user.email || 'N/A'}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">{handleAmountFormat(contents.coin) || 0}</Typography>
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Tooltip title={contents.contents} arrow>
                              <span>{contents.contents || 'N/A'}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell
                            sx={{
                              maxWidth: 220,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <Tooltip title={contents.transactionCode} arrow>
                              <span>{contents.transactionCode || 'N/A'}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={formatTransactionType(contents.transactionType)}
                              color={getTransactionTypeColor(contents.transactionType)}
                              size="small"
                            />
                          </TableCell>
                          {/* <TableCell align="center">{formatTransactionType(contents.transactionType)}</TableCell> */}
                          <TableCell>{formatDateTime(contents.createdDate)}</TableCell>
                          <TableCell>
                            <Chip
                              label={formatStatusTransaction(contents.status)}
                              color={getStatusTransactionColor(contents.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {contents.status === 0 ? (
                              // <Button onClick={() => handleVetifyWithdrawRequest(contents.transactionCode)}>
                              <Button
                                onClick={() =>
                                  handleOpenConfirmWithdraw(contents.createdBy, contents.transactionCode, contents.coin)
                                }
                              >
                                <FactCheck />
                              </Button>
                            ) : contents.status === 1 ? (
                              <Box color="primary.main" textAlign="center">
                                <VerifiedOutlined />
                              </Box>
                            ) : (
                              <Box></Box>
                            )}
                          </TableCell>
                          <Dialog open={openDialogConfirmWithdraw} onClose={() => setOpenDialogConfirmWithdraw(false)}>
                            <DialogTitle textAlign="center">Xác nhận giao dịch</DialogTitle>

                            <DialogContent>
                              <DialogContentText
                                sx={{
                                  textAlign: 'center',
                                  mb: 2, // margin bottom
                                  fontSize: '1rem',
                                  lineHeight: 1.6,
                                }}
                              >
                                Xác nhận thanh toán{' '}
                                <strong style={{ color: '#1976d2' }}>{handleAmountFormat(coinWithdraw)}</strong> tới
                                <br />
                                Số tài khoản:{' '}
                                <strong style={{ color: '#1976d2' }}>
                                  {bankNumber} - {bankName}
                                </strong>
                                .
                                <br />
                                Chủ tài khoản: <strong style={{ color: '#1976d2' }}>{bankAccountName}</strong>
                              </DialogContentText>
                            </DialogContent>

                            <DialogActions
                              sx={{
                                justifyContent: 'center',
                                pb: 3,
                              }}
                            >
                              <Button
                                onClick={() => setOpenDialogConfirmWithdraw(false)}
                                color="inherit"
                                variant="outlined"
                                sx={{ minWidth: 120 }}
                              >
                                {t(tokens.nav.cancel)}
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleVetifyWithdrawRequest}
                                sx={{ minWidth: 120, ml: 2 }}
                                autoFocus
                              >
                                {t(tokens.nav.submit)}
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {transactionTopupData.pageable && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Hiển thị {transactionTopupData.numberOfElements} trong tổng số{' '}
                      {transactionTopupData.totalElements} kết quả
                    </Typography>

                    <Pagination
                      count={transactionTopupData.totalPages}
                      page={transactionTopupData.pageable.pageNumber + 1}
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
    </AdminLayout>
  );
};

export default Page;
