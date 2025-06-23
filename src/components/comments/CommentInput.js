import React, { useRef, useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';

const CommentInput = ({ onSubmit, placeholder = '', t }) => {
  const inputRef = useRef(null);
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  // 🔥 Focus khi component được mounted
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        size="small"
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{ margin: '8px 4px' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <Button variant="contained" size="small" onClick={handleSubmit}>
        {t}
      </Button>
    </Box>
  );
};

export default React.memo(CommentInput);
