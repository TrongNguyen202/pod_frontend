import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TablePagination,
  Button,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';
import FormDialog from 'src/components/popup';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchInfoBoardByBoardId } from 'src/redux/reducers/products';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';

const data = [
  { id: '1', title: 'video board', client: { name: 'Nguyễn Đình Trọng', email: 'trongprotein@gmail.com' } },
  { id: '2', title: 'video 3123', client: { name: 'Nguyễn Đình Trọng', email: 'trongprotein@gmail.com' } },
  { id: '3', title: 'newboard1', client: { name: 'Nguyễn Đình Trọng', email: 'trongprotein@gmail.com' } },
  { id: '4', title: 'trong nguyen', client: { name: 'Nguyễn Đình Trọng', email: 'trongprotein@gmail.com' } },
];

const fields = [
  { name: 'title', label: 'Title', fullWidth: true, required: true },
  {
    name: 'product_types',
    label: 'Product Types',
    type: 'select',
    multiple: true,
    options: [
      { label: 'T-shirt', value: 'T-shirt' },
      { label: 'Shirt', value: 'shirt' },
      { label: 'Sweater', value: 'sweater' },
    ],
  },
  {
    name: 'design_type',
    label: 'Default Design Type',
    type: 'select',
    options: [
      { label: 'Clone', value: 'Clone' },
      { label: 'Redesign', value: 'Redesign' },
      { label: 'New', value: 'New' },
    ],
  },
];

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [boardId, setBoardId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const dispatch = useAppDispatch();
  const { loading, products = [], error } = useAppSelector((state) => state.products);
  const [quickDesignData, setQuickDesignData] = useState({});
  const { t } = useTranslation();

  // Lấy board từ localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('current_board_id');
      if (savedId) {
        setBoardId(savedId === 'null' ? null : savedId);
      }
    }
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelect = (rowId) => {
    setSelected((prevSelected) => {
      const newSelected = prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId];
      setAllSelected(newSelected.length === data.length);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelected((prevSelected) => {
      if (allSelected) {
        return [];
      } else {
        return data.map((row) => row.id);
      }
    });
    setAllSelected((prev) => !prev);
  };

  useEffect(() => {
    if (boardId) {
      console.log(boardId);
      dispatch(fetchInfoBoardByBoardId({ boardId }));
      console.log('by id; ', products);
    }
  }, [dispatch, boardId]);

  useEffect(() => {
    setQuickDesignData(products);
  }, [products, boardId]);

  const handleUpdateIdea = (updatedIdea) => {
    console.log(updatedIdea);
    setQuickDesignData(updatedIdea);
  };

  const handleSubmit = async (formData, onAfterSubmit) => {
    const { id, ...payload } = formData;

    try {
      if (id) {
        const res = await axios.put(`https://6848f91945f4c0f5ee6f902e.mockapi.io/api/v1/free/${id}`, payload);
        console.log('Updated successfully:', res.data);
        onAfterSubmit?.(res.data);
      } else {
        const res = await axios.post(`https://6848f91945f4c0f5ee6f902e.mockapi.io/api/v1/free`, payload);
        console.log('Created successfully:', res.data);
        onAfterSubmit?.(res.data);
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <>
      <Seo title="Boards" />
      <Header showBoards={false} />
      <Toolbar />
      <Box sx={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Grid position={'relative'} size={4} marginBottom={2} right={0} display={'flex'} justifyContent={'end'}>
            <Button
              sx={{ m: 0 }}
              variant="contained"
              color="primary"
              size="medium"
              component={Link}
              href="/ideas/create"
            >
              {t(tokens.nav.addnew)}
            </Button>
          </Grid>
          <Box>
            <Card>
              <CardContent>
                <Grid
                  xs={12}
                  sm={6}
                  md={3}
                  size={12}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}
                >
                  <Grid
                    size={8}
                    position="static"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '85%',
                      backgroundColor: '#fff',
                    }}
                  >
                    <TextField
                      variant="outlined"
                      InputProps={{
                        style: {
                          color: '#000',
                        },
                      }}
                      placeholder={t(tokens.nav.search)}
                      sx={{
                        '& .MuiInputBase-input::placeholder': {
                          color: '#000',
                          opacity: 1,
                        },
                        marginRight: 2,
                        padding: 0,
                        flexGrow: 1,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox checked={allSelected} onChange={handleSelectAll} disabled={data.length === 0} />
                        </TableCell>
                        <TableCell>{t(tokens.nav.title)}</TableCell>
                        <TableCell>{t(tokens.nav.client)}</TableCell>
                        <TableCell>{t(tokens.nav.action)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} />
                          </TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <div>
                              {row.client.name}
                              <br />
                              {row.client.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormDialog
                              buttonLabel="Edit"
                              title="Edit Board"
                              fields={fields}
                              onSubmit={(data) => handleSubmit(data, handleUpdateIdea)}
                              initialData={quickDesignData}
                              // onClick={handleOpenEditForm}
                              buttonProps={{
                                sx: {},
                                variant: 'contained',
                                color: 'primary',
                                size: 'medium',
                              }}
                            />
                            <FormDialog
                              buttonLabel="Delete"
                              title="Delete Board"
                              fields={[
                                { name: 'title', label: 'Title' },
                                { name: 'description', label: 'Description', multiline: true, rows: 4 },
                                // Thêm các field bạn muốn trong form
                              ]}
                              onSubmit={(data) => {
                                console.log('Form data submitted:', data);
                                // Xử lý gửi data ở đây, ví dụ gọi API hoặc chuyển trang
                              }}
                              buttonProps={{
                                sx: { ml: 2 },
                                variant: 'contained',
                                color: 'primary',
                                size: 'medium',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[20]}
                  component="div"
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                  labelRowsPerPage="Items per page:"
                />
              </Paper>
            </Card>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Page;
