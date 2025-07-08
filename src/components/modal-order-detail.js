'use client';

import { ChevronLeft, ChevronRight, Download } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  categoryColors,
  categoryLabelsVi,
  categoryStatusVi,
  categoryStatusViU,
  LOCAL_STORAGE_KEY,
} from 'src/constants';
import { tokens } from 'src/locales/tokens';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import {
  addComment,
  fetchGetCommentsByOrderId,
  fetchPostCommentFirebase,
  fetchPostCommentPosgres,
} from 'src/redux/reducers/comments';
import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';
import {
  changeStatusOrders,
  fetchAssignOrdersForDesigner,
  fetchGetAllStatus,
  fetchGetOrdersByBoardId,
  fetchUploadImagesForDesigner,
} from 'src/redux/reducers/orders';
import { listenToOrderComments } from 'src/services/firebase';
import { calculatePaymentTime, checkRole, formatPaymentTime, getAllowedStatusOptions } from 'src/utils';
import CommentInput from './comments/CommentInput';
import CommentList from './comments/CommentList';
import JSZip from 'jszip';
import { fetchAuthorizeOauth, fetchStatusOauth } from 'src/redux/reducers/oauth';
import { OAuthDialog } from './oauth/OAuthDialog';
import { CloseCircleOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';

const OrderDetailModal = ({
  open,
  order,
  onClose,
  handleAmountFormat = (v) => v.toString(),
  userData,
  role,
  productTypeData,
  buildQueryString,
  onStatusChanged,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState('');
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const COOLDOWN_TIME = 2000;
  const inputCommentRef = useRef(null);
  const seenCommentIdsRef = useRef(new Set());
  const hasInitializedComments = useRef(false); // Track comment initialization
  const [showOAuthDialog, setShowOAuthDialog] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const comments = useAppSelector((state) => state.comments.commentsInfo.data);
  const { isCustomer, isDesigner } = checkRole(role);

  // Optimized: Only fetch comments once when modal opens
  useEffect(() => {
    if (open && order?.id && !hasInitializedComments.current) {
      hasInitializedComments.current = true;
      dispatch(fetchGetCommentsByOrderId(order.id));
    }

    // Reset when modal closes
    if (!open) {
      hasInitializedComments.current = false;
    }
  }, [dispatch, order?.id, open]);

  // Memoized cooldown function to prevent duplicate calls
  const withCooldown = useCallback(
    async (asyncFunction) => {
      if (isOnCooldown || isProcessing) {
        toast.warning('Vui lòng đợi một chút trước khi thực hiện lại!');
        return;
      }

      setIsOnCooldown(true);
      setIsProcessing(true);

      try {
        await asyncFunction();
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          setIsOnCooldown(false);
        }, COOLDOWN_TIME);
      }
    },
    [isOnCooldown, isProcessing],
  );

  useEffect(() => {
    if (order?.status === 'NEED_FIX') {
      setShowComments(true);
    }
  }, [order?.status]);

  useEffect(() => {
    if (showComments && inputCommentRef.current) {
      inputCommentRef.current.focus();
    }
  }, [showComments]);

  // Optimized: Firebase listener with better cleanup
  useEffect(() => {
    if (!order?.id || !open) return;

    seenCommentIdsRef.current = new Set();

    // Initialize với comments hiện tại
    comments.forEach((comment) => {
      const id = comment.commentId || comment.comment_id;
      if (id) {
        seenCommentIdsRef.current.add(id);
      }
    });

    const unsubscribe = listenToOrderComments(order.id, (newComment) => {
      const id = newComment.commentId || newComment.comment_id;
      if (id && !seenCommentIdsRef.current.has(id)) {
        seenCommentIdsRef.current.add(id);
        dispatch(addComment(newComment));
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [dispatch, order?.id, open]); // Removed comments dependency to prevent re-subscription

  if (!order) return null;

  const imagesList = JSON.parse(order.images || '[]');
  const currentStatuses = [order.status];
  const allowedStatuses = getAllowedStatusOptions(role, currentStatuses);
  const statusOptions = allowedStatuses.map((s) => ({
    label: categoryStatusVi[s] || s,
    value: s,
  }));

  const handleUploadImages = (files) => {
    const fileArray = Array.from(files);
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...urls]);
    setUploadFiles((prev) => [...prev, ...fileArray]);
  };

  const sendNotification = async (userId, designerId, orderName, status) => {
    const data = {
      designerIds: Array.isArray(designerId) ? designerId : [designerId ?? 0],
      customerIds: Array.isArray(userId) ? userId : [userId ?? 0],
      title: 'Trạng thái đơn hàng',
      message:
        status === 'DOING'
          ? `Đơn hàng ${orderName} của bạn vừa được nhà thiết kế nhận, vào xem ngay!`
          : `Đơn hàng ${orderName} của bạn vừa cập nhật trạng thái ${categoryStatusViU[status]}, vào xem ngay`,
    };

    dispatch(fetchSendPushNotifications(data));
  };

  const sendNotificationComment = async (userId, designerId, orderName, commentSend, role) => {
    let targetDesignerIds = [];
    let targetCustomerIds = [];

    if (role === 'customer') {
      targetDesignerIds = Array.isArray(designerId) ? designerId : [designerId];
    } else if (role === 'designer') {
      targetCustomerIds = Array.isArray(userId) ? userId : [userId];
    }

    const data = {
      designerIds: targetDesignerIds,
      customerIds: targetCustomerIds,
      title: 'Thông tin đơn hàng',
      message: `${orderName}: ${commentSend}`,
    };

    dispatch(fetchSendPushNotifications(data));
  };

  const handleSubmitComment = async (commentText) => {
    if (!commentText.trim() || !order?.id || !userData?.id || isProcessing) return;

    setIsProcessing(true);
    try {
      const data = {
        message: commentText,
        orderId: order.id,
        userId: userData.id,
        username: userData.username,
        role: userData.role_name,
      };
      const response = await dispatch(fetchPostCommentFirebase(data));
      if (response.meta.requestStatus === 'fulfilled') {
        await dispatch(fetchPostCommentPosgres(response.payload));
        sendNotificationComment(order.userid, order.designerId, order.name, commentText, role);
      }
      setCommentText('');
    } finally {
      setIsProcessing(false);
    }
  };

  const checkOAuthStatus = async () => {
    try {
      const responseFetchStatusOauth = await dispatch(fetchStatusOauth());

      // Kiểm tra trong payload.data thay vì payload trực tiếp
      const isAuth = responseFetchStatusOauth.payload || false;

      if (!isAuth) {
        // Chưa authorize, lấy authorization URL
        const responseOAuth = await dispatch(fetchAuthorizeOauth());

        // FIX: Truy cập đúng cấu trúc data
        const authInfo = {
          authUrl: responseOAuth.payload?.authUrl || '',
          message: responseOAuth.payload?.message || 'Please authorize',
        };

        setAuthData(authInfo);
        setShowOAuthDialog(true);
        return false;
      } else {
        setShowOAuthDialog(false);
        return true;
      }
    } catch (error) {
      console.error('OAuth check failed:', error);
      toast.error('Kiểm tra OAuth thất bại');
      return false;
    }
  };

  const handleDialogClose = (shouldRecheck = false) => {
    setShowOAuthDialog(false);
    if (shouldRecheck) {
      setTimeout(() => {
        checkOAuthStatus();
      }, 2000);
    }
  };
  const handleDeleteImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSendImages = async () => {
    await withCooldown(async () => {
      if (uploadFiles.length === 0 || uploadedImages.length === 0) return;
      const isAuthenticated = await checkOAuthStatus();
      if (!isAuthenticated) {
        toast.error('Không thể xác thực người dùng');
        return;
      }
      const formData = new FormData();
      uploadFiles.forEach((file, index) => {
        if (file instanceof File) {
          if (!file.type.startsWith('image/')) {
            console.error('Not an image:', file.name);
            return;
          }
          formData.append('files', file);
        } else {
          console.error('Invalid file object:', file);
        }
      });

      const toastId = toast.loading('Đang upload ảnh...');
      try {
        // const response = await dispatch(fetchUploadImagesForDesigner({ orderId: order.id, data: formData })).unwrap();
        let deviceId = null;
        let userIp = null;
        let token = null;
        if (typeof window !== 'undefined') {
          token = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
          if (token) {
            try {
              const decodedToken = jwtDecode(token);
              deviceId = decodedToken.deviceId;
              userIp = decodedToken.ipAddress;
            } catch (error) {
              console.error('Error decoding token in getCommonHeaders:', error);
            }
          }
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.id}/upload-folder`, {
          method: 'POST',
          headers: {
            // Giả sử bạn cần gửi token xác thực
            Authorization: `Bearer ${token}`,
            'X-Device-Id': deviceId,
            'X-Forwarded-For': userIp,
          },
          body: formData,
        });

        if (response.success === true) {
          toast.update(toastId, {
            render: 'Upload thành công!',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });

          if (commentText.trim()) {
            await handleSubmitComment(commentText);
          }

          // Gọi handleChangeSingleOrderStatus với shouldNotify = false để tránh gửi thông báo trùng
          await handleChangeSingleOrderStatus('IN_REVIEW', '', false, false);

          // Gửi thông báo chỉ 1 lần ở đây
          await sendNotification(order.userid, null, order.name, 'IN_REVIEW');

          await Promise.all([
            dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() })),
            dispatch(fetchGetAllStatus('')),
          ]);

          // Reset states and close modal
          setUploadedImages([]);
          setUploadFiles([]);
          setConfirmOpen(false);
          setCommentText('');
          onClose();
        }
      } catch (err) {
        toast.update(toastId, {
          render: 'Upload thất bại!',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
        console.error('Upload thất bại:', err);
      }
    });
  };

  const handleChangeSingleOrderStatus = async (
    newStatus,
    optionalComment = '',
    shouldClose = true,
    shouldNotify = true,
  ) => {
    await withCooldown(async () => {
      if (!order?.id) return;

      const data = {
        ids: [order.id],
        status: newStatus,
      };

      const response = await dispatch(changeStatusOrders({ data }));
      const { status, message } = response.payload || {};

      if (status === 200) {
        toast.success('Cập nhật trạng thái thành công');

        // Chỉ gửi thông báo khi shouldNotify = true
        if (shouldNotify) {
          switch (newStatus) {
            case 'IN_REVIEW':
              await sendNotification(order.userid, null, order.name, 'IN_REVIEW');
              break;
            case 'NEED_FIX':
              await sendNotification(null, order.designerId, order.name, 'NEED_FIX');
              break;
            case 'DONE':
              await sendNotification(order.userid, null, order.name, 'DONE');
              break;
            default:
          }
        }

        // Send comment if provided
        if (optionalComment.trim()) {
          await handleSubmitComment(optionalComment);
        }

        // Batch API calls
        await Promise.all([dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() })), onStatusChanged?.()]);

        // Reset states
        setUploadedImages([]);
        setUploadFiles([]);
        setConfirmOpen(false);
        setCommentText('');

        if (shouldClose) {
          onClose();
        }
      } else {
        toast.error(message || 'Đổi trạng thái thất bại');
      }
    });
  };

  const handleAssignOrder = async () => {
    await withCooldown(async () => {
      if (!order?.id || role !== 'designer') return;

      const response = await dispatch(
        fetchAssignOrdersForDesigner({
          data: { orderIds: [order?.id] },
        }),
      );

      if (response.meta.requestStatus === 'fulfilled') {
        toast.success('Nhận đơn thành công!');

        // Send comment if exists
        if (commentText.trim()) {
          await handleSubmitComment(commentText);
        }

        // Gọi API và gửi thông báo chỉ 1 lần
        await Promise.all([
          dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() })),
          dispatch(fetchGetAllStatus('')),
          sendNotification(order.userid, null, order.name, 'DOING'),
        ]);
      } else {
        toast.error('Nhận đơn thất bại!');
      }
      onClose();
    });
  };

  // Thêm hàm download ảnh đơn lẻ
  const downloadSingleImage = async (url, filename = 'image') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Không thể tải ảnh');
    }
  };

  // Hàm download tất cả ảnh thành 1 file ZIP
  const downloadAllImages = async () => {
    if (imagesList.length === 0) return;

    const toastId = toast.loading('Đang tạo file ZIP...');

    try {
      const zip = new JSZip();

      // Tải tất cả ảnh và thêm vào ZIP
      const imagePromises = imagesList.map(async (url, index) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const filename = `image-${index + 1}.jpg`;
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Error fetching image ${index + 1}:`, error);
          throw error;
        }
      });

      await Promise.all(imagePromises);

      toast.update(toastId, {
        render: 'Đang nén file ZIP...',
        type: 'info',
        isLoading: true,
      });

      // Tạo file ZIP
      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6,
        },
      });

      // Download file ZIP
      const downloadUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `order-${order.name}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.update(toastId, {
        render: `Đã tải ${imagesList.length} ảnh thành công!`,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Có lỗi khi tải ảnh',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error('Error creating ZIP:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <Box>{t(tokens.nav.details)}</Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={isDesigner ? categoryStatusViU[order.status] : categoryStatusVi[order.status] || order.status}
            size="small"
            sx={{
              textTransform: 'capitalize',
              fontWeight: 500,
              bgcolor: categoryColors[order.status || ''] || '#e0e0e0',
              color: 'white',
            }}
          />
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflowY: 'auto',
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.creator)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {order.usercreate}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.designer)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {order.designername}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.nameProduct)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>{order.name}</Typography>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.description)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {order.description}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.quantity)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>{order.quantity}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.price)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {handleAmountFormat(isCustomer ? order.price : isDesigner ? order.price_ : 0)} đ
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>
              {t(tokens.nav.product_type)}:
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {productTypeData.find((pt) => pt.id === order.producttypeid)?.name}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.design_type)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {categoryLabelsVi[order.designtype]}
            </Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold', flexShrink: 0 }}>{t(tokens.nav.createdDate)}:</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
              {new Date(order.createddate * 1000).toLocaleString('vi-VN')}
            </Typography>
          </Box>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight="bold">{t(tokens.nav.imagesDescription)}:</Typography>
              {imagesList.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  onClick={downloadAllImages}
                  sx={{
                    minWidth: 'auto',
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.5,
                  }}
                >
                  Tải tất cả ({imagesList.length})
                </Button>
              )}
            </Box>

            {imagesList.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 1,
                  overflowX: 'auto',
                  bgcolor: '#fafafa',
                  position: 'relative',
                }}
              >
                {imagesList.map((url, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid #ccc',
                      position: 'relative',
                      '&:hover .download-overlay': {
                        opacity: 1,
                      },
                    }}
                  >
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      onClick={() => setZoomImageIndex(idx)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                    />

                    {/* Overlay với nút download riêng cho từng ảnh */}
                    <Box
                      className="download-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSingleImage(url, `order-${order.name}-image-${idx + 1}.jpg`);
                        }}
                        sx={{
                          color: 'white',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                      >
                        <Download />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box>
            <Typography fontWeight="bold" mb={1} mt={2}>
              {t(tokens.nav.linkDrive)}:
            </Typography>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box
                variant="contained"
                size="small"
                component="a"
                sx={{
                  textDecoration: 'underline',
                  color: 'primary.main',
                  textAlign: 'center',
                  maxWidth: '100%',
                  wordBreak: 'break-all',
                  '&:hover': { opacity: '0.6', transition: '0.2s ease in out' },
                }}
                href={order.link || ''}
                target="_blank"
                rel="noopener noreferrer"
              >
                {order.link || ''}
              </Box>
            </Box>
          </Box>
          {statusOptions.length > 0 && (
            <Box mt={2}>
              <Typography fontWeight="bold" mb={1}>
                {t(tokens.nav.changeStatus)}
              </Typography>
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="contained"
                    size="small"
                    disabled={isProcessing || isOnCooldown}
                    onClick={() => {
                      setConfirmStatus(option.value);
                      setConfirmOpen(true);
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          {isDesigner && order.status === 'DONE' && order.completedat && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: 2,
                padding: 2,
                color: '#0050b3',
                fontSize: '0.95rem',
                mt: 2,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm.75 15h-1.5v-1.5h1.5V17zm0-3h-1.5V7h1.5v7z" />
              </svg>
              Đơn hàng của bạn sẽ được thanh toán sau 2 ngày kể từ ngày hoàn thành, vào:{' '}
              <strong>{formatPaymentTime(calculatePaymentTime(order.completedat, 'DONE'))}</strong>
            </Box>
          )}
          {isCustomer && order.status === 'IN_REVIEW' && order.lastmodifieddate && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: 2,
                padding: 2,
                color: '#0050b3',
                fontSize: '0.95rem',
                mt: 2,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm.75 15h-1.5v-1.5h1.5V17zm0-3h-1.5V7h1.5v7z" />
              </svg>
              Đơn hàng của bạn sẽ được hoàn thành sau 3 ngày kể từ ngày đơn được kiểm tra, vào:{' '}
              <strong>{formatPaymentTime(calculatePaymentTime(order.lastmodifieddate * 1000, 'IN_REVIEW'))}</strong>
            </Box>
          )}
          <Dialog open={confirmOpen && !showOAuthDialog} onClose={() => !isProcessing && setConfirmOpen(false)}>
            <DialogTitle>{t(tokens.nav.confirmStatusChange)}</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2, fontSize: 20, fontWeight: 'bold' }}>
                {statusOptions.find((opt) => opt.value === confirmStatus)?.label || confirmStatus}?
              </Box>

              {/* Always show comment field for all status changes */}
              <TextField
                autoFocus
                fullWidth
                multiline
                rows={3}
                label={confirmStatus === 'NEED_FIX' ? t(tokens.nav.commentRequired) : t(tokens.nav.comment)}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t(tokens.nav.typing)}
                sx={{ mb: 2 }}
                required={confirmStatus === 'NEED_FIX'}
              />

              {/* Nếu là designer và chuyển từ DOING/NEED_FIX sang IN_REVIEW thì cho upload ảnh */}
              {isDesigner &&
                ((order.status === 'DOING' && confirmStatus === 'IN_REVIEW') ||
                  (order.status === 'NEED_FIX' && confirmStatus === 'IN_REVIEW')) && (
                  <Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                      <Button variant="contained" component="label" size="small" disabled={isProcessing}>
                        {t(tokens.nav.chosseImages)}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={(e) => handleUploadImages(e.target.files)}
                        />
                      </Button>

                      {uploadedImages.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            mt: 1,
                            overflowX: 'auto',
                            p: 1,
                            width: '100%',
                            bgcolor: '#f5f5f5',
                          }}
                        >
                          {uploadedImages.map((fileUrl, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0,
                                border: '1px solid #ccc',
                                position: 'relative', // Add relative positioning for the delete button
                              }}
                            >
                              <img
                                src={fileUrl}
                                alt={`uploaded-${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 2,
                                  right: 2,
                                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                                }}
                                onClick={() => handleDeleteImage(index)} // Call delete function with index
                              >
                                <CloseCircleOutlined fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)} disabled={isProcessing}>
                {t(tokens.nav.cancel)}
              </Button>
              <Button
                disabled={
                  isOnCooldown ||
                  isProcessing ||
                  (confirmStatus === 'IN_REVIEW' && uploadFiles.length <= 0 && uploadedImages.length === 0) ||
                  (confirmStatus === 'NEED_FIX' && commentText.trim() === '')
                }
                onClick={async () => {
                  if (
                    isDesigner &&
                    ((order.status === 'DOING' && confirmStatus === 'IN_REVIEW') ||
                      (order.status === 'NEED_FIX' && confirmStatus === 'IN_REVIEW')) &&
                    uploadFiles.length > 0 &&
                    uploadedImages.length > 0
                  ) {
                    await handleSendImages();
                  } else if (isDesigner && order.status === 'NEW' && confirmStatus === 'DOING') {
                    await handleAssignOrder();
                  } else {
                    await handleChangeSingleOrderStatus(confirmStatus, commentText);
                  }
                }}
                variant="contained"
                color="primary"
              >
                {isProcessing ? 'Đang xử lý...' : t(tokens.nav.submit)}
              </Button>
            </DialogActions>
          </Dialog>
          <Box textAlign="right" mt={2}>
            <Button variant="outlined" onClick={() => setShowComments((prev) => !prev)} size="small">
              {showComments ? `${t(tokens.nav.hideComment)}` : `${t(tokens.nav.showComment)}`}
            </Button>
          </Box>
          {showComments && (
            <Box sx={{ padding: '8px 4px' }}>
              <CommentList comments={comments} />
              <CommentInput
                onSubmit={(text) => handleSubmitComment(text)}
                placeholder={t(tokens.nav.typing)}
                t={t(tokens.nav.send)}
                disabled={isProcessing}
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          {t(tokens.nav.close)}
        </Button>
      </DialogActions>
      <OAuthDialog
        isOpen={showOAuthDialog}
        onClose={handleDialogClose}
        authUrl={authData?.authUrl || ''}
        message={authData?.message || ''}
      />
      <Dialog open={zoomImageIndex !== null} onClose={() => setZoomImageIndex(null)} maxWidth="md">
        <DialogContent
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
            bgcolor: '#000',
          }}
        >
          {zoomImageIndex !== null && (
            <>
              <IconButton
                onClick={() => setZoomImageIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                sx={{
                  position: 'absolute',
                  left: 8,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 10,
                }}
              >
                <ChevronLeft fontSize="large" />
              </IconButton>

              {/* Transition ảnh */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={zoomImageIndex}
                  src={imagesList[zoomImageIndex]}
                  alt="Zoomed"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                />
              </AnimatePresence>

              <IconButton
                onClick={() => setZoomImageIndex((prev) => (prev < imagesList.length - 1 ? prev + 1 : prev))}
                sx={{
                  position: 'absolute',
                  right: 8,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  zIndex: 10,
                }}
              >
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default OrderDetailModal;
