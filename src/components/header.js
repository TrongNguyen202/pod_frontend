import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import Card from '@mui/material/Card';
import Link from 'next/link';

const Header = () => {
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
          <Select
            defaultValue="All boards"
            variant="outlined"
            size="medium"
            sx={{
              mr: 2,
              height: '40px', // hoặc 36px/48px tuỳ thiết kế
              '& .MuiSelect-select': {
                paddingY: '8px', // chỉnh padding bên trong cho căn giữa
              },
            }}
          >
            <MenuItem value="All boards">All boards</MenuItem>
            <MenuItem value="Board 1">Board 1</MenuItem>
            <MenuItem value="Board 2">Board 2</MenuItem>
            <MenuItem value="Board 3">Board 3</MenuItem>
          </Select>

          <Button
            component="span"
            variant="outlined"
            size="medium"
            sx={{
              ml: 1,
              mr: 2,
              color: 'black',
              height: '40px',
              // textTransform: 'none',
            }}
            onClick={() => alert('Quick Design')}
          >
            Quick Design
          </Button>
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
              <Button
                variant="contained"
                sx={{
                  padding: '8px 16px',
                  backgroundColor: 'primary',
                  color: 'white',
                  borderRadius: 0,
                  minWidth: 0,
                }}
                onClick={() => alert('Pink more')}
              >
                :
              </Button>
            </Card>
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
