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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Link from 'next/link';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';
import FormDialog from 'src/components/popup';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';

import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';
import toast from 'react-hot-toast';
import {
  fetchPostBoard,
  fetchDeleteBoardByIds,
  putBoardInfoByBoardId,
  fetchGetBoardsByUserId,
  fetchBoardInfoByBoardId,
} from 'src/redux/reducers/boards';
import { Delete } from '@mui/icons-material';

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [selected, setSelected] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [page, setPage] = useState(0);
  const [boardId, setBoardId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openAddBoard, setOpenAddBoard] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [role, setRole] = useState('');
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingBoardData, setEditingBoardData] = useState(null);

  const { data: boardsData } = useAppSelector((state) => state.boards.boardService);
  const { data: userData } = useAppSelector((state) => state.users.userInfo);
  const { data: productTypeData } = useAppSelector((state) => state.productTypes.productTypes);

  useEffect(() => {
    if (userData) {
      setRole(userData.role_name);
    }
  }, [userData]);
  const userId = userData?.id;
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
      setAllSelected(newSelected.length === boardsData.length);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelected((prevSelected) => {
      if (allSelected) {
        return [];
      } else {
        return boardsData.map((row) => row.id);
      }
    });
    setAllSelected((prev) => !prev);
  };

  const handleCreateBoard = async (formData) => {
    try {
      // formData.userId = userData?.id;
      const res = await dispatch(fetchPostBoard({ data: formData }));
      if (res.payload.status === 200) {
        await dispatch(fetchGetBoardsByUserId({ userId }));
        toast.success('Created Board Successfully!');
      }
    } catch (err) {
      toast.error('Create board fail:', err);
    }
  };
  const optionProductType = productTypeData.map((pt) => ({
    label: pt.name,
    value: pt.id,
  }));

  const handleOpenEditBoard = async (boardId) => {
    try {
      console.log(boardId);
      const res = await dispatch(fetchBoardInfoByBoardId({ boardId }));
      console.log(res);
      if (res.payload?.data) {
        setEditingBoardData(res.payload.data);
        setOpenEditDialog(true);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin board');
    }
  };

  const handleEditBoard = async (formData) => {
    try {
      const boardId = formData.id;

      const payload = {
        title: formData.title,
        productTypeIds: formData.productTypeIds,
        designType: formData.designType,
      };

      const res = await dispatch(putBoardInfoByBoardId({ boardId, data: payload }));
      console.log(res);
      if (res.payload?.status === 200) {
        toast.success('Board updated successfully');
        await dispatch(fetchGetBoardsByUserId({ userId }));
      } else {
        toast.error('Update failed');
      }
    } catch (error) {
      toast.error('Error updating board');
    }
  };

  const handleDeleteBoard = async () => {
    try {
      const res = await dispatch(fetchDeleteBoardByIds({ data: selected }));
      if (res.payload.status === 200) {
        toast.success('Deleted successfully!');
        setSelected([]);
        dispatch(fetchGetBoardsByUserId({ userId }));
      } else {
        toast.error('Delete error');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
    setOpenDialogDelete(false);
  };

  return (
    <>
      <Seo title="Boards" />
      <Header showBoards={false} />
      <Toolbar />
      <Box sx={{ display: 'flex' }}>
        {role && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} role={role} />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Box>
            <Card>
              <CardContent size={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Grid size={4}>
                  <Button onClick={() => setOpenAddBoard(true)} sx={{ backgroundColor: 'primary.main', color: '#fff' }}>
                    {t(tokens.nav.addnew)}
                  </Button>
                  <FormDialog
                    title={t(tokens.nav.addnew)}
                    fields={[
                      { name: 'title', label: 'Title', fullWidth: true, required: true },
                      {
                        name: 'productTypeIds',
                        label: 'Product Types',
                        type: 'select',
                        multiple: true,
                        options: optionProductType,
                      },
                      {
                        name: 'designType',
                        label: 'Default Design Type',
                        type: 'select',
                        options: [
                          { label: 'Clone', value: 'CLONE' },
                          { label: 'Re-design', value: 'RE_DESIGN' },
                          { label: 'New', value: 'NEW' },
                        ],
                      },
                    ]}
                    onSubmit={(data) => handleCreateBoard(data)}
                    initialData={[]}
                    openOverride={openAddBoard}
                    onCloseOverride={() => setOpenAddBoard(false)}
                  ></FormDialog>
                </Grid>
                <Grid xs={12} sm={6} md={3} size={8} width="90%">
                  <Grid
                    position="static"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
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
            <Card sx={{ marginTop: 2 }}>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={allSelected}
                            onChange={handleSelectAll}
                            disabled={boardsData.length === 0}
                          />
                        </TableCell>
                        <TableCell>{t(tokens.nav.title)}</TableCell>
                        <TableCell>{t(tokens.nav.client)}</TableCell>
                        <TableCell>{t(tokens.nav.action)}</TableCell>
                        <TableCell>
                          <Button
                            startIcon={<Delete />}
                            color="error"
                            disabled={selected.length === 0}
                            onClick={() => setOpenDialogDelete(true)}
                            sx={{
                              border: 'none',
                              outline: 'none',
                              boxShadow: 'none',
                              backgroundColor: 'transparent',
                              minWidth: 100,
                              height: 36,
                              '&:hover': {
                                backgroundColor: 'transparent',
                              },
                            }}
                          >
                            {selected.length > 0 && `(${selected.length})`}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {boardsData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} />
                          </TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <div>
                              {row.username}
                              <br />
                              {row.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleOpenEditBoard(row.id)}
                              variant="contained"
                              color="primary"
                              size="medium"
                            >
                              {t(tokens.nav.edit)}
                            </Button>
                            <FormDialog
                              title={t(tokens.nav.edit)}
                              fields={[
                                { name: 'title', label: t(tokens.nav.title), fullWidth: true, required: true },
                                {
                                  name: 'productTypeIds',
                                  label: t(tokens.nav.product_type),
                                  type: 'select',
                                  multiple: true,
                                  options: optionProductType,
                                },
                                {
                                  name: 'designType',
                                  label: t(tokens.nav.design_type),
                                  type: 'select',
                                  options: [
                                    { label: 'Clone', value: 'CLONE' },
                                    { label: 'Re-design', value: 'RE_DESIGN' },
                                    { label: 'New', value: 'NEW' },
                                  ],
                                },
                              ]}
                              onSubmit={(data) => handleEditBoard(data)}
                              initialData={editingBoardData}
                              openOverride={openEditDialog}
                              onCloseOverride={() => {
                                setOpenEditDialog(false);
                                setEditingBoardData(null);
                              }}
                            />

                            {/* <Button
                              onClick={() => setOpenDialogDelete(true)}
                              sx={{
                                color: '#fff',
                                backgroundColor: 'primary.main',
                                size: 'medium',
                                ml: 2,
                              }}
                            >
                              {t(tokens.nav.delete)}
                            </Button> */}
                            <Dialog open={openDialogDelete} onClose={() => setOpenDialogDelete(false)}>
                              <DialogTitle>{t(tokens.nav.submit)}</DialogTitle>
                              <DialogContent>
                                <Typography sx={{ textAlign: 'center', fontSize: '18px' }}>
                                  {t(tokens.nav.messageDeleteBoards)}
                                </Typography>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={() => setOpenDialogDelete(false)} variant="outlined">
                                  {t(tokens.nav.cancel)}
                                </Button>
                                <Button onClick={handleDeleteBoard} variant="contained" backgroundColor="primary.main">
                                  {t(tokens.nav.submit)}
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[20]}
                  component="div"
                  count={boardsData.length}
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
