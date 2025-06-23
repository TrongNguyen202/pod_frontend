import React, { useMemo, useState, useEffect, memo, useRef } from 'react';
import { useRouter } from 'src/hooks/use-router';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { AppBar, Toolbar, Typography, FormControl, Select, MenuItem, Button, Box, Drawer, Dialog } from '@mui/material';
import Card from '@mui/material/Card';
import Link from 'next/link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import toast from 'react-hot-toast';
import { tokens } from 'src/locales/tokens';
import { RepositoryRemote } from 'src/services';
import FormDialog from 'src/components/popup';
import DropdownMenu from 'src/components/dropdown';
import ClickDropdownMenu from './dropdown_click';
import TableModalDialog from './table-modal';
import { fetchUserByEmail } from 'src/redux/reducers/user';
import { fetchBoardInfoByBoardId, fetchGetBoardsByUserId, putBoardInfoByBoardId } from 'src/redux/reducers/boards';
import { fetchGetAllProductTypes } from 'src/redux/reducers/product-types';
import { postTemplate } from 'src/redux/reducers/templates';
import { getFields } from 'src/utils/fields-edit.board';
import generateTransactionCode from 'src/utils/generate';
import { resetBoardInfo } from 'src/redux/reducers/boards';
import { resetDataListOrder } from 'src/redux/reducers/orders';
import handleAmountFormat from 'src/utils/amount-vnd';
import { fetchCreateQr, fetchGetInfoPayment } from 'src/redux/reducers/qrtransaction';
import { fetchGetWalletInfoByUserId } from 'src/redux/reducers/userwallets';
import { checkRole } from 'src/utils';

const transformBoardToFormInitialData = (boardInfoData) => ({
  title: boardInfoData.title || '',
  designType: boardInfoData.designType?.toUpperCase() || '',
  productTypeIds: Array.isArray(boardInfoData.productTypeIds)
    ? boardInfoData.productTypeIds.filter((id) => id != null).map(Number)
    : [],
});

const useUserData = (dispatch, setEmail, walletUpdated) => {
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
      dispatch(fetchUserByEmail({ email: storedEmail }));
    }
  }, [dispatch, setEmail, walletUpdated]);

  return useAppSelector((state) => state.users.userInfo);
};

const useBoardsData = (dispatch, userId, role) => {
  const { isCustomer } = checkRole(role);

  useEffect(() => {
    if (userId && isCustomer) {
      dispatch(fetchGetBoardsByUserId({ userId, query: '' }));
    }
  }, [dispatch, userId, isCustomer]);

  return useAppSelector((state) => state.boards.boardService);
};

const useProductTypes = (dispatch) => {
  useEffect(() => {
    dispatch(fetchGetAllProductTypes({ query: '' }));
  }, []);
  return useAppSelector((state) => state.productTypes.productTypes);
};

const useBoardInfo = (dispatch, selectedBoardId, productTypeData, setInitialFormData) => {
  const boardInfo = useAppSelector((state) => state.boards.boardInfo);

  useEffect(() => {
    if (typeof selectedBoardId === 'number' && selectedBoardId > 0) {
      dispatch(fetchBoardInfoByBoardId({ boardId: selectedBoardId }));
    } else {
      dispatch(resetBoardInfo());
      dispatch(resetDataListOrder());
    }
  }, [dispatch, selectedBoardId]);

  useEffect(() => {
    if (boardInfo?.data) {
      setInitialFormData(transformBoardToFormInitialData(boardInfo.data));
    } else {
      setInitialFormData({});
    }
  }, [boardInfo.data, productTypeData, setInitialFormData]);

  return boardInfo;
};

