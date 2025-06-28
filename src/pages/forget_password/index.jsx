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
import { fetchUserInfo, setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { useEffect } from 'react';
import Link from 'next/link';

const initialValues = {
  username: '',
  phone: '',
  submit: null,
};

const validationSchema = Yup.object({
  username: Yup.string().max(255).required('Username is required'),
  phone: Yup.string().max(255).required('Password is required'),
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
        const res = await RepositoryRemote.auth.requestResetPassword({
          username: values.username,
        });
      } catch (err) {
        if (isMounted()) {
          toast.error('Tên đăng nhập không đúng!');
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
      <Seo title="Forget Password" />
      <div>
        <Card elevation={16}>
          <CardHeader sx={{ pb: 0, fontSize: 26 }} title="Forget Password" className="!text-3xl" />
          <CardContent className='relative'>
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
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Số điện thoại"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
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
                Reset
              </Button>
            </form>
            <Link href="/auth/login" className="relative bottom-0 text-sm text-blue-600 hover:underline">
              Đăng nhập?
            </Link>
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
