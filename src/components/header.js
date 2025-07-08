'use client';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AppBar, Box, Button, Dialog, Drawer, FormControl, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import Link from 'next/link';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import DropdownMenu from 'src/components/dropdown';
import FormDialog from 'src/components/popup';
import { useBoardInfo } from 'src/hooks/Header/useBoardInfo';
import { useBoardsData } from 'src/hooks/Header/useBoardsData';
import { useProductTypes } from 'src/hooks/Header/useProductTypes';
import { useUserData } from 'src/hooks/Header/useUserData';
import { useRouter } from 'src/hooks/use-router';
import { tokens } from 'src/locales/tokens';
import { useAppDispatch } from 'src/redux/hook';
import { putBoardInfoByBoardId } from 'src/redux/reducers/boards';
import { fetchCreateQr, fetchGetInfoPayment } from 'src/redux/reducers/qrtransaction';
import { postTemplate } from 'src/redux/reducers/templates';
import { updateBankInfo } from 'src/redux/reducers/user';
import { fetchCreateWithdraw } from 'src/redux/reducers/usertopups';
import { RepositoryRemote } from 'src/services';
import handleAmountFormat from 'src/utils/amount-vnd';
import { getFields } from 'src/utils/fields-edit.board';
import generateTransactionCode from 'src/utils/generate';
import ClickDropdownMenu from './dropdown_click';
import ChangePasswordDialog from './header/components/ChangePasswordDialog';
import { useDialogHandlers } from './header/handlers/useDialogHandlers';
import TableModalDialog from './table-modal';

