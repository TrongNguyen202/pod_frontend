'use client';

import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LOCAL_STORAGE_KEY } from 'src/constants';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchUserInfo, setAccount, setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { Box } from '@mui/material';
import { useRouter } from '../../../hooks/use-router';
import { paths } from '../../../paths';
import { usePathname } from 'next/navigation';

export const AuthProvider = (props) => {
  const { children } = props;
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.auth);

  const initialize = useCallback(async () => {
    if (pathname === paths.auth.jwt.login) {
      return;
    }
    try {
      const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      if (!accessToken) {
        const href = paths.auth.jwt.login;
        router.replace(href);
      }
      dispatch(fetchUserInfo());
    } catch (err) {
      dispatch(setAuthenticate({ isAuthenticated: false }));
      dispatch(setAccount(null));
    } finally {
      dispatch(setInitialized(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(setAuthenticate({ isAuthenticated: true }));
    }
  }, [account]);

  useEffect(() => {
    initialize();
  }, []);

  // const signIn = useCallback(async (values) => {}, []);
  //
  // const signUp = useCallback(
  //   async (email, name, password) => {
  //     const { accessToken } = await authApi.signUp({ email, name, password });
  //     const user = await authApi.me({ accessToken });
  //
  //     localStorage.setItem(STORAGE_KEY, accessToken);
  //
  //     dispatch({
  //       type: ActionType.SIGN_UP,
  //       payload: {
  //         user,
  //       },
  //     });
  //   },
  //   [dispatch],
  // );
  //
  // const signOut = useCallback(async () => {}, [dispatch]);

  return <Box>{children}</Box>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
