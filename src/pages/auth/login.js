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
import toast from 'react-hot-toast';
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
        const userAgent = navigator.userAgent;
        const deviceId = crypto.randomUUID();
        const ipRes = await fetch('https://api64.ipify.org?format=json');
        const { ip } = await ipRes.json();
        const res = await RepositoryRemote.auth.requestLogin({
          email: values.email,
          password: values.password,
          ipAddress: ip,
          userAgent,
          deviceId,
        });
        if (res?.data?.accessToken && res?.data?.refreshToken) {
          const decodedToken = jwtDecode(res?.data?.accessToken);

          localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, res.data.accessToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, res.data.refreshToken);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_ROLE, decodedToken.roles);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_IP, decodedToken.ipAddress);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_AGENT, decodedToken.userAgent);
          localStorage.setItem(LOCAL_STORAGE_KEY.DEVICE_ID, decodedToken.deviceId);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER_EMAIL, decodedToken.sub);

          dispatch(setInitialized(true));

          // const profileRes = await dispatch(fetchUserInfo()).unwrap();
          dispatch(setAuthenticate({ isAuthenticated: true }));

          toast.success('Đăng nhập thành công!');
          router.push(returnTo || '/ideas');
        }
      } catch (err) {
        if (isMounted()) {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
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
      <Seo title="Login" />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0, fontSize: 26 }} title="Log in" className="!text-3xl" />
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
                Log In
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
