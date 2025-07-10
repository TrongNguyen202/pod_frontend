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
  oauthAuthoAdmin: {
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
  oauthRevokeAdmin: {
    loading: false,
    error: '',
    data: [],
  },
  oauthDriveInfo: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchAuthorizeOauth = createAsyncThunk('/post/oauth/autho', async () => {
  const res = await RepositoryRemote.oauth.requestPostAuthorizeOauth();
  return res?.data?.data;
});

export const fetchAuthorizeOauthAdmin = createAsyncThunk('/post/oauth/autho/admin', async () => {
  const res = await RepositoryRemote.oauth.requestPostAuthorizeOauthAdmin();
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

export const fetchRevokeOauthAdmin = createAsyncThunk('/delete/oauth/admin', async () => {
  const res = await RepositoryRemote.oauth.requestRevokeOauthAdmin();
  return res?.data?.data;
});

export const fetchDriveInfoAdmin = createAsyncThunk('/drive/info/admin', async () => {
  const res = await RepositoryRemote.oauth.requestGetDriveInfoAdmin();
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

    // Authozire admin
    builder.addCase(fetchAuthorizeOauthAdmin.pending, (state) => {
      state.oauthAuthoAdmin.loading = true;
    });
    builder.addCase(fetchAuthorizeOauthAdmin.fulfilled, (state, action) => {
      state.oauthAuthoAdmin.loading = false;
      state.oauthAuthoAdmin.data = action.payload;
      state.oauthAuthoAdmin.error = '';
    });
    builder.addCase(fetchAuthorizeOauthAdmin.rejected, (state, action) => {
      state.oauthAuthoAdmin.loading = false;
      state.oauthAuthoAdmin.data = [];
      state.oauthAuthoAdmin.error = action?.error?.message || 'Error while processing.';
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

    // Xoa template
    builder.addCase(fetchRevokeOauthAdmin.pending, (state) => {
      state.oauthRevokeAdmin.loading = true;
    });
    builder.addCase(fetchRevokeOauthAdmin.fulfilled, (state, action) => {
      state.oauthRevokeAdmin.loading = false;
      state.oauthRevokeAdmin.data = action;
      state.oauthRevokeAdmin.error = '';
    });
    builder.addCase(fetchRevokeOauthAdmin.rejected, (state, action) => {
      state.oauthRevokeAdmin.loading = false;
      state.oauthRevokeAdmin.data = [];
      state.oauthRevokeAdmin.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchDriveInfoAdmin.pending, (state) => {
      state.oauthDriveInfo.loading = true;
    });
    builder.addCase(fetchDriveInfoAdmin.fulfilled, (state, action) => {
      state.oauthDriveInfo.loading = false;
      state.oauthDriveInfo.data = action.payload;
      state.oauthDriveInfo.error = '';
    });
    builder.addCase(fetchDriveInfoAdmin.rejected, (state, action) => {
      state.oauthDriveInfo.loading = false;
      state.oauthDriveInfo.data = [];
      state.oauthDriveInfo.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllTemplates, resetDataListTemplates } = slicer.actions;

export default slicer.reducer;
