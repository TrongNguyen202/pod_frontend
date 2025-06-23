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
import { useAppDispatch, useAppSelector, shallowEqual } from 'src/redux/hook';
import CommentList from './comments/CommentList';
import CommentInput from './comments/CommentInput';
import { checkRole } from 'src/utils';

const categoryLabelsVi = {
  NEW: 'Tạo mới',
  RE_DESIGN: 'Thiết kế lại',
  CLONE: 'Tạo bản sao',
};

const OrderDetailModal = ({
  open,
  order,
  onClose,
  handleAmountFormat = (v) => v.toString(),
  userData,
  role,
  productTypeData,
}) => {
  if (!order) return null;
  const [showComments, setShowComments] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const inputCommentRef = useRef(null);
  const { isDesigner } = checkRole(role);
  // const [comments, setComments] = useState([]);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const imagesList = JSON.parse(order.images || '[]');

  useEffect(() => {
    dispatch(fetchGetCommentsByOrderId(order.id));
  }, [dispatch, order, open]);

  const comments = useAppSelector((state) => state.comments.commentsInfo.data, shallowEqual);

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
      // await dispatch(fetchGetCommentsByOrderId(order.id));
    }
    setCommentText('');
  };

  useEffect(() => {
    if (showComments !== null && inputCommentRef.current) {
      inputCommentRef.current.focus();
    }
  }, [showComments]);

  const seenCommentIdsRef = useRef(new Set());

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
      seenCommentIdsRef.current.clear(); // dọn dẹp
    };
  }, [order?.id]);

  const handleUploadImages = (files) => {
    const fileArray = Array.from(files);
    const urls = fileArray.map((file) => URL.createObjectURL(file));
    setUploadedImages((prev) => [...prev, ...urls]);
    setUploadFiles((prev) => [...prev, ...fileArray]);
  };

  const handleSendImages = async () => {
    if (uploadFiles.length === 0) return;

    const formData = new FormData();
    uploadFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      // const res = await RepositoryRemote.uploadImages(formData); // gọi API backend thật sự ở đây
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      console.log('Upload thành công:');
      setUploadedImages([]);
      setUploadFiles([]);
    } catch (err) {
      console.error('Upload thất bại:', err);
    } finally {
      onClose();
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
      <DialogTitle>{t(tokens.nav.details)}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          overflowY: 'auto',
        }}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.creator)}:</Typography>
            <Typography>{order.usercreate}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.designer)}:</Typography>
            <Typography>{order.designername}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.nameProduct)}:</Typography>
            <Typography>{order.name}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.description)}:</Typography>
            <Typography>{order.description}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.faceNumber)}:</Typography>
            <Typography>{order.quantity}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.price)}:</Typography>
            <Typography>{handleAmountFormat(order.price)} VNĐ</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.product_type)}:</Typography>
            <Typography>{productTypeData.find((pt) => pt.id === order.producttypeid)?.name}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.design_type)}:</Typography>
            <Typography>{categoryLabelsVi[order.designtype]}</Typography>
          </Box>
          <Box display="flex">
            <Typography sx={{ width: 140, fontWeight: 'bold' }}>{t(tokens.nav.createdDate)}:</Typography>
            <Typography>
              {order.createddate.slice(11, 16)} {order.createddate.slice(8, 10)}-{order.createddate.slice(5, 7)}-
              {order.createddate.slice(0, 4)}
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
          {isDesigner && (
            <Box>
              <Typography fontWeight="bold" mb={1} mt={2}>
                {t(tokens.nav.uploadImages)}
              </Typography>
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
              {uploadedImages.length > 0 && (
                <Box sx={{ right: '100%', display: 'flex', justifyContent: 'end' }}>
                  <Button variant="contained" size="small" onClick={handleSendImages}>
                    {t(tokens.nav.send)}
                  </Button>
                </Box>
              )}
            </Box>
          )}
          <Box textAlign="right" mt={2}>
            <Button variant="outlined" onClick={() => setShowComments((prev) => !prev)} size="small">
              {showComments ? `${t(tokens.nav.hideComment)}` : `${t(tokens.nav.showComment)}`}
            </Button>
          </Box>
          {showComments && (
            <Box sx={{ padding: '8px 4px' }}>
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