const ChangePasswordDialog = memo(({ open, onClose, onSubmit, t, email }) => (
  <FormDialog
    buttonLabel=""
    title={t(tokens.nav.resetPassword)}
    fields={[
      { name: 'oldPassword', label: t(tokens.nav.password), type: 'password', required: true },
      { name: 'newPassword', label: t(tokens.nav.newPassword), type: 'password', required: true },
      { name: 'confirmPassword', label: t(tokens.nav.confirmPassword), type: 'password', required: true },
    ]}
    initialData={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
    onSubmit={(data) => onSubmit(data, email)}
    buttonProps={{ style: { display: 'none' } }}
    openOverride={open}
    onCloseOverride={onClose}
  />
));

ChangePasswordDialog.displayName = 'ChangePasswordDialog';

const Header = ({ onBoardChange, showBoards, role }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDrawerBoardInfo, setOpenDrawerBoardInfo] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openModalTemplate, setOpenModalTemplate] = useState(false);
  const [email, setEmail] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [walletUpdated, setWalletUpdated] = useState(false);
  const amountRef = useRef();
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [transactionCode, setTransactionCode] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [initialFormData, setInitialFormData] = useState({});

  const { data: userData } = useUserData(dispatch, setEmail, walletUpdated);
  const { data: boardsData } = useBoardsData(dispatch, userData?.id, role);
  const { data: productTypeData } = useProductTypes(dispatch);
  const { data: boardInfoData } = useBoardInfo(dispatch, selectedBoardId, productTypeData, setInitialFormData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBoardId = localStorage.getItem('b');
      if (storedBoardId && storedBoardId !== 'null') {
        setSelectedBoardId(Number(storedBoardId));
      }
    }
  }, []);

  const fields = useMemo(() => getFields(productTypeData, boardInfoData), [productTypeData, boardInfoData]);
  const length = 12;
  useEffect(() => {
    if (openDrawer) {
      setAmount('');
      setNote('');
      setTransactionCode(generateTransactionCode(length, userData.id));
    }
  }, [openDrawer]);

  useEffect(() => {
    if (openDrawerBoardInfo && !selectedBoardId) {
      toast.error(t(tokens.nav.no_board));
      setOpenDrawerBoardInfo(false);
    }
  }, [openDrawerBoardInfo, selectedBoardId, t]);

  const handleBoardChange = (e) => {
    const boardId = e.target.value === 'null' ? null : Number(e.target.value);
    setSelectedBoardId(boardId);
    localStorage.setItem('b', String(boardId ?? 'null'));
    onBoardChange?.(boardId);
  };

  const handleSubmitBoardInfo = async (formData) => {
    try {
      formData.userId = userData.id;
      const response = await dispatch(putBoardInfoByBoardId({ boardId: selectedBoardId, data: formData }));
      if (response.payload.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      toast.error('Lỗi khi cập nhật board, vui lòng thử lại!');
    }
  };

  const handlePostTemplate = async (formData, flag) => {
    try {
      const newTemplates = formData
        .filter((item) => !item.id && item.title.trim() !== '' && item.description.trim() !== '')
        .map((item) => ({
          ...item,
        }));

      if (newTemplates.length === 0) return;

      const payload = {
        boardId: selectedBoardId,
        templates: newTemplates,
      };

      const response = await dispatch(postTemplate({ data: payload }));

      if (response.payload || flag) {
        setTimeout(() => {
          toast.success('Thao tác thành công!');
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      toast.error('Lỗi khi thêm mẫu, vui lòng thử lại!');
    }
  };

  const handleChangePassword = async (data, email) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error('Mật khẩu mới và mật khẩu xác nhận phải giống nhau.');
        return;
      }

      await RepositoryRemote.auth.requestResetPassword({
        email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.newPassword,
      });

      toast.success('Đổi mật khẩu thành công!');
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!');
    } finally {
      setOpenChangePassword(false);
    }
  };

  const handleMenuSelect = async (opt) => {
    switch (opt.value) {
      case 'make_deposit':
        setOpenDrawer(true);
        amountRef.current.focus();
        break;
      case 'board_infomation':
        setOpenDrawerBoardInfo(true);
        break;
      case 'logout':
        try {
          await RepositoryRemote.auth.requestLogout();
          localStorage.clear();
          toast.success('Đăng xuất thành công!');
          router.push('/auth/login');
        } catch (error) {
          console.error('Logout failed:', error);
          toast.error('Đăng xuất thất bại!');
        }
        break;
      case 'changepassword':
        setOpenChangePassword(true);
        break;
      case 'userprofile':
        router.push('/account/profile');
        break;
      default:
        alert(`${opt.label}...`);
    }
  };

  useEffect(() => {
    if (openDrawer) {
      setTimeout(() => {
        amountRef.current?.focus();
      }, 200);
    }
  }, [openDrawer]);

  const handleGenerateQR = async () => {
    try {
      const response = await dispatch(
        fetchCreateQr({
          userId: userData.id,
          amount: Number(amount),
          transactionCode: transactionCode?.toString(),
        }),
      );
      const rawExpiresAt = Math.floor(response.payload.expiresAt);
      const expiresAtDate = new Date(rawExpiresAt * 1000);

      setQrCode(response.payload.qrCodeBase64);
      setExpiresAt(expiresAtDate);
      setOpenDrawer(false);
      setTimeout(() => setOpenQRDialog(true), 500);
    } catch (error) {
      toast.error('Lỗi tạo QR:', error);
    }
  };

  useEffect(() => {
    if (!qrCode || !transactionCode || !openQRDialog) return;

    const interval = setInterval(async () => {
      try {
        if (!openQRDialog) {
          clearInterval(interval);
        }
        const res = await dispatch(fetchGetInfoPayment(transactionCode));
        const status = res.payload?.data?.status;
        console.log(status);
        if (status === 'SUCCESS') {
          clearInterval(interval);
          setOpenQRDialog(false);
          setWalletUpdated(!walletUpdated);
          toast.success('Nạp tiền thành công!');
        } else if (status === 'EXPIRED') {
          clearInterval(interval);
          setOpenQRDialog(false);
          toast.error('Giao dịch đã hết hạn!');
        }
      } catch (e) {
        console.error('Lỗi polling:', e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [qrCode, transactionCode, openQRDialog]);

  useEffect(() => {
    if (!expiresAt) return;
    console.log(expiresAt);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((new Date(expiresAt) - now) / 1000);
      if (diff <= 0) {
        setSecondsLeft(0);
        clearInterval(interval);
        setOpenQRDialog(false);
        toast.error('QR đã hết hạn. Vui lòng tạo lại.');
      } else {
        setSecondsLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', boxShadow: '#f5f5f5', zIndex: 9999 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component={Link}
            href="/ideas"
            sx={{ color: 'pink', fontWeight: 'bold', display: 'flex', alignItems: 'center', mr: 2 }}
          >
            <Box
              component="img"
              src="/logo.png"
              sx={{
                width: '32px',
                height: '32px',
                objectFit: 'cover',
                borderRadius: 1,
                mr: 2,
              }}
            />
            Sun Design
          </Box>
          {showBoards && role === 'customer' && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl
                variant="outlined"
                size="medium"
                sx={{
                  minWidth: 200,
                  mr: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              >
                <Select
                  value={selectedBoardId ?? ''}
                  onChange={handleBoardChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) return <div>{t(tokens.nav.all)}</div>;
                    const board = boardsData.find((b) => b.id === selected);
                    return board?.title || t(tokens.nav.untitled);
                  }}
                  sx={{ '& .MuiSelect-select': { paddingY: '8px' } }}
                >
                  <MenuItem value="">
                    <div>{t(tokens.nav.all)}</div>
                  </MenuItem>
                  {boardsData.map((board) => (
                    <MenuItem key={board.id ?? 'null'} value={board.id ?? 'null'}>
                      {board.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormDialog
                key={selectedBoardId + '-' + JSON.stringify(initialFormData)}
                buttonLabel={t(tokens.nav.quick_design)}
                title="Edit Board"
                fields={fields}
                onSubmit={handleSubmitBoardInfo}
                initialData={initialFormData}
                buttonProps={{
                  component: 'span',
                  variant: 'outlined',
                  size: 'medium',
                  disabled: !selectedBoardId,
                  sx: { ml: 1, mr: 2, color: 'black', height: '40px' },
                }}
              />
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  ml: 1,
                  mr: 2,
                  color: 'black',
                  height: '40px',
                  borderColor: 'primary.main',
                }}
                onClick={() => setOpenModalTemplate(true)}
              >
                {t(tokens.nav.templates)}
              </Button>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {role !== 'admin' && (
            <Box>
              <Card sx={{ display: 'flex', alignItems: 'center', padding: 0 }}>
                <Button
                  variant="contained"
                  sx={{
                    padding: '8px 16px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    borderRadius: 0,
                    minWidth: 0,
                  }}
                  onClick={() => handleMenuSelect({ value: 'make_deposit', label: t(tokens.nav.make_deposit) })}
                >
                  {handleAmountFormat(userData.coin)} VND
                </Button>
                <DropdownMenu
                  buttonLabel={<MoreVertIcon />}
                  options={[
                    { label: t(tokens.nav.make_deposit), value: 'make_deposit' },
                    { label: t(tokens.nav.board_infomation), value: 'board_infomation' },
                    // { label: t(tokens.nav.board_activity), value: 'board_activity' },
                    { label: t(tokens.nav.monthly_balances), value: 'monthly_balances' },
                  ]}
                  onSelect={handleMenuSelect}
                  buttonProps={{
                    variant: 'contained',
                    sx: {
                      padding: '8px 16px',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: 0,
                      minWidth: 0,
                    },
                  }}
                />
              </Card>
              <Drawer
                anchor="right"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                ModalProps={{ keepMounted: true }}
                sx={{ zIndex: 999999991 }}
              >
                <Box sx={{ width: 400, p: 3 }}>
                  <Typography variant="h6">{t(tokens.nav.make_deposit)}</Typography>
                  <Box mt={2}>
                    <input
                      type="text"
                      ref={amountRef}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={handleAmountFormat(amount)}
                      onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                    />
                    <input
                      placeholder={t(tokens.nav.transaction)}
                      style={{
                        margin: '12px 0',
                        borderRadius: '5px',
                        width: '100%',
                        padding: 8,
                        backgroundColor: '#f0f0f1',
                        color: '#757575',
                      }}
                      disabled
                      value={transactionCode}
                    />
                    <textarea
                      placeholder={t(tokens.nav.note)}
                      style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleGenerateQR}>
                      {t(tokens.nav.submit)}
                    </Button>
                  </Box>
                </Box>
              </Drawer>
              <Dialog fullScreen open={openQRDialog} onClose={() => setOpenQRDialog(false)} sx={{ zIndex: 999999999 }}>
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    px: 2,
                  }}
                >
                  {/* QR Image */}
                  <img src={qrCode} alt="QR Code" style={{ width: '80%', maxWidth: 400 }} />

                  {/* Số tiền */}
                  <Typography variant="h5" sx={{ mt: 4, fontWeight: 'bold' }}>
                    {Number(amount).toLocaleString('vi-VN')}₫
                  </Typography>

                  {/* Mã giao dịch */}
                  <Typography variant="body2" sx={{ mt: 1, color: 'gray' }}>
                    Mã giao dịch: {transactionCode}
                  </Typography>

                  {secondsLeft > 0 && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'red' }}>
                      Còn lại: {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                    </Typography>
                  )}
                  <Typography variant="body1" sx={{ mt: 1, color: 'red' }}>
                    Lưu ý KHÔNG thực hiện chuyển tiền khi mã hết hạn để tránh rủi ro
                  </Typography>
                  {/* Số tài khoản */}
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, color: 'gray', cursor: 'pointer' }}
                    onClick={() => {
                      navigator.clipboard.writeText('0399709507');
                      alert('Đã copy số tài khoản');
                    }}
                  >
                    STK: 0399709507 (MBBank)
                  </Typography>

                  {/* Hướng dẫn */}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Quét mã để nạp tiền
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'gray', maxWidth: 300 }}>
                    Quá trình sẽ tự động hoàn thành khi bạn thanh toán thành công.
                  </Typography>

                  <Button onClick={() => setOpenQRDialog(false)} sx={{ mt: 6 }} variant="outlined">
                    Đóng
                  </Button>
                </Box>
              </Dialog>
            </Box>
          )}

          {openDrawerBoardInfo && selectedBoardId && (
            <Drawer
              anchor="right"
              open={openDrawerBoardInfo}
              onClose={() => setOpenDrawerBoardInfo(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ transition: '0.3s ease in out', zIndex: 999999991 }}
            >
              <Box sx={{ width: 400, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{t(tokens.nav.board_infomation)}</Typography>
                  <Button sx={{ color: '#a2a2a2' }} onClick={() => setOpenDrawerBoardInfo(false)}>
                    X
                  </Button>
                </Box>
                <Box mt={2} display="flex" flexDirection="column" gap={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t(tokens.nav.username)}
                    </Typography>
                    <Typography variant="body1">{userData.username}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{userData.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t(tokens.nav.title)}
                    </Typography>
                    <Typography variant="body1">{boardInfoData.title}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t(tokens.nav.design_type)}
                    </Typography>
                    <Typography variant="body1">{boardInfoData.designType}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t(tokens.nav.product_type)}
                    </Typography>
                    <Typography variant="body1">
                      {productTypeData.find((pt) => pt.id === boardInfoData.productTypeIds)?.name || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Drawer>
          )}
          <TableModalDialog
            open={openModalTemplate}
            onClose={() => setOpenModalTemplate(false)}
            onSubmit={handlePostTemplate}
            selectedBoardId={selectedBoardId}
          />
          <Button sx={{ ml: 1, color: 'black' }} onClick={() => alert('Notifications')}>
            <Box component="span" sx={{ fontSize: '1.5rem' }}>
              🔔
            </Box>
          </Button>
          <ClickDropdownMenu
            buttonLabel={'👤'}
            component="span"
            userInfo={{ username: userData.username, email: userData.email }}
            options={[
              { label: t(tokens.nav.resetPassword), value: 'changepassword' },
              { label: t(tokens.nav.profile), value: 'userprofile' },
              { label: t(tokens.nav.logout), value: 'logout' },
            ]}
            onSelect={handleMenuSelect}
            buttonProps={{
              variant: 'text',
              sx: {
                padding: '12px 16px',
                fontSize: '20px',
                margin: '0',
                color: 'white',
                borderRadius: 2,
              },
            }}
          />
        </Box>
      </Toolbar>
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        onSubmit={handleChangePassword}
        t={t}
        email={email}
      />
    </AppBar>
  );
};

export default Header;
