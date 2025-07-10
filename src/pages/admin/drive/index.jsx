'use client';

import {
  AttachMoney as AttachMoneyIcon,
  FunctionsOutlined,
  PaymentsOutlined,
  PriceCheckOutlined,
  Title,
  TrendingDownOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { OAuthDialog } from 'src/components/oauth/OAuthDialog';
import AdminLayout from 'src/layouts/admin/layout';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import {
  fetchAuthorizeOauthAdmin,
  fetchDriveInfoAdmin,
  fetchRevokeOauthAdmin,
  fetchStatusOauth,
} from 'src/redux/reducers/oauth';

const Page = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [showOAuthDialog, setShowOAuthDialog] = useState(false);
  const [showDialogRevokeAdmin, setShowDialogRevokeAdmin] = useState(false);
  const [authData, setAuthData] = useState(null);

  const { loading, data: driveData } = useAppSelector((state) => state.oauth.oauthDriveInfo);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchDriveInfoAdmin());
    };

    fetchData();
  }, [dispatch]);

  console.log(driveData);

  // Create statistics cards data from API response
  const getStatisticsCards = () => {
    if (!driveData) {
      return;
    }
    return [
      {
        title: 'Tổng dung lượng',
        value: driveData?.totalStorageGB || '0',
        icon: FunctionsOutlined,
        circle: 'blue-circle',
      },
      {
        title: 'Dung lượng đã dùng',
        value: driveData?.usedStorageGB || 0,
        icon: TrendingUpOutlined,
        circle: 'green-circle',
      },
      {
        title: 'Còn trống',
        value: driveData?.freeStorageGB || 0,
        diff: 'Trung bình mỗi đơn hàng',
        icon: PaymentsOutlined,
        circle: 'purple-circle',
      },
      {
        title: 'Phần trăm sử dụng',
        value: driveData?.usagePercentage || 0 + '%',
        icon: TrendingDownOutlined,
        circle: 'orange-circle',
      },
      {
        title: 'Email sở hữu',
        value: driveData?.ownerEmail || 'N/A',
        icon: PriceCheckOutlined,
        circle: 'yellow-circle',
      },
      {
        title: 'Tên sở hữu',
        value: driveData?.ownerName || 'N/A',
        icon: AttachMoneyIcon,
        circle: 'greenlight-circle',
      },
    ];
  };

  const statisticsCards = getStatisticsCards();

  const handleDialogClose = () => {
    setShowOAuthDialog(false);
  };

  const handleCheckStatus = async () => {
    const responseFetchStatusOauth = await dispatch(fetchStatusOauth());
    const isAuth = responseFetchStatusOauth.payload || false;
    if (isAuth) {
      toast.success('Have credential!');
    } else {
      toast.info('Credential not found!');
    }
  };

  const checkOAuthStatus = async () => {
    try {
      const responseOAuth = await dispatch(fetchAuthorizeOauthAdmin());
      const authInfo = {
        authUrl: responseOAuth.payload?.authUrl || '',
        message: responseOAuth.payload?.message || 'Please authorize',
      };

      setAuthData(authInfo);
      setShowOAuthDialog(true);
      return true;
    } catch (error) {
      toast.error('Kiểm tra OAuth thất bại');
      return false;
    }
  };

  const revokeAdmin = async () => {
    try {
      const responseFetchStatusOauth = await dispatch(fetchStatusOauth());
      // Kiểm tra trong payload.data thay vì payload trực tiếp
      const isAuth = responseFetchStatusOauth.payload || false;
      console.log(responseFetchStatusOauth.payload);
      if (!isAuth) {
        toast.info('Not authorize found!');
      } else {
        const responseOAuth = await dispatch(fetchRevokeOauthAdmin());
        if (responseOAuth.meta.requestStatus === 'fulfilled') {
          toast.success('Revoke owner drive successfully!');
        }
      }
    } catch (error) {
      toast.error('Revoke fail!');
    }
  };

  const handleOpenAuthorize = async () => {
    const result = await checkOAuthStatus();
    if (result) {
      toast.info('Successfully!');
    } else {
      toast.error('Error!');
    }
  };

  const handleOpenDialogRevoke = async () => {
    setShowDialogRevokeAdmin(true);
  };

  const confirmRevokeAdmin = async () => {
    await revokeAdmin();
    setShowDialogRevokeAdmin(false);
  };

  return (
    <>
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          {/* Statistics Cards */}
          {!loading && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statisticsCards &&
                statisticsCards.map(({ title, value, diff, icon: Icon, circle }, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={index} size={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }} title={value}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {title}
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                              {value}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: circle.includes('blue')
                                ? '#e3f2fd'
                                : circle.includes('green')
                                  ? '#e8f5e8'
                                  : circle.includes('purple')
                                    ? '#f3e5f5'
                                    : '#fff3e0',
                            }}
                          >
                            <Icon
                              sx={{
                                color: circle.includes('blue')
                                  ? '#1976d2'
                                  : circle.includes('green')
                                    ? '#2e7d32'
                                    : circle.includes('purple')
                                      ? '#7b1fa2'
                                      : '#f57c00',
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}

          <Stack direction="row" spacing={2} flexWrap="wrap" mt={2}>
            <Button variant="contained" onClick={handleCheckStatus}>
              Check Status
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenAuthorize}>
              Authorize
            </Button>
            <Button variant="contained" color="error" onClick={handleOpenDialogRevoke}>
              Revoke
            </Button>
          </Stack>
        </Box>

        <OAuthDialog
          isOpen={showOAuthDialog}
          onClose={handleDialogClose}
          authUrl={authData?.authUrl || ''}
          message={authData?.message || ''}
        />

        {/* Revoke Confirmation Dialog */}
        <Dialog open={showDialogRevokeAdmin} onClose={() => setShowDialogRevokeAdmin(false)}>
          <DialogTitle>Xác nhận gỡ thông tin drive</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Bạn có chắc chắn muốn gỡ quyền của owner drive hiện tại?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialogRevokeAdmin(false)}>Hủy</Button>
            <Button onClick={confirmRevokeAdmin} color="error" variant="contained">
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      </AdminLayout>
    </>
  );
};

export default Page;
