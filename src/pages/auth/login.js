'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSearchParams } from 'src/hooks/use-search-params';
import { Layout as AuthLayout } from 'src/layouts/auth/classic-layout';
import { toast } from 'react-toastify';
import { useAppDispatch } from 'src/redux/hook';
import { setAuthenticate, setInitialized } from 'src/redux/reducers/auth';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../locales/tokens';
import { authService } from 'src/services/authService';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const initialValues = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().max(255).required('Tài khoản là bắt buộc'),
  password: Yup.string().max(255).required('Mật khẩu là bắt buộc'),
});

const Page = () => {
  const { t } = useTranslation();
  const isMounted = useMounted();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const userInfo = await authService.login({
          email: values.email,
          password: values.password,
        });

        if (userInfo) {
          dispatch(setInitialized(true));
          dispatch(setAuthenticate({ isAuthenticated: true }));

          if (isMounted()) {
            toast.success('Đăng nhập thành công!');
          }

          const redirectPath = userInfo.role !== 'admin' ? returnTo || '/ideas' : returnTo || '/admin/dashboard';
          router.push(redirectPath);
        }
      } catch (err) {
        console.error('Login error:', err);

        if (isMounted()) {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
        helpers.setErrors({ submit: 'Có lỗi xảy ra trong quá trình đăng nhập!' });
      }
    },
  });

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
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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

              <FormHelperText sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="https://zalo.me/0968083967" underline="hover">
                  Liên hệ để đăng ký
                </Link>
              </FormHelperText>
            </form>

            {/* ✅ Dòng nhỏ Chính sách bảo mật */}
            <Box sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="caption" color="text.secondary">
                Bạn đã đồng ý với{' '}
                <Link href="/privacy" underline="hover" sx={{mr: 1}}>
                  Chính Sách Bảo Mật
                </Link>
                và
                <Link href="/terms" underline="hover" sx={{ml: 1}}>
                  Điều khoản dịch vụ
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
