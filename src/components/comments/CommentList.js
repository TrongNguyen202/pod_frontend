import React from 'react';
import { Typography, Box } from '@mui/material';
import { formatMiliToDateTime } from 'src/utils/date';

const CommentList = ({ comments }) => {
  return (
    <>
      {comments.map((comment, index) => (
        <Box
          key={comment.commentId || index}
          sx={{
            border: '1px solid #f2f2f2',
            borderRadius: 2,
            margin: '8px 4px',
            padding: '8px 12px',
          }}
        >
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
    </>
  );
};

export default React.memo(CommentList);