const Header = ({ onBoardChange, showBoards, role, onMenuSelect }, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedBoardId, setSelectedBoardId] = useState(null);
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
  const {
    openDrawer,
    openDrawerBoardInfo,
    openChangePassword,
    openModalTemplate,
    handleToggleDrawer,
    handleDrawerBoardInfo,
    handleChangePassword: toggleChangePassword,
    handleOpenModalTemplate,
  } = useDialogHandlers();

  const { data: userData } = useUserData(dispatch, setEmail, walletUpdated);
  const { data: boardsData } = useBoardsData(dispatch, userData?.id, role);
  const { data: productTypeData } = useProductTypes(dispatch, userData?.id);
  const { data: boardInfoData } = useBoardInfo(dispatch, selectedBoardId, productTypeData, setInitialFormData);

  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [bankName, setBankName] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');

  // Thêm useEffect để sync với userData
  useEffect(() => {
    if (userData) {
      setBankName(userData.bankName || '');
      setBankNumber(userData.bankNumber || '');
      setBankAccountName(userData.bankAccountName || '');
      setAmountWithdraw(userData.coin || 0);
    }
  }, [userData]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBoardId = localStorage.getItem('b');
      if (storedBoardId && storedBoardId !== 'null') {
        setSelectedBoardId(Number(storedBoardId));
      }
    }
  }, []);

  const matchedNames =
    Array.isArray(boardInfoData?.productTypeIds) && productTypeData?.length
      ? productTypeData.filter((pt) => boardInfoData.productTypeIds.includes(pt.id)).map((pt) => pt.name)
      : [];

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
      handleDrawerBoardInfo(false);
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

  const submitChangePassword = async (data, email) => {
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
      toggleChangePassword(false);
    }
  };

  useImperativeHandle(ref, () => ({
    openMakeDepositDialog: () => {
      handleToggleDrawer(); // Open the drawer
      setTimeout(() => {
        if (amountRef.current) {
          amountRef.current.focus(); // Focus the amount input
        }
      }, 100);
    },
  }));

  const handleMenuSelect = async (opt) => {
    switch (opt.value) {
      case 'make_deposit':
        handleToggleDrawer();
        // Add null check for ref
        setTimeout(() => {
          if (amountRef.current) {
            amountRef.current.focus();
          }
        }, 100);
        break;
      case 'board_infomation':
        handleDrawerBoardInfo(true);
        break;
      case 'logout':
        try {
          await RepositoryRemote.auth.requestLogout();
          localStorage.clear();
          toast.success('Đăng xuất thành công!');
          router.push('/auth/login');
        } catch (error) {
          toast.error('Đăng xuất thất bại!');
        }
        break;
      case 'changepassword':
        toggleChangePassword(true);
        break;
      case 'monthly_balances':
        router.push('/balances');
        break;
      case 'userprofile':
        router.push('/profile');
        break;
      default:
        alert(`${opt.label}...`);
    }
  };

  useEffect(() => {
    if (openDrawer) {
      setTimeout(() => {
        if (amountRef.current) {
          amountRef.current.focus();
        }
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
      handleToggleDrawer();
      setTimeout(() => setOpenQRDialog(true), 500);
    } catch (error) {
      toast.error('Lỗi tạo QR:', error);
    }
  };

  const handleMakeWidthraw = async () => {
    try {
      const data = {
        bankName,
        bankNumber,
        bankAccountName,
      };
      // Call API để update bank info
      const response = await dispatch(updateBankInfo(data));
      if (response.meta.requestStatus === 'fulfilled') {
        const withdrawData = {
          coin: amountWithdraw,
          transactionCode,
          bankNumber,
          bankName,
        };

        const withdrawResponse = await dispatch(fetchCreateWithdraw(withdrawData));

        if (withdrawResponse.meta.requestStatus === 'fulfilled') {
          toast.success('Tạo yêu cầu rút tiền thành công!');
        } else {
          toast.error('Tạo yêu cầu rút tiền thất bại!');
        }
      } else {
        toast.error('Cập nhật thông tin thất bại!');
      }

      handleToggleDrawer();
      setOpenQRDialog(true);
    } catch (error) {
      toast.error('Lỗi khi tạo giao dịch');
      console.error('Withdraw error:', error);
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

  let op1 = [
    { label: t(tokens.nav.make_deposit), value: 'make_deposit' },
    { label: t(tokens.nav.board_infomation), value: 'board_infomation' },
    { label: t(tokens.nav.monthly_balances), value: 'monthly_balances' },
  ];
  let op2 = [
    { label: t(tokens.nav.make_withdraw), value: 'make_deposit' },
    { label: t(tokens.nav.monthly_balances), value: 'monthly_balances' },
  ];

  const optionsSelect = role === 'customer' ? op1 : role === 'designer' ? op2 : [];

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
                    const board = (boardsData ?? []).find((b) => b.id === selected);
                    return board?.title || t(tokens.nav.untitled);
                  }}
                  sx={{ '& .MuiSelect-select': { paddingY: '8px' } }}
                >
                  <MenuItem value="">
                    <div>{t(tokens.nav.all)}</div>
                  </MenuItem>
                  {(boardsData ?? []).map((board) => (
                    <MenuItem key={board.id ?? 'null'} value={board.id ?? 'null'}>
                      {board.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormDialog
                buttonLabel={t(tokens.nav.quick_design)}
                title={t(tokens.nav.quick_design)}
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
                disabled={!selectedBoardId}
                sx={{
                  ml: 1,
                  mr: 2,
                  color: 'black',
                  height: '40px',
                  borderColor: 'primary.main',
                }}
                onClick={() => handleOpenModalTemplate(true)}
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
                  {handleAmountFormat(userData?.coin)} VND
                </Button>
                <DropdownMenu
                  buttonLabel={<MoreVertIcon />}
                  options={optionsSelect}
                  onSelect={onMenuSelect || handleMenuSelect}
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
                onClose={() => handleToggleDrawer()}
                ModalProps={{ keepMounted: true }}
                sx={{ zIndex: 999999991 }}
              >
                <Box sx={{ width: 400, p: 3 }}>
                  {role === 'customer' ? (
                    <Typography variant="h6">{t(tokens.nav.make_deposit)}</Typography>
                  ) : role === 'designer' ? (
                    <Typography variant="h6">{t(tokens.nav.make_withdraw)}</Typography>
                  ) : (
                    <Box></Box>
                  )}
                  <Box mt={2}>
                    {role === 'customer' ? (
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
                    ) : role === 'designer' ? (
                      <Box>
                        <input
                          type="text"
                          ref={amountRef}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={handleAmountFormat(amountWithdraw)}
                          onChange={(e) => setAmountWithdraw(e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => {
                            if (
                              !/[0-9]/.test(e.key) &&
                              !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                          style={{
                            margin: '12px 0',
                            borderRadius: '5px',
                            width: '100%',
                            padding: 8,
                            border: amountWithdraw > (userData.coin || 0) ? '1px solid red' : '1px solid #ccc',
                          }}
                        />

                        {amountWithdraw > (userData.coin || 0) && (
                          <p style={{ color: 'red', margin: '4px 0 0 0' }}>Số tiền rút vượt quá số dư!</p>
                        )}
                      </Box>
                    ) : (
                      <Box></Box>
                    )}
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
                    {role === 'customer' ? (
                      <textarea
                        placeholder={t(tokens.nav.note)}
                        style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    ) : (
                      <Box>
                        <input
                          placeholder={t(tokens.nav.bankAccountName)}
                          style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                          value={bankAccountName}
                          onChange={(e) => setBankAccountName(e.target.value)}
                        />
                        <input
                          placeholder={t(tokens.nav.bankName)}
                          style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                        />
                        <input
                          placeholder={t(tokens.nav.accountNumber)}
                          style={{ margin: '12px 0', borderRadius: '5px', width: '100%', padding: 8 }}
                          value={bankNumber}
                          onChange={(e) => setBankNumber(e.target.value)}
                        />
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={role === 'customer' ? handleGenerateQR : role === 'designer' ? handleMakeWidthraw : null}
                      disabled={
                        role === 'designer' ? amountWithdraw > userData.coin || amountWithdraw <= 0 : amount <= 0
                      }
                    >
                      {t(tokens.nav.submit)}
                    </Button>
                  </Box>
                </Box>
              </Drawer>
              {role === 'customer' ? (
                <Dialog
                  fullScreen
                  open={openQRDialog}
                  onClose={() => setOpenQRDialog(false)}
                  sx={{ zIndex: 999999999 }}
                >
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

                    <Typography variant="body2" color="success.main">
                      Tặng ngay <strong>3% giá trị</strong> – tiết kiệm thêm từ giá gốc!
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Tổng giá trị nhận được:&nbsp;
                      <strong>{(amount * 1.03).toLocaleString('vi-VN')}₫</strong>
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
              ) : (
                <Dialog
                  fullScreen
                  open={openQRDialog}
                  onClose={() => setOpenQRDialog(false)}
                  sx={{ zIndex: 999999999 }}
                >
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
                    {/* Số tiền */}
                    <Typography variant="h2" sx={{ mt: 4, fontWeight: 'bold' }}>
                      {Number(amountWithdraw).toLocaleString('vi-VN')}₫
                    </Typography>

                    <Typography variant="h6" color="success.main">
                      Yêu cầu rút tiền của bạn đã được ghi nhận, vui lòng chờ!
                    </Typography>

                    {/* Mã giao dịch */}
                    <Typography variant="h5" sx={{ mt: 2, color: 'gray' }}>
                      Mã giao dịch: {transactionCode}
                    </Typography>

                    {/* Số tài khoản */}
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, color: 'primary.main', cursor: 'pointer', fontSize: '32px' }}
                    >
                      Tên chủ tài khoản: {bankAccountName}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, color: 'primary.main', cursor: 'pointer', fontSize: '32px' }}
                    >
                      STK: {bankNumber} ({bankName})
                    </Typography>

                    <Button onClick={() => setOpenQRDialog(false)} sx={{ mt: 6 }} variant="outlined">
                      Đóng
                    </Button>
                  </Box>
                </Dialog>
              )}
            </Box>
          )}

          {openDrawerBoardInfo && selectedBoardId && (
            <Drawer
              anchor="right"
              open={openDrawerBoardInfo}
              onClose={() => handleDrawerBoardInfo(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ transition: '0.3s ease in out', zIndex: 999999991 }}
            >
              <Box sx={{ width: 400, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{t(tokens.nav.board_infomation)}</Typography>
                  <Button sx={{ color: '#a2a2a2' }} onClick={() => handleDrawerBoardInfo(false)}>
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
                    <Typography variant="body1">{matchedNames.length > 0 ? matchedNames.join(', ') : '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Drawer>
          )}
          <TableModalDialog
            open={openModalTemplate}
            onClose={() => handleOpenModalTemplate(false)}
            onSubmit={handlePostTemplate}
            selectedBoardId={selectedBoardId}
          />
          {/* <Button sx={{ ml: 1, color: 'black' }} onClick={() => alert('Notifications')}>
            <Box component="span" sx={{ fontSize: '1.5rem' }}>
              🔔
            </Box>
          </Button> */}
          <ClickDropdownMenu
            buttonLabel={'👤'}
            component="span"
            userInfo={{ username: userData?.username, email: userData?.email }}
            options={[
              { label: t(tokens.nav.resetPassword), value: 'changepassword' },
              { label: t(tokens.nav.profile), value: 'userprofile' },
              { label: t(tokens.nav.logout), value: 'logout' },
            ]}
            onSelect={onMenuSelect || handleMenuSelect}
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
        onClose={() => toggleChangePassword(false)}
        onSubmit={submitChangePassword}
        t={t}
        email={email}
      />
    </AppBar>
  );
};

export default React.memo(forwardRef(Header));
