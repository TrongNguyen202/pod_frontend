import React from 'react';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import { ChevronLeft, ChevronRight, Home, Star } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, toggleSidebar }) => {
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
        <ListItem sx={{ cursor: 'pointer' }} button>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText
            primary="Ideas"
            sx={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s',
              minWidth: 0,
              ml: open ? 1 : 0,
            }}
          />
        </ListItem>

        <ListItem sx={{ cursor: 'pointer' }} button>
          <ListItemIcon>
            <Star />
          </ListItemIcon>
          <ListItemText
            primary="Boards"
            sx={{
              opacity: open ? 1 : 0,
              transition: 'opacity 0.3s',
              minWidth: 0,
              ml: open ? 1 : 0,
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
            // bottom: 0,
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
