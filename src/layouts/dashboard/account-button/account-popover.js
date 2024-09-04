import { useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/hooks/use-router';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { setAccount, setAuthenticate } from 'src/redux/reducers/auth';
import { removeStorages } from '../../../utils/auth';
import { permission } from '../../../constants';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized, account } = useAppSelector((state) => state.auth);

  const handleLogout = useCallback(async () => {
    removeStorages();
    dispatch(setAccount(null));
    dispatch(setAuthenticate({ isAuthenticated: false }));
  }, [router, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">{account?.username}</Typography>
        <Typography color="text.secondary" variant="body2" className="pb-2">
          {account?.email}
        </Typography>
        {account?.role?.map((role) => {
          return (
            <Typography color="text.secondary" key={role} variant="body2">
              {role === permission.ADMIN
                ? 'Admin'
                : role === permission.MANAGER
                  ? 'Manager'
                  : role === permission.SELLER
                    ? 'Seller'
                    : role === permission.DESIGNER
                      ? 'Designer'
                      : 'Guest'}
            </Typography>
          );
        })}
      </Box>
      <Divider />
      {/* <Box sx={{ p: 1 }}>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.social.profile}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <User03Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Profile</Typography>}
          />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Settings</Typography>}
          />
        </ListItemButton>
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.index}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <CreditCard01Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1">Billing</Typography>}
          />
        </ListItemButton>
      </Box> */}
      <Divider sx={{ my: '0 !important' }} />
      <Box
        sx={{
          display: 'flex',
          p: 1,
          justifyContent: 'center',
        }}
      >
        <Button color="inherit" onClick={handleLogout} size="small">
          Logout
        </Button>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
