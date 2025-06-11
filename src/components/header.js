import React from 'react';
import { useEffect, useState } from 'react';
import { Drawer, AppBar, Toolbar, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import Card from '@mui/material/Card';
import Link from 'next/link';
import FormDialog from 'src/components/popup';
import DropdownMenu from 'src/components/dropdown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';

// Định nghĩa danh sách boards với id và label
const boards = [
  { id: null, label: 'All boards' },
  { id: 1, label: 'Board 1' },
  { id: 2, label: 'Board 2' },
  { id: 3, label: 'Board 3' },
];

const Header = ({ onBoardChange, showBoards, quickDesignData, setQuickDesignData, fields, currentBoardId }) => {
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

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

  const handleSelect = (opt) => {
    if (opt.value === 'add_pink') {
      setOpenDrawer(true);
    } else {
      alert(`${opt.label}...`);
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
              <Select
                value={selectedBoardId ?? 'null'}
                onChange={handleChange}
                variant="outlined"
                size="medium"
                sx={{
                  mr: 2,
                  height: '40px',
                  '& .MuiSelect-select': {
                    paddingY: '8px',
                  },
                }}
              >
                {boards.map((board) => (
                  <MenuItem key={board.id ?? 'null'} value={board.id ?? 'null'}>
                    {board.label ? board.label : 'All Boards'}
                  </MenuItem>
                ))}
              </Select>

              <FormDialog
                buttonLabel="Quick Design"
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
                  { label: 'Add Pink', value: 'add_pink' },
                  { label: 'Board Infomation', value: 'board_infomation' },
                  { label: 'Board Activity', value: 'board_activity' },
                  { label: 'Monthly Balances', value: 'monthly_balances' },
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
          </div>

          <Button sx={{ ml: 1, color: 'black' }} onClick={() => alert('Notifications')}>
            <Box component="span" sx={{ fontSize: '1.5rem', marginRight: '8px' }}>
              🔔
            </Box>
          </Button>

          <Button sx={{ ml: 1, color: 'black' }} onClick={() => alert('User Profile')}>
            <Box component="span" sx={{ fontSize: '1.5rem', textAlign: 'center' }}>
              👤
            </Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
