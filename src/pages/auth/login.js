'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { paths } from 'src/paths';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEY } from 'src/constants';
import { RepositoryRemote } from 'src/services';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';
import { jwtDecode } from 'jwt-decode';

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().max(255).required('Username is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
  const { t } = useTranslation();
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const dispatch = useAppDispatch();
  const { account } = useAppSelector((state) => state.auth);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        console.log('🚀 Starting login process...', values);

        // Debug user agent
        const userAgent = navigator.userAgent;
        console.log('📱 User Agent:', userAgent);

        // Debug device ID generation
        let deviceId;
        try {
          deviceId = crypto.randomUUID();
          console.log('🔑 Device ID generated:', deviceId);
        } catch (error) {
          console.error('❌ Crypto API error:', error);
          deviceId = 'fallback-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
          console.log('🔄 Fallback Device ID:', deviceId);
        }

        // Debug IP detection
        let ip;
        try {
          console.log('🌐 Fetching IP address...');
          const ipRes = await fetch('https://api64.ipify.org?format=json');
          if (!ipRes.ok) {
            throw new Error(`HTTP error! status: ${ipRes.status}`);
          }
          const ipData = await ipRes.json();
          ip = ipData.ip;
          console.log('📍 IP Address:', ip);
        } catch (error) {
          console.error('❌ IP detection error:', error);
          ip = 'unknown';
        }

        // Debug login request
        const loginData = {
          email: values.email,
          password: values.password,
          ipAddress: ip,
          userAgent,
          deviceId,
        };
        console.log('📤 Login request data:', loginData);

        console.log('🔄 Sending login request...');
        const res = await RepositoryRemote.auth.requestLogin(loginData);
        console.log('📥 Login response:', res);

        if (res?.data?.accessToken && res?.data?.refreshToken) {
          console.log('✅ Login successful, processing tokens...');

          const decodedToken = jwtDecode(res?.data?.accessToken);
          console.log('🔓 Decoded token:', decodedToken);

          // Store tokens
          localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, res.data.accessToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, res.data.refreshToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_IP, decodedToken.ipAddress);
          localStorage.setItem(LOCAL_STORAGE_KEY.DEVICE_ID, decodedToken.deviceId);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_EMAIL, decodedToken.sub);

          dispatch(setInitialized(true));
          dispatch(setAuthenticate({ isAuthenticated: true }));
          toast.success('Đăng nhập thành công!');

          const redirectPath = decodedToken.role === 'admin' ? returnTo || '/admin/dashboard' : returnTo || '/ideas';

          console.log('🏃 Redirecting to:', redirectPath);
          router.push(redirectPath);
        } else {
          console.error('❌ Invalid response structure:', res);
          if (isMounted()) {
            toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
          }
          helpers.setErrors({ submit: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
        }
      } catch (err) {
        console.error('💥 Login error:', err);
        console.error('Error stack:', err.stack);

        if (isMounted()) {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
        helpers.setErrors({ submit: 'Có lỗi xảy ra trong quá trình đăng nhập!' });
      }
    },
  });

  useEffect(() => {
    if (account) {
      dispatch(setAuthenticate({ isAuthenticated: true }));
      if (isMounted()) {
        toast.success('Đăng nhập thành công!');
        router.push(returnTo || paths.dashboard.index);
      }
    }
  }, [account]);

  usePageView();

  return (
    <>
      <Seo title={t(tokens.nav.login)} />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0, fontSize: 26 }} title={t(tokens.nav.login)} className="!text-3xl" />
          <CardContent className="relative">
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label={`${t(tokens.nav.username)}`}
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label={`${t(tokens.nav.password)}`}
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <FormHelperText error sx={{ mt: 3 }}>
                  {formik.errors.submit}
                </FormHelperText>
              )}
              <Button
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                {t(tokens.nav.login)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
