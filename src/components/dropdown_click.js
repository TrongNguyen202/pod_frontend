import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const ClickDropdownMenu = React.memo(function ClickDropdownMenu({ buttonLabel, options, onSelect, buttonProps }) {
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
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} onClick={() => handleSelect(opt)}>
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

export default ClickDropdownMenu;
