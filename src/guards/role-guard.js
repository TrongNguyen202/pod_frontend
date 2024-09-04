import PropTypes from 'prop-types';
import { useAppSelector } from 'src/redux/hook';
import { Box } from '@mui/system';
import { permission } from '../constants';

export const RoleGuard = (props) => {
  const { children, permissions } = props;
  const { account } = useAppSelector((state) => state.auth);

  if (
    permissions &&
    !account?.role?.includes(permission.ADMIN) &&
    !permissions?.some((permission) => account?.role?.includes(permission))
  ) {
    return <Box className="p-3">Bạn không có quyền truy cập trang này.</Box>;
  }

  return <>{children}</>;
};

RoleGuard.propTypes = {
  children: PropTypes.node,
};
