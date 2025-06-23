import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import { ChevronLeft, ChevronRight, Home, Star } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { checkRole } from 'src/utils';

const drawerWidth = 240;

const Sidebar = ({ open, toggleSidebar, role }) => {
  const router = useRouter();
  const { pathname } = router;
  const { isCustomer } = checkRole(role);
  // Hàm check active dựa vào pathname
  const isActive = (path) => pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        height: '100%',
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        boxShadow: '#f5f5f5',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 60,
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
      open={open}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          component={Link}
          href="/ideas"
          sx={{
            cursor: 'pointer',
            bgcolor: isActive('/ideas') ? 'primary.main' : 'inherit',
            color: isActive('/ideas') ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: isActive('/ideas') ? 'primary.dark' : '#f5f5f5',
            },
          }}
          button
        >
          <ListItemIcon sx={{ color: isActive('/ideas') ? 'white' : 'inherit' }}>
            <Home />
          </ListItemIcon>
          <ListItemText
            primary="Ideas"
            sx={{
              opacity: open ? 1 : 0,
              transition: '0.3s',
              minWidth: 0,
              ml: open ? 1 : 0,
              color: isActive('/ideas') ? 'white' : 'inherit',
            }}
          />
        </ListItem>

        {isCustomer && (
          <ListItem
            component={Link}
            href="/boards"
            sx={{
              cursor: 'pointer',
              bgcolor: isActive('/boards') ? 'primary.main' : 'inherit',
              color: isActive('/boards') ? 'white' : 'inherit',
              '&:hover': {
                bgcolor: isActive('/boards') ? 'primary.dark' : '#f5f5f5',
              },
            }}
            button
          >
            <ListItemIcon sx={{ color: isActive('/boards') ? 'white' : 'inherit' }}>
              <Star />
            </ListItemIcon>
            <ListItemText
              primary="Boards"
              sx={{
                opacity: open ? 1 : 0,
                transition: '0.3s',
                minWidth: 0,
                ml: open ? 1 : 0,
                color: isActive('/boards') ? 'white' : 'inherit',
              }}
            />
          </ListItem>
        )}

        <ListItem
          component={Link}
          href="/balances"
          sx={{
            cursor: 'pointer',
            bgcolor: isActive('/balances') ? 'primary.main' : 'inherit',
            color: isActive('/balances') ? 'white' : 'inherit',
            '&:hover': {
              bgcolor: isActive('/balances') ? 'primary.dark' : '#f5f5f5',
            },
          }}
          button
        >
          <ListItemIcon sx={{ color: isActive('/balances') ? 'white' : 'inherit' }}>
            <AccountBalanceWalletIcon />
          </ListItemIcon>
          <ListItemText
            primary="Balances"
            sx={{
              opacity: open ? 1 : 0,
              transition: '0.3s',
              minWidth: 0,
              ml: open ? 1 : 0,
              color: isActive('/balances') ? 'white' : 'inherit',
            }}
          />
        </ListItem>
      </List>

      <Toolbar
        sx={{
          position: 'relative',
          height: '64px',
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '29px',
            transform: 'translate(-50%, -50%)',
            zIndex: 1300,
            backgroundColor: 'white',
            boxShadow: 1,
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Toolbar>
    </Drawer>
  );
};

export default Sidebar;
