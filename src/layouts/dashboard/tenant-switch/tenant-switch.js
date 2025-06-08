import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';

import { TenantPopover } from './tenant-popover';

const tenants = ['Devias', 'Acme Corp'];

export const TenantSwitch = (props) => {
  const popover = usePopover();

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" variant="h6">
            MediaResolver
          </Typography>
          <Typography color="neutral.400" variant="body2">
            Turn Me Anything
          </Typography>
        </Box>
      </Stack>
      <TenantPopover
        anchorEl={popover.anchorRef.current}
        onChange={popover.handleClose}
        onClose={popover.handleClose}
        open={popover.open}
        tenants={tenants}
      />
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
