'use client';

import React, { useState } from 'react';
import { Button, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

const ClickDropdownMenu = React.memo(function ClickDropdownMenu({
  buttonLabel,
  options,
  onSelect,
  buttonProps,
  userInfo,
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    onSelect?.(option);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {buttonLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ mt: 1 }}
      >
        {userInfo && (
          <>
            <Box sx={{ px: 2, pt: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {userInfo.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        {options.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => handleSelect(opt)}
            sx={{
              color: opt.value === 'logout' ? 'error.main' : 'inherit',
              fontWeight: opt.value === 'logout' ? 'bold' : 'normal',
            }}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

export default ClickDropdownMenu;
