import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';
import { useAppSelector } from 'src/redux/hook';
import { removeStorages } from '../utils/auth';

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated, isInitialized, account, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (loading && !isAuthenticated) {
      return;
    }
    if (!loading && !account) {
      removeStorages();
      const href = loginPaths.jwt;
      router.replace(href);
    }
  }, [loading, account, isAuthenticated]);

  if (!account || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
