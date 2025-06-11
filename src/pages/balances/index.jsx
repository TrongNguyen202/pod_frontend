import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  Paper,
  Button,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const mockData = [
  {
    id: 1,
    client: 'Client A',
    pink: 'PINK123',
    amount: 100000,
    rate: 23000,
    package: 'Standard',
    transactionId: 'TX123',
    createdAt: '2023-06-01',
    status: 'Completed',
    paymentConfirm: 'Yes',
    note: 'First Deposit',
  },
  {
    id: 2,
    client: 'Client B',
    pink: 'PINK456',
    amount: 200000,
    rate: 23000,
    package: 'Premium',
    transactionId: 'TX456',
    createdAt: '2023-06-05',
    status: 'Pending',
    paymentConfirm: 'No',
    note: 'Awaiting Confirmation',
  },
];

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [deposit, setDeposit] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const depositOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  return (
    <>
      <Seo title="Balances" />
      <Header showBoards={false} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
          <Box sx={{ padding: 2 }}>
            <Typography variant="h4">Balances</Typography>
            <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
              Make Deposit
            </Button>
            <Grid container spacing={2}>
              {/* Account Balance Cards */}
              {['Account Balance (PINK)', 'Deposited Pink', 'Fulfilled Pink', 'Expired Pink'].map((title, idx) => (
                <Grid item key={idx} size={3}>
                  <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="h5">0.00</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ marginTop: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  {/* Deposit Select */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="deposit-label">Deposit</InputLabel>
                      <Select
                        labelId="deposit-label"
                        value={deposit}
                        label="Deposit"
                        onChange={(e) => setDeposit(e.target.value)}
                      >
                        {depositOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Start Date */}
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1">→</Typography>
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={12} sm={3}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <Box sx={{ marginTop: 2 }}>
                {/* Table for displaying deposit data */}
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Client</TableCell>
                        <TableCell>Pink</TableCell>
                        <TableCell>Amount (VND)</TableCell>
                        <TableCell>Rate (VND)</TableCell>
                        <TableCell>Package</TableCell>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment Confirm</TableCell>
                        <TableCell>Note</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.client}</TableCell>
                          <TableCell>{row.pink}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.rate}</TableCell>
                          <TableCell>{row.package}</TableCell>
                          <TableCell>{row.transactionId}</TableCell>
                          <TableCell>{row.createdAt}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.paymentConfirm}</TableCell>
                          <TableCell>{row.note}</TableCell>
                        </TableRow>
                      ))}
                      {mockData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={10} align="center">
                            No data
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
