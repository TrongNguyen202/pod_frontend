import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  fcmtokenService: {
    loading: false,
    error: '',
    data: [],
  },
  fcmtokenInfo: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchPostFcmToken = createAsyncThunk('/post/fcmtoken', async ({ data }) => {
  const res = await RepositoryRemote.fcmtoken.requestPostFcmToken(data);
  return res?.data?.data;
});

export const fetchGetFcmTokenByUserId = createAsyncThunk('/get/fcmtoken/userid', async (userId) => {
  const res = await RepositoryRemote.fcmtoken.requestGetFcmTokenByUserId(userId);
  return res.data;
});

const slicer = createSlice({
  name: 'fcmtoken',
  initialState,
  extraReducers: (builder) => {
    // Post comment realtime len firebase
    builder.addCase(fetchPostFcmToken.pending, (state) => {
      state.fcmtokenService.loading = true;
    });
    builder.addCase(fetchPostFcmToken.fulfilled, (state, action) => {
      state.fcmtokenService.loading = false;
      state.fcmtokenService.data = action.payload.bodyData;
      state.fcmtokenService.error = '';
    });
    builder.addCase(fetchPostFcmToken.rejected, (state, action) => {
      state.fcmtokenService.loading = false;
      state.fcmtokenService.data = [];
      state.fcmtokenService.error = action?.error?.message || 'Error while processing.';
    });

    // Post comment len posgres
    builder.addCase(fetchGetFcmTokenByUserId.pending, (state) => {
      state.fcmtokenInfo.loading = true;
    });
    builder.addCase(fetchGetFcmTokenByUserId.fulfilled, (state, action) => {
      state.fcmtokenInfo.loading = false;
      state.fcmtokenInfo.data = action.payload.data;
      state.fcmtokenInfo.error = '';
    });
    builder.addCase(fetchGetFcmTokenByUserId.rejected, (state, action) => {
      state.fcmtokenInfo.loading = false;
      state.fcmtokenInfo.data = [];
      state.fcmtokenInfo.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllComments, resetDataListComments } = slicer.actions;

export default slicer.reducer;
