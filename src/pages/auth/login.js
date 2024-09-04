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
import { fetchUserInfo, setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { useEffect } from 'react';

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  username: Yup.string().max(255).required('Username is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
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
        const res = await RepositoryRemote.auth.requestLogin({
          username: values.username,
          password: values.password,
        });

        if (res?.data?.access && res?.data?.refresh) {
          localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, res.data.access);
          localStorage.setItem(LOCAL_STORAGE_KEY.REFRESH_TOKEN, res.data.refresh);
          dispatch(setInitialized(true));
          dispatch(fetchUserInfo());
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
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Tên đăng nhập"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
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
        {/* <Stack
          spacing={3}
          sx={{ mt: 3 }}
        >
          <Alert severity="error">
            <div>
              You can use <b>demo@devias.io</b> and password <b>Password123!</b>
            </div>
          </Alert>
          <AuthIssuer issuer={issuer} />
        </Stack> */}
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
