'use client';

import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Header from 'src/components/header';
import OrderPagination from 'src/components/ideas/order/OrderPagination';
import { Seo } from 'src/components/seo';
import Sidebar from 'src/components/sidebar';
import { tokens } from 'src/locales/tokens';
import { useAppSelector } from 'src/redux/hook';
import { fetchGetTopupInfo } from 'src/redux/reducers/usertopups';
import handleAmountFormat from 'src/utils/amount-vnd';

const typeTransactionVi = {
  IN: 'Nạp tiền',
  OUT: 'Rút tiền',
  USE: 'Sử dụng',
  MAKE: 'Trả đơn',
  REFUND: 'Hoàn tiền',
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

const Page = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState('');
  const headerRef = useRef(null);

  const [transactionType, setTransactionType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination state - using 1-based indexing to match OrderPagination component
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { data: userData } = useAppSelector((state) => state.users.userInfo);
  const { data: transactionsData, loading } = useAppSelector((state) => state.usertopups.userTransactionInfo);

  const userTopupsInfo = transactionsData?.transactions || [];
  const totalRecords = transactionsData?.total || 0;
  const totalPages = transactionsData?.totalPages || 0;

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (userData) {
      setRole(userData.role_name);
    }
  }, [userData]);

  // Build query string based on filters and pagination
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (transactionType) {
      params.append('type', transactionType);
    }

    // Add sorting parameters
    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);

    // Add pagination parameters (convert to 0-based for API)
    params.append('page', (page - 1).toString());
    params.append('pageSize', pageSize.toString());

    // Convert local time to GMT+7 timezone for backend
    if (startDate) {
      // Create a new date adjusted for GMT+7 (Vietnam timezone)
      const adjustedStartDate = new Date(startDate.getTime() + 7 * 60 * 60 * 1000);
      params.append('fromDate', adjustedStartDate.toISOString());
    }

    if (endDate) {
      // Create a new date adjusted for GMT+7 (Vietnam timezone)
      const adjustedEndDate = new Date(endDate.getTime() + 7 * 60 * 60 * 1000);
      params.append('toDate', adjustedEndDate.toISOString());
    }

    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      const queryString = buildQueryString();
      await dispatch(fetchGetTopupInfo(queryString));
    };

    if (isHydrated) {
      fetchData();
    }
  }, [dispatch, isHydrated, transactionType, startDate, endDate, sortBy, sortDirection, page, pageSize]);

  // Handle filter changes - reset to first page when filters change
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page
    const queryString = buildQueryString();
    dispatch(fetchGetTopupInfo(queryString));
  };

  const handleClearFilters = () => {
    setTransactionType('');
    setStartDate(null);
    setEndDate(null);
    setSortBy('createdDate');
    setSortDirection('desc');
    setPage(1); // Reset to first page
    setPageSize(10); // Reset to default page size
  };

  // Pagination handlers for OrderPagination component
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const transactionTypeOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'IN', label: 'Nạp tiền' },
    { value: 'OUT', label: 'Rút tiền' },
    { value: 'USE', label: 'Sử dụng' },
    { value: 'REFUND', label: 'Hoàn tiền' },
  ];

  const labelSort = {
    createdDate: t(tokens.nav.createdDate),
    coin: t(tokens.nav.amount),
  };
  const sortByOptions = [
    { value: 'createdDate', label: labelSort['createdDate'] },
    { value: 'coin', label: labelSort['coin'] },
  ];

  const labelSortDirection = {
    Descending: t(tokens.nav.descending),
    Ascending: t(tokens.nav.ascending),
  };
  const sortDirectionOptions = [
    { value: 'desc', label: labelSortDirection['Descending'] },
    { value: 'asc', label: labelSortDirection['Ascending'] },
  ];

  // Get totals from backend response instead of calculating in frontend
  const { data: transactionData } = useAppSelector((state) => state.usertopups.userTransactionInfo);
  const totalDeposit = transactionData?.totalIn || 0;
  const totalWithdraw = transactionData?.totalOut || 0;
  const totalUsed = transactionData?.totalUse || 0;
  const totalMaked = transactionData?.totalMake || 0;
  const totalRefund = transactionData?.totalRefund || 0;

  // Don't render complex content until hydrated
  if (!isHydrated) {
    return (
      <>
        <Seo title="Balances" />
        <Header showBoards={false} />
        <Box sx={{ display: 'flex' }}>
          <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4">Loading...</Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Seo title="Balances" />
      <Header showBoards={false} role={role} ref={headerRef} />
      <Box sx={{ display: 'flex' }}>
        {role && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} role={role} />}
        <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h4">Balances</Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginBottom: 2 }}
              onClick={() => {
                if (headerRef.current) {
                  headerRef.current.openMakeDepositDialog(); // Call the exposed method
                }
              }}
            >
              {role === 'customer' ? (
                <Box>{t(tokens.nav.make_deposit)}</Box>
              ) : role === 'designer' ? (
                <Box>{t(tokens.nav.make_withdraw)}</Box>
              ) : (
                <Box></Box>
              )}
            </Button>

            {/* Balance Summary Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={3} size={3}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    {t(tokens.nav.account_balance)}
                  </Typography>
                  <Typography variant="h6">
                    {userData && userData.coin !== undefined ? handleAmountFormat(userData.coin) : '-'}
                  </Typography>
                </Paper>
              </Grid>

              {role === 'customer' ? (
                <Grid item xs={12} md={3} size={3}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      {t(tokens.nav.deposited)}
                    </Typography>
                    <Typography variant="h6">{handleAmountFormat(totalDeposit)}</Typography>
                  </Paper>
                </Grid>
              ) : role === 'designer' ? (
                <Grid item xs={12} md={3} size={3}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      {t(tokens.nav.received)}
                    </Typography>
                    <Typography variant="h6">{handleAmountFormat(totalMaked)}</Typography>
                  </Paper>
                </Grid>
              ) : (
                <Box></Box>
              )}

              <Grid item xs={12} md={3} size={3}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    {t(tokens.nav.fulfilled)}
                  </Typography>
                  <Typography variant="h6">{handleAmountFormat(totalUsed - totalRefund)}</Typography>
                </Paper>
              </Grid>

              {role === 'customer' ? (
                <Grid item xs={12} md={3} size={3}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      {t(tokens.nav.refund)}
                    </Typography>
                    <Typography variant="h6">{handleAmountFormat(totalRefund)}</Typography>
                  </Paper>
                </Grid>
              ) : role === 'designer' ? (
                <Grid item xs={12} md={3} size={3}>
                  <Paper elevation={3} sx={{ p: 2, borderRadius: 2, width: '100%' }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      {t(tokens.nav.withdraw)}
                    </Typography>
                    <Typography variant="h6">{handleAmountFormat(totalWithdraw)}</Typography>
                  </Paper>
                </Grid>
              ) : (
                <Box></Box>
              )}
            </Grid>

            {/* Filter Section */}
            <Box sx={{ marginTop: 3, marginBottom: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {t(tokens.nav.filterTransactions)}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} alignItems="center">
                  {/* Transaction Type Filter */}
                  <Grid item xs={12} sm={3} minWidth="200px">
                    <FormControl fullWidth>
                      <InputLabel id="transaction-type-label">{t(tokens.nav.transactionType)}</InputLabel>
                      <Select
                        labelId="transaction-type-label"
                        value={transactionType}
                        label="Transaction Type"
                        onChange={(e) => setTransactionType(e.target.value)}
                      >
                        {transactionTypeOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Sort By */}
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                      <InputLabel id="sort-by-label">{t(tokens.nav.sortBy)}</InputLabel>
                      <Select
                        labelId="sort-by-label"
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        {sortByOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Sort Direction */}
                  <Grid item xs={12} sm={2}>
                    <FormControl fullWidth>
                      <InputLabel id="sort-direction-label">{t(tokens.nav.sortDirection)}</InputLabel>
                      <Select
                        labelId="sort-direction-label"
                        value={sortDirection}
                        label="Sort Direction"
                        onChange={(e) => setSortDirection(e.target.value)}
                      >
                        {sortDirectionOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Start Date and Time */}
                  <Grid item xs={12} sm={2}>
                    <DateTimePicker
                      label={t(tokens.nav.start)}
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      ampm={false} // Use 24-hour format
                      inputFormat="yyyy-MM-dd HH:mm"
                    />
                  </Grid>

                  {/* End Date and Time */}
                  <Grid item xs={12} sm={2}>
                    <DateTimePicker
                      label={t(tokens.nav.end)}
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      ampm={false} // Use 24-hour format
                      inputFormat="yyyy-MM-dd HH:mm"
                    />
                  </Grid>

                  {/* Filter Buttons */}
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="outlined"
                        sx={{ color: 'primary.main' }}
                        onClick={handleClearFilters}
                        size="small"
                      >
                        {t(tokens.nav.clearFilter)}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </Box>

            {/* Pagination Info */}
            <Box sx={{ marginTop: 2, marginBottom: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalRecords)} {t(tokens.nav.of)}{' '}
                {totalRecords} {t(tokens.nav.records)}
              </Typography>
            </Box>

            {/* Transactions Table */}
            <Box sx={{ marginTop: 2 }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t(tokens.nav.client)}</TableCell>
                      <TableCell>{t(tokens.nav.transaction)}</TableCell>
                      <TableCell>{t(tokens.nav.note)}</TableCell>
                      <TableCell>{t(tokens.nav.amount)} (VND)</TableCell>
                      <TableCell>{t(tokens.nav.createdDate)}</TableCell>
                      <TableCell>{t(tokens.nav.transactionType)}</TableCell>
                      <TableCell>{t(tokens.nav.status)}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            Loading...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (userTopupsInfo || []).length > 0 ? (
                      (userTopupsInfo || []).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{userData?.username || '-'}</TableCell>
                          <TableCell>{row.transactionCode || '-'}</TableCell>
                          <TableCell>{row.contents || '-'}</TableCell>
                          <TableCell>
                            <Typography color={row.coin > 0 ? 'success.main' : 'error.main'} fontWeight="medium">
                              {row.coin > 0 ? '+' : ''}
                              {handleAmountFormat(Math.abs(row.coin || 0))}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {row.createdDate ? format(new Date(row.createdDate * 1000), 'yyyy-MM-dd HH:mm:ss') : '-'}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor:
                                  row.transactionType === 'IN'
                                    ? 'success.light'
                                    : row.transactionType === 'OUT'
                                      ? 'error.light'
                                      : row.transactionType === 'USE'
                                        ? 'warning.light'
                                        : row.transactionType === 'MAKE'
                                          ? 'success.light'
                                          : row.transactionType === 'REFUND'
                                            ? 'success.light'
                                            : 'grey.light',
                                color:
                                  row.transactionType === 'IN'
                                    ? 'success.dark'
                                    : row.transactionType === 'OUT'
                                      ? 'error.dark'
                                      : row.transactionType === 'USE'
                                        ? 'warning.dark'
                                        : row.transactionType === 'MAKE'
                                          ? 'success.dark'
                                          : row.transactionType === 'REFUND'
                                            ? 'success.dark'
                                            : 'grey.dark',
                                textAlign: 'center',
                              }}
                            >
                              {typeTransactionVi[row.transactionType] || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={formatStatusTransaction(row.status)}
                              color={getStatusTransactionColor(row.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No transactions found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Use OrderPagination component */}
              {/* {totalPages > 1 && ( */}
              <OrderPagination
                page={page}
                totalPages={totalPages}
                totalOrders={totalRecords}
                limit={pageSize}
                onChangePage={handlePageChange}
                onChangeLimit={handlePageSizeChange}
              />
              {/* )} */}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
