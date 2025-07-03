import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useAppSelector } from 'src/redux/hook';
import { fetchUserByEmail } from 'src/redux/reducers/user';

export const useUserData = (dispatch, setEmail, walletUpdated) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tk-tk');
      if (token) {
        const decodedToken = jwtDecode(token);
        const storedEmail = decodedToken.sub;
        if (storedEmail) {
          setEmail(storedEmail);
          dispatch(fetchUserByEmail({ email: storedEmail }));
        }
      }
    }
  }, [dispatch, setEmail, walletUpdated]);

  return useAppSelector((state) => state.users.userInfo);
};
