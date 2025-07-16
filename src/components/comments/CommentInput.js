'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton, Typography, Chip, Stack } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';

const CommentInput = ({ onSubmit, placeholder = '', t, disabled = false, uploadImagesConcurrently }) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 50 * 1024 * 1024, // 50MB limit
    );

    if (validFiles.length !== files.length) {
      alert('Một số file không hợp lệ (chỉ chấp nhận ảnh < 50MB)');
    }

    // Add files to selected images
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
          id: Date.now() + Math.random(),
        };
        setSelectedImages((prev) => [...prev, imageData]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    event.target.value = '';
  };

  // Remove selected image
  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    let imageUrls = [];

    // Upload images if any
    if (selectedImages.length > 0) {
      setUploading(true);
      try {
        const imageFiles = selectedImages.map((img) => img.file);
        imageUrls = await uploadImagesConcurrently(imageFiles);
        console.log(imageUrls);
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('Lỗi khi upload ảnh');
        return;
      } finally {
        setUploading(false);
      }
    }

    // Submit comment with text and image URLs
    onSubmit(text.trim(), imageUrls);

    // Clear form
    setText('');
    setSelectedImages([]);
  };

  // Focus when component is mounted
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ padding: '8px 4px' }}>
      {/* Image preview */}
      {selectedImages.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Ảnh đã chọn ({selectedImages.length}):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedImages.map((image) => (
              <Box key={image.id} sx={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={image.preview}
                  alt={image.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(image.id)}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: 'error.main',
                    color: 'white',
                    width: 20,
                    height: 20,
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                >
                  <Delete fontSize="inherit" />
                </IconButton>
                <Chip
                  label={`${Math.round(image.size / 1024)}KB`}
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    height: 16,
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Input area */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <TextField
          size="small"
          inputRef={inputRef}
          variant="outlined"
          fullWidth
          multiline
          maxRows={4}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled || uploading}
        />

        {/* Image upload button */}
        <IconButton color="primary" component="label" disabled={disabled || uploading} sx={{ mb: 0.5 }}>
          <PhotoCamera />
          <input ref={fileInputRef} type="file" hidden multiple accept="image/*" onChange={handleFileSelect} />
        </IconButton>

        {/* Submit button */}
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={disabled || uploading || (!text.trim() && selectedImages.length === 0)}
          sx={{ mb: 0.5 }}
        >
          {uploading ? 'Đang gửi...' : t}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(CommentInput);
