import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';

const PageLayout = ({ role = null, sidebarOpen = false, toggleSidebar = () => {}, onBoardChange = () => {}, children }) => {
  return (
    <>
      <Seo title="Ideas" />
      <Header onBoardChange={onBoardChange} showBoards={true} role={role} />
      <Toolbar />

      <Box sx={{ display: 'flex' }}>
        {role && <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} role={role} />}
        <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default PageLayout;
