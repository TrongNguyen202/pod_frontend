import React, { useState } from 'react';
import { Typography, Box, ImageList, ImageListItem, Modal, IconButton, Backdrop } from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import { formatMiliToDateTime } from 'src/utils/date';
import { parseCommentImages } from 'src/utils';

const CommentList = ({ comments }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const uniqueComments = Array.from(new Map(comments?.map((comment) => [comment.comment_id, comment])).values());

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage('');
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comment-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <>
      {uniqueComments.map((comment, index) => (
        <Box
          key={`comment-${index}`}
          sx={{
            border: '1px solid #f2f2f2',
            borderRadius: 2,
            margin: '8px 4px',
            padding: '8px 12px',
          }}
        >
          {/* Comment images */}
          {parseCommentImages(comment) && parseCommentImages(comment).length > 0 && (
            <Box sx={{ mt: 1 }}>
              <ImageList cols={parseCommentImages(comment).length > 1 ? 2 : 1} gap={8} sx={{ maxWidth: 300 }}>
                {parseCommentImages(comment).map((imageUrl, index) => (
                  <ImageListItem key={index}>
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={`Comment image ${index + 1}`}
                      onClick={() => handleImageClick(imageUrl)}
                      sx={{
                        width: '100%',
                        maxHeight: '280px',
                        height: 'fit-content',
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          overflow: 'scroll',
                        },
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          )}

          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            <Box component="span" fontWeight="bold" display="inline">
              {comment.username} ({comment.role})
            </Box>
            {': '}
            {comment.message}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {formatMiliToDateTime(comment.createdAt)}
          </Typography>
        </Box>
      ))}

      {/* Image Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Control buttons */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={handleDownloadImage}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <DownloadIcon />
            </IconButton>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'black',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Image */}
          <Box
            component="img"
            src={selectedImage}
            alt="Enlarged comment image"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 1,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default React.memo(CommentList);
