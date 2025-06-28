import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Badge,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  HourglassEmpty,
  TrendingUp,
  TrendingDown,
  CurrencyExchange,
  Search,
  FilterList,
  Check,
  Close,
  Info,
  History,
} from "@mui/icons-material";
import AdminLayout from "../../../layouts/admin/layout";

/******************************************************************
 * UTILS
 *****************************************************************/

const COLOR_MAP = {
  success: {
    text: "text-green-600",
    bg: "bg-green-50",
    chip: "success",
  },
  error: {
    text: "text-red-600",
    bg: "bg-red-50",
    chip: "error",
  },
  warning: {
    text: "text-amber-600",
    bg: "bg-amber-50",
    chip: "warning",
  },
  info: {
    text: "text-sky-600",
    bg: "bg-sky-50",
    chip: "info",
  },
};

/******************************************************************
 * PRESENTATIONAL COMPONENTS
 *****************************************************************/

const StatsCard = ({ title, value, subtitle, Icon, color }) => {
  const { text, bg } = COLOR_MAP[color] || COLOR_MAP.info;
  return (
    <Card elevation={0} className="h-full rounded-2xl border border-gray-100">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div className={`p-3 rounded-2xl ${bg} flex items-center justify-center`}>
            <Icon className={`${text}`} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{value}</h3>
          <p className="text-sm text-gray-500 mb-1 font-medium">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const TransactionRow = ({ transaction, onApprove, onReject, onDetail }) => {
  const isDeposit = transaction.type === "deposit";
  const amountColor = isDeposit ? "success" : "error";
  const { text } = COLOR_MAP[amountColor];
  return (
    <TableRow hover>
      <TableCell>
        <p className="font-medium text-sm">{transaction.id}</p>
        <p className="text-xs text-gray-500">{transaction.bank || "VNP: 14127832"}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary-600">
            {transaction.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <div>
            <p className="font-medium text-sm">{transaction.user.name}</p>
            <p className="text-xs text-gray-500">ID: {transaction.user.id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Chip
          label={isDeposit ? "Nạp tiền" : "Rút tiền"}
          color={COLOR_MAP[amountColor].chip}
          size="small"
          icon={isDeposit ? <TrendingUp /> : <TrendingDown />}
        />
      </TableCell>
      <TableCell>
        <p className={`font-bold text-sm ${text}`}>
          {isDeposit ? "+" : "-"}
          {transaction.amount.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">VND</p>
      </TableCell>
      <TableCell>
        <p className={`font-medium text-sm ${text}`}>
          {isDeposit ? "+" : "-"}
          {transaction.points}
        </p>
        <p className="text-xs text-gray-500">Points</p>
      </TableCell>
      <TableCell>
        <p className="text-sm">{transaction.date}</p>
        <p className="text-xs text-gray-500">{transaction.time}</p>
      </TableCell>
      <TableCell>
        <Chip
          label={transaction.statusLabel}
          variant="outlined"
          size="small"
          color="warning"
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <IconButton
            size="small"
            color="success"
            onClick={() => onApprove(transaction.id)}
          >
            <Check fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onReject(transaction.id)}
          >
            <Close fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDetail(transaction.id)}>
            <Info fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

/******************************************************************
 * MAIN PAGE COMPONENT
 *****************************************************************/

const Page = () => {
  /* --------------------------------------------------------------------
   * STATE
   * ------------------------------------------------------------------*/
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* --------------------------------------------------------------------
   * TAB META
   * ------------------------------------------------------------------*/
  const tabs = [
    { label: "Chờ duyệt", value: 0, key: "pending", icon: HourglassEmpty },
    { label: "Nạp tiền", value: 1, key: "deposit", icon: TrendingUp },
    { label: "Rút tiền", value: 2, key: "withdraw", icon: TrendingDown },
    { label: "Lịch sử", value: 3, key: "history", icon: History },
  ];

  /* --------------------------------------------------------------------
   * DUMMY DATA (should come from API)
   * ------------------------------------------------------------------*/
  const transactions = [
    {
      id: "TXN20250612001",
      user: { name: "Nguyễn Hoàng", id: "123456" },
      type: "deposit",
      amount: 500.000,
      points: 50,
      date: "2025-06-12",
      time: "14:30",
      status: "pending",
      statusLabel: "CHỜ DUYỆT",
      bank: "VNP: 14127832",
    },
    {
      id: "TXN01235",
      user: { name: "Mai Thảo", id: "DESIGN" },
      type: "withdraw",
      amount: 200.000,
      points: 20,
      date: "2025-06-12",
      time: "13:45",
      status: "pending",
      statusLabel: "CHỜ DUYỆT",
    },
    {
      id: "TXN01236",
      user: { name: "Võ Duy", id: "USER" },
      type: "deposit",
      amount: 1.000000,
      points: 100,
      date: "2025-06-12",
      time: "12:15",
      status: "approved",
      statusLabel: "ĐÃ DUYỆT",
    },
  ];

  /* --------------------------------------------------------------------
   * MEMOIZED FILTERING LOGIC
   * ------------------------------------------------------------------*/
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      // TAB filter (status or type)
      const tab = tabs.find((t) => t.value === activeTab);
      if (!tab) return true;
      switch (tab.key) {
        case "pending":
          if (txn.status !== "pending") return false;
          break;
        case "deposit":
          if (txn.type !== "deposit") return false;
          break;
        case "withdraw":
          if (txn.type !== "withdraw") return false;
          break;
        case "history":
          // show all for history
          break;
        default:
          break;
      }

      // Search filter
      const keyword = searchTerm.toLowerCase();
      if (
        keyword &&
        !(
          txn.id.toLowerCase().includes(keyword) ||
          txn.user.name.toLowerCase().includes(keyword) ||
          txn.user.id.toLowerCase().includes(keyword)
        )
      )
        return false;

      // User type filter
      if (userType !== "all" && txn.user.id.toLowerCase() !== userType) return false;

      // Date range filter (ISO yyyy-mm-dd)
      if (fromDate && txn.date < fromDate) return false;
      if (toDate && txn.date > toDate) return false;

      return true;
    });
  }, [activeTab, searchTerm, userType, fromDate, toDate]);

  /* --------------------------------------------------------------------
   * CALLBACKS
   * ------------------------------------------------------------------*/
  const handleApprove = (id) => console.log("Approve", id);
  const handleReject = (id) => console.log("Reject", id);
  const handleDetail = (id) => console.log("Detail", id);

  /* --------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------*/
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* STATS */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            {
              title: "GIAO DỊCH CHỜ DUYỆT",
              value: "23",
              subtitle: "Nạp tiền: 18 | Rút tiền: 5",
              Icon: HourglassEmpty,
              color: "warning",
            },
            {
              title: "TỔNG NẠP HÔM NAY",
              value: "45.8M",
              subtitle: "VND | 4,580 Points",
              Icon: TrendingUp,
              color: "success",
            },
            {
              title: "TỔNG RÚT HÔM NAY",
              value: "12.3M",
              subtitle: "VND | 1,230 Points",
              Icon: TrendingDown,
              color: "error",
            },
            {
              title: "TỶ LỆ CHUYỂN ĐỔI",
              value: "1:100",
              subtitle: "1 Point = 10,000 VND",
              Icon: CurrencyExchange,
              color: "info",
            },
          ].map((s, i) => (
            <StatsCard key={i} {...s} />
          ))}
        </div>

        {/* TABS */}
        <div className="bg-white rounded-2xl border mb-6 overflow-x-auto">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ minHeight: 64 }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                disableRipple
                label={
                  <div className="flex items-center gap-2">
                    <tab.icon />
                    {tab.label}
                    {tab.value !== 3 && (
                      <Badge
                        badgeContent={
                          tab.key === "pending"
                            ? transactions.filter((t) => t.status === "pending").length
                            : transactions.filter((t) => t.type === tab.key).length
                        }
                        color="primary"
                        className="ml-2"
                      />
                    )}
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-12 w-full items-center">
            <div className="md:col-span-4 lg:col-span-3">
              <TextField
                fullWidth
                placeholder="Mã GD, tên user, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <Search className="mr-2 text-gray-400" /> }}
              />
            </div>
            <div className="md:col-span-4 lg:col-span-2">
              <FormControl fullWidth>
                <InputLabel>Loại User</InputLabel>
                <Select
                  value={userType}
                  label="Loại User"
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <TextField
                fullWidth
                type="date"
                label="Từ ngày"
                value={fromDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <TextField
                fullWidth
                type="date"
                label="Đến ngày"
                value={toDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Button
                fullWidth
                variant="contained"
                className="h-14 normal-case font-medium"
                startIcon={<FilterList />}
              >
                Lọc
              </Button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border overflow-x-auto">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell className="font-bold">MÃ GD</TableCell>
                  <TableCell className="font-bold">USER</TableCell>
                  <TableCell className="font-bold">LOẠI</TableCell>
                  <TableCell className="font-bold">SỐ TIỀN</TableCell>
                  <TableCell className="font-bold">POINTS</TableCell>
                  <TableCell className="font-bold">THỜI GIAN</TableCell>
                  <TableCell className="font-bold">TRẠNG THÁI</TableCell>
                  <TableCell className="font-bold">THAO TÁC</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDetail={handleDetail}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;
