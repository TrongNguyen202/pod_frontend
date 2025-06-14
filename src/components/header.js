import React from 'react';
import { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import Card from '@mui/material/Card';
import Link from 'next/link';
import FormDialog from 'src/components/popup';
import DropdownMenu from 'src/components/dropdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import ClickDropdownMenu from './dropdown_click';
import { RepositoryRemote } from 'src/services';
import { useRouter } from 'src/hooks/use-router';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

const Header = ({ onBoardChange, showBoards, quickDesignData, setQuickDesignData, fields, currentBoardId }) => {
  const router = useRouter();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerBoardInfo, setOpenDrawerBoardInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { t } = useTranslation();

  // Định nghĩa danh sách boards với id và label
  const boards = [
    { id: null, label: `${t(tokens.nav.all)}` },
    { id: 1, label: 'Board 1' },
    { id: 2, label: 'Board 2' },
    { id: 3, label: 'Board 3' },
  ];

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

  const handleUpdateIdea = (updatedIdea) => {
    console.log(updatedIdea);
    setQuickDesignData(updatedIdea);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('current_board_id');
      if (stored) {
        const boardId = Number(stored);
        setSelectedBoardId(boardId);
        onBoardChange?.(boardId);
      }
    }
  }, []);

  const handleChange = (e) => {
    const boardId = e.target.value === 'null' ? null : Number(e.target.value);
    setSelectedBoardId(boardId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_board_id', String(boardId ?? 'null'));
    }
    onBoardChange?.(boardId);
  };

  const handleSelect = async (opt) => {
    if (opt.value === 'make_deposit') {
      setOpenDrawer(true);
    } else if (opt.value === 'board_infomation') {
      setOpenDrawerBoardInfo(true);
    } else if (opt.value === 'logout') {
      try {
        await RepositoryRemote.auth.requestLogout();
        localStorage.clear();
        toast.success('Đăng xuất thành công!');
        router.push('/auth/login');
      } catch (error) {
        console.error('Logout failed:', error);
        toast.error('Đăng xuất thất bại!');
      }
    } else if (opt.value === 'changepassword') {
      setOpenChangePassword(true);
    } else if (opt.value === 'userprofile') {
      router.push('/account/profile');
    } else {
      alert(`${opt.label}...`);
    }
  };

  const handleChangePassword = async (data) => {
    try {
      await RepositoryRemote.auth.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setOpenChangePassword(false);
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại!');
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: '#f5f5f5', zIndex: 99999999 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box
            component={Link}
            href="/ideas"
            variant="h4"
            width="fit-content"
            sx={{ color: 'pink', fontWeight: 'bold', display: 'flex', alignItems: 'center', mr: 2 }}
          >
            <Box
              component="img"
              src="/logo.png"
              sx={{
                width: '32px',
                height: '32px',
                objectFit: 'cover',
                borderRadius: 1,
                mr: 2,
                padding: 0,
              }}
            />
            Media Resolver
          </Box>
          {showBoards ? (
            <Box>
              <FormControl
                variant="outlined"
                size="medium"
                sx={{
                  minWidth: 200,
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none',
                    },
                  },
                }}
              >
                <InputLabel id="board-select-label">{t(tokens.nav.boards)}</InputLabel>
                <Select
                  labelId="board-select-label"
                  value={selectedBoardId ?? 'null'}
                  onChange={handleChange}
                  label={t(tokens.nav.boards)}
                  sx={{
                    '& .MuiSelect-select': {
                      paddingY: '8px',
                    },
                  }}
                >
                  {boards.map((board) => (
                    <MenuItem key={board.id ?? 'null'} value={board.id ?? 'null'}>
                      {board.label ? board.label : `${t(tokens.nav.all)}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormDialog
                buttonLabel={t(tokens.nav.quick_design)}
                title="Edit Board"
                fields={fields}
                onSubmit={(data) => handleSubmit(data, handleUpdateIdea)}
                initialData={quickDesignData}
                // onClick={handleOpenEditForm}
                buttonProps={{
                  component: 'span',
                  variant: 'outlined',
                  size: 'medium',
                  sx: {
                    ml: 1,
                    mr: 2,
                    color: 'black',
                    height: '40px',
                  },
                }}
              />
            </Box>
          ) : (
            <Box></Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <Card sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>
              <Button
                variant="contained"
                sx={{
                  padding: '8px 16px',
                  backgroundColor: 'primary',
                  color: 'white',
                  borderRadius: 0,
                  minWidth: 0,
                }}
                onClick={() => alert('Pink Design 1')}
              >
                0 VND
              </Button>
              <Button
                variant="contained"
                sx={{
                  padding: '8px 16px',
                  backgroundColor: 'primary',
                  color: 'white',
                  borderRadius: 0,
                  minWidth: 0,
                }}
                onClick={() => alert('Pink Design 2')}
              >
                0 VND
              </Button>
              <DropdownMenu
                buttonLabel={<MoreVertIcon />}
                options={[
                  { label: t(tokens.nav.make_deposit), value: 'make_deposit' },
                  { label: t(tokens.nav.board_infomation), value: 'board_infomation' },
                  { label: t(tokens.nav.board_activity), value: 'board_activity' },
                  { label: t(tokens.nav.monthly_balances), value: 'monthly_balances' },
                ]}
                onSelect={handleSelect}
                buttonProps={{
                  variant: 'contained',
                  sx: {
                    padding: '8px 16px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: 0,
                    minWidth: 0,
                  },
                }}
              />
            </Card>
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              ModalProps={{
                keepMounted: true, // Better performance on mobile
              }}
              sx={{ zIndex: 999999991 }}
            >
              <Box sx={{ width: 400, p: 3 }}>
                <Typography variant="h6">Add Pink Form</Typography>
                {/* Replace this with your actual form */}
                <Box mt={2}>
                  <input placeholder="Title" style={{ width: '100%', padding: 8 }} />
                  <textarea placeholder="Description" style={{ width: '100%', padding: 8, marginTop: 8 }} />
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setOpenDrawer(false)}>
                    Submit
                  </Button>
                </Box>
              </Box>
            </Drawer>

            <Drawer
              anchor="right"
              open={openDrawerBoardInfo}
              onClose={() => setOpenDrawerBoardInfo(false)}
              ModalProps={{
                keepMounted: true, // Better performance on mobile
              }}
              sx={{ zIndex: 999999991 }}
            >
              <Box sx={{ width: 400, p: 3 }}>
                <Typography variant="h6">Board Infomation</Typography>
                {/* Replace this with your actual form */}
                <Box mt={2}>
                  <input placeholder="Title" style={{ width: '100%', padding: 8 }} />
                  <textarea placeholder="Description" style={{ width: '100%', padding: 8, marginTop: 8 }} />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setOpenDrawerBoardInfo(false)}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </div>

          <Button sx={{ ml: 1, color: 'black' }} onClick={() => alert('Notifications')}>
            <Box component="span" sx={{ fontSize: '1.5rem', marginRight: '8px' }}>
              🔔
            </Box>
          </Button>

          <ClickDropdownMenu
            buttonLabel={'👤'}
            component="span"
            options={[
              { label: 'Change password', value: 'changepassword' },
              { label: 'User Profile', value: 'userprofile' },
              { label: 'Log out', value: 'logout' },
            ]}
            onSelect={handleSelect}
            buttonProps={{
              variant: 'text',
              sx: {
                padding: '18px 26px',
                borderRadius: 10,
                margin: '0',
                color: 'white',
                borderRadius: 0,
                minWidth: 0,
              },
            }}
          />
        </Box>
      </Toolbar>
      <FormDialog
        buttonLabel=""
        title="Đổi mật khẩu"
        fields={[
          { name: 'oldPassword', label: 'Mật khẩu cũ', type: 'text', required: true },
          { name: 'newPassword', label: 'Mật khẩu mới', type: 'text', required: true },
        ]}
        initialData={{ oldPassword: '', newPassword: '' }}
        onSubmit={handleChangePassword}
        buttonProps={{ style: { display: 'none' } }}
        openOverride={openChangePassword}
        onCloseOverride={() => setOpenChangePassword(false)}
      />
    </AppBar>
  );
};

export default Header;
