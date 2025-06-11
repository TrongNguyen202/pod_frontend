import React, { useState, useRef } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const DropdownMenu = React.memo(function DropdownMenu({ buttonLabel, options, onSelect, buttonProps }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (event) => {
    clearTimeout(timeoutRef.current);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    // Delay 150ms để tránh việc user rê chuột quá nhanh
    timeoutRef.current = setTimeout(() => {
      setAnchorEl(null);
    }, 150);
  };

  const handleMenuEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMenuLeave = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    onSelect?.(option);
    setAnchorEl(null);
  };

  return (
    <>
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...buttonProps}>
        {buttonLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        MenuListProps={{
          onMouseEnter: handleMenuEnter,
          onMouseLeave: handleMenuLeave,
        }}
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

export default DropdownMenu;
