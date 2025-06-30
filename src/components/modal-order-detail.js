import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Chip,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';
import { listenToOrderComments } from 'src/services/firebase';
import {
  fetchPostCommentFirebase,
  fetchPostCommentPosgres,
  fetchGetCommentsByOrderId,
  addComment,
} from 'src/redux/reducers/comments';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import CommentList from './comments/CommentList';
import CommentInput from './comments/CommentInput';
import { checkRole, getAllowedStatusOptions } from 'src/utils';
import { categoryColors, categoryLabelsVi, categoryStatusVi } from 'src/constants';
import {
  changeStatusOrders,
  fetchAssignOrdersForDesigner,
  fetchGetAllStatus,
  fetchGetOrdersByBoardId,
  fetchUploadImagesForDesigner,
} from 'src/redux/reducers/orders';
import { toast } from 'react-toastify';
import { fetchSendPushNotifications } from 'src/redux/reducers/notifications';
import { useSelector } from 'react-redux';

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
  const inputCommentRef = useRef(null);
  const seenCommentIdsRef = useRef(new Set());
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const comments = useAppSelector((state) => state.comments.commentsInfo.data, shallowEqual);
  const comments = useAppSelector((state) => state.comments.commentsInfo.data);
  const { loading, data, error } = useSelector((state) => state.orders.uploadImageService);
  const { isCustomer, isDesigner } = checkRole(role);

  useEffect(() => {
    if (order?.id) {
      dispatch(fetchGetCommentsByOrderId(order.id));
    }
  }, [dispatch, order?.id, open]);

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

  useEffect(() => {
    if (!order?.id) return;

    const unsubscribe = listenToOrderComments(order.id, (newComment) => {
      if (!seenCommentIdsRef.current.has(newComment.commentId)) {
        seenCommentIdsRef.current.add(newComment.commentId);
        dispatch(addComment(newComment));
      }
    });

    return () => {
      unsubscribe?.();
      const currentSeenIds = seenCommentIdsRef.current;
      currentSeenIds.clear();
    };
  }, [dispatch, order?.id]);

  if (!order) return null;

  const imagesList = JSON.parse(order.images || '[]');
  const currentStatuses = [order.status];
  const allowedStatuses = getAllowedStatusOptions(role, currentStatuses);
  const statusOptions = allowedStatuses.map((s) => ({
    label: categoryStatusVi[s] || s,
    value: s,
  }));

  const handleSubmitComment = async (commentText) => {
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
    }
    setCommentText('');
  };

  const handleUploadImages = (files) => {
    const fileArray = Array.from(files);
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...urls]);
    setUploadFiles((prev) => [...prev, ...fileArray]);
  };

  const sendNotification = async (userId, designerId) => {
    const data = {
      designerIds: Array.isArray(designerId) ? designerId : [designerId ?? 0],
      customerIds: Array.isArray(userId) ? userId : [userId ?? 0],
      title: 'Trạng thái đơn hàng',
      message: 'Có đơn hàng của bạn thay đổi trạng thái, vào xem ngay!',
    };

    dispatch(fetchSendPushNotifications(data));
  };

  const handleSendImages = async () => {
    if (uploadFiles.length === 0) return;

    const formData = new FormData();
    uploadFiles.forEach((file) => {
      formData.append('files', file);
    });

    const toastId = toast.loading('Đang upload ảnh...');
    try {
      const response = await dispatch(fetchUploadImagesForDesigner({ orderId: order.id, data: formData })).unwrap();
      onClose();
      if (response.success === true) {
        toast.update(toastId, {
          render: 'Upload thành công!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        await handleChangeSingleOrderStatus('IN_REVIEW');
        await dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() }));
        await dispatch(fetchGetAllStatus(''));
        await sendNotification(order.userid, order.designerId);
      }
      setUploadedImages([]);
      setUploadFiles([]);
    } catch (err) {
      toast.update(toastId, {
        render: 'Upload thất bại!',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      console.error('Upload thất bại:', err);
    }
  };

  const handleChangeSingleOrderStatus = async (newStatus, optionalComment = '') => {
    if (!order?.id) return;

    const data = {
      ids: [order.id],
      status: newStatus,
    };

    const response = await dispatch(changeStatusOrders({ data }));
    const { status, message } = response.payload || {};

    if (status === 200) {
      toast.success('Cập nhật trạng thái thành công');
      switch (newStatus) {
        case 'DOING':
        case 'IN_REVIEW':
          await sendNotification(order.userid, null);
          break;
        case 'NEED_FIX':
          await sendNotification(null, order.designerId);
          break;
        default:
      }
      if (newStatus === 'NEED_FIX' && optionalComment.trim() !== '') {
        await handleSubmitComment(optionalComment);
      }

      await dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() }));
      if (onStatusChanged) {
        onStatusChanged();
      }

      onClose();
    } else {
      toast.error(message || 'Đổi trạng thái thất bại');
    }
  };

  const handleAssignOrder = async () => {
    if (!order?.id || role !== 'designer') return;

    const response = await dispatch(
      fetchAssignOrdersForDesigner({
        data: { orderIds: [order?.id] },
      }),
    );

    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Nhận đơn thành công!');
      await dispatch(fetchGetOrdersByBoardId({ query: buildQueryString() }));
      await dispatch(fetchGetAllStatus(''));
      await sendNotification(order.userid, null);
    } else {
      toast.error(message || 'Nhận đơn thất bại!');
    }
    onClose();
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
            label={categoryStatusVi[order.status] || order.status}
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
            <Typography fontWeight="bold">{t(tokens.nav.imagesDescription)}:</Typography>
            {imagesList.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  p: 1,
                  overflowX: 'auto',
                  bgcolor: '#fafafa',
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

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>{t(tokens.nav.confirmStatusChange)}</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2, fontSize: 20, fontWeight: 'bold' }}>
                {statusOptions.find((opt) => opt.value === confirmStatus)?.label || confirmStatus}?
              </Box>

              {confirmStatus === 'NEED_FIX' && (
                <TextField
                  autoFocus
                  fullWidth
                  multiline
                  rows={3}
                  label={t(tokens.nav.commentRequired)}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t(tokens.nav.typing)}
                  sx={{ mb: 2 }}
                />
              )}

              {/* Nếu là designer và chuyển từ DOING/NEED_FIX sang IN_REVIEW thì cho upload ảnh */}
              {isDesigner &&
                ((order.status === 'DOING' && confirmStatus === 'IN_REVIEW') ||
                  (order.status === 'NEED_FIX' && confirmStatus === 'IN_REVIEW')) && (
                  <Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                      <Button variant="contained" component="label" size="small">
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
                              }}
                            >
                              <img
                                src={fileUrl}
                                alt={`uploaded-${index}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>{t(tokens.nav.cancel)}</Button>
              <Button
                disabled={
                  (confirmStatus === 'IN_REVIEW' && uploadFiles.length <= 0) ||
                  (confirmStatus === 'NEED_FIX' && commentText.trim() === '')
                }
                onClick={async () => {
                  if (
                    isDesigner &&
                    ((order.status === 'DOING' && confirmStatus === 'IN_REVIEW') ||
                      (order.status === 'NEED_FIX' && confirmStatus === 'IN_REVIEW')) &&
                    uploadFiles.length > 0
                  ) {
                    await handleSendImages();
                  } else if (isDesigner && order.status === 'NEW' && confirmStatus === 'DOING') {
                    await handleAssignOrder();
                  } else {
                    await handleChangeSingleOrderStatus(confirmStatus, commentText);
                  }

                  setConfirmOpen(false);
                  setCommentText('');
                }}
                variant="contained"
                color="primary"
              >
                {t(tokens.nav.submit)}
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
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t(tokens.nav.close)}</Button>
      </DialogActions>

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
