import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchUserByEmail } from 'src/redux/reducers/user';

export const useUserData = (dispatch, setEmail, walletUpdated) => {
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      dispatch(fetchUserByEmail({ email: storedEmail }));
    }
  }, [dispatch, setEmail, walletUpdated]);

  return useAppSelector((state) => state.users.userInfo);
};
