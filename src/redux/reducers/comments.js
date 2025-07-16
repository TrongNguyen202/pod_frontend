import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  commentsFirebase: {
    loading: false,
    error: '',
    data: [],
  },
  commentsPosgres: {
    loading: false,
    error: '',
    data: [],
  },
  commentsInfo: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchPostCommentFirebase = createAsyncThunk('/post/firebase', async (data) => {
  const res = await RepositoryRemote.comments.requestPostCommentToFirebase(data);
  return res?.data?.data;
});

export const fetchPostCommentPosgres = createAsyncThunk('/post/posgres', async (data) => {
  const res = await RepositoryRemote.comments.requestPostCommentToPosgres(data);
  return res.data;
});

export const fetchGetCommentsByOrderId = createAsyncThunk('/get/comments/orderid', async (orderId) => {
  const res = await RepositoryRemote.comments.requestGetCommentByOrderId(orderId);
  return res.data;
});

const slicer = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setQueryAllComments: (state, action) => {
      state.comments.query = action.payload;
    },
    resetDataListComments: (state, action) => {
      state.comments.data = {};
    },
    resetComments(state) {
      state.commentsInfo = {
        loading: false,
        error: '',
        data: {},
      };
    },
    addComment: (state, action) => {
      const comment = action.payload;
      const newId = comment.commentId || comment.comment_id;

      // Khởi tạo nếu chưa có
      if (!state.commentsInfo?.data) {
        state.commentsInfo = { data: [] };
      }

      const exists = state.commentsInfo.data.some((c) => {
        const existingId = c.commentId || c.comment_id;
        return existingId === newId;
      });

      if (!exists && newId) {
        state.commentsInfo.data.push(comment);
      }
    },
  },
  extraReducers: (builder) => {
    // Post comment realtime len firebase
    builder.addCase(fetchPostCommentFirebase.pending, (state) => {
      state.commentsFirebase.loading = true;
    });
    builder.addCase(fetchPostCommentFirebase.fulfilled, (state, action) => {
      state.commentsFirebase.loading = false;
      state.commentsFirebase.data = action.payload.bodyData;
      state.commentsFirebase.error = '';
    });
    builder.addCase(fetchPostCommentFirebase.rejected, (state, action) => {
      state.commentsFirebase.loading = false;
      state.commentsFirebase.data = [];
      state.commentsFirebase.error = action?.error?.message || 'Error while processing.';
    });

    // Post comment len posgres
    builder.addCase(fetchPostCommentPosgres.pending, (state) => {
      state.commentsPosgres.loading = true;
    });
    builder.addCase(fetchPostCommentPosgres.fulfilled, (state, action) => {
      state.commentsPosgres.loading = false;
      state.commentsPosgres.data = action.payload.data;
      state.commentsPosgres.error = '';
    });
    builder.addCase(fetchPostCommentPosgres.rejected, (state, action) => {
      state.commentsPosgres.loading = false;
      state.commentsPosgres.data = [];
      state.commentsPosgres.error = action?.error?.message || 'Error while processing.';
    });

    // Lay comments tu orderId
    builder.addCase(fetchGetCommentsByOrderId.pending, (state) => {
      state.commentsInfo.loading = true;
    });
    builder.addCase(fetchGetCommentsByOrderId.fulfilled, (state, action) => {
      state.commentsInfo.loading = false;
      state.commentsInfo.data = action.payload.data;
      state.commentsInfo.error = '';
    });
    builder.addCase(fetchGetCommentsByOrderId.rejected, (state, action) => {
      state.commentsInfo.loading = false;
      state.commentsInfo.data = [];
      state.commentsInfo.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllComments, resetDataListComments, resetComments, addComment } = slicer.actions;

export default slicer.reducer;
