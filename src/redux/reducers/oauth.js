import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  oauthAutho: {
    loading: false,
    error: '',
    data: [],
  },
  oauthStatus: {
    loading: false,
    error: '',
    data: [],
  },
  oauthRevoke: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchAuthorizeOauth = createAsyncThunk('/post/oauth/autho', async () => {
  const res = await RepositoryRemote.oauth.requestPostAuthorizeOauth();
  return res?.data?.data;
});

export const fetchStatusOauth = createAsyncThunk('/get/oauth/status', async () => {
  const res = await RepositoryRemote.oauth.requestGetStatusOauth();
  return res?.data?.data;
});

export const fetchRevokeOauth = createAsyncThunk('/delete/oauth', async () => {
  const res = await RepositoryRemote.oauth.requestRevokeOauth();
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'oauth',
  initialState,
  extraReducers: (builder) => {
    // Lay thong tin cac template tu boardId
    builder.addCase(fetchAuthorizeOauth.pending, (state) => {
      state.oauthAutho.loading = true;
    });
    builder.addCase(fetchAuthorizeOauth.fulfilled, (state, action) => {
      state.oauthAutho.loading = false;
      state.oauthAutho.data = action.payload;
      state.oauthAutho.error = '';
    });
    builder.addCase(fetchAuthorizeOauth.rejected, (state, action) => {
      state.oauthAutho.loading = false;
      state.oauthAutho.data = [];
      state.oauthAutho.error = action?.error?.message || 'Error while processing.';
    });

    // Tao moi template
    builder.addCase(fetchStatusOauth.pending, (state) => {
      state.oauthStatus.loading = true;
    });
    builder.addCase(fetchStatusOauth.fulfilled, (state, action) => {
      state.oauthStatus.loading = false;
      state.oauthStatus.data = action;
      state.oauthStatus.error = '';
    });
    builder.addCase(fetchStatusOauth.rejected, (state, action) => {
      state.oauthStatus.loading = false;
      state.oauthStatus.data = [];
      state.oauthStatus.error = action?.error?.message || 'Error while processing.';
    });

    // Xoa template
    builder.addCase(fetchRevokeOauth.pending, (state) => {
      state.oauthRevoke.loading = true;
    });
    builder.addCase(fetchRevokeOauth.fulfilled, (state, action) => {
      state.oauthRevoke.loading = false;
      state.oauthRevoke.data = action.payload.bodyData;
      state.oauthRevoke.error = '';
    });
    builder.addCase(fetchRevokeOauth.rejected, (state, action) => {
      state.oauthRevoke.loading = false;
      state.oauthRevoke.data = [];
      state.oauthRevoke.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllTemplates, resetDataListTemplates } = slicer.actions;

export default slicer.reducer;
