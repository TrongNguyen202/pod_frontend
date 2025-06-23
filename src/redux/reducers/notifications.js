import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  notificationSendPush: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchSendPushNotifications = createAsyncThunk('/notifications/send-push', async ({ data }) => {
  const res = await RepositoryRemote.notifications.requestSendPushNotifications(data);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setQueryAllNotification: (state, action) => {
      state.comments.query = action.payload;
    },
    resetNotifications(state) {
      state.commentsInfo = {
        loading: false,
        error: '',
        data: {},
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSendPushNotifications.pending, (state) => {
      state.notificationSendPush.loading = true;
    });
    builder.addCase(fetchSendPushNotifications.fulfilled, (state, action) => {
      state.notificationSendPush.loading = false;
      state.notificationSendPush.data = action.payload.bodyData;
      state.notificationSendPush.error = '';
    });
    builder.addCase(fetchSendPushNotifications.rejected, (state, action) => {
      state.notificationSendPush.loading = false;
      state.notificationSendPush.data = [];
      state.notificationSendPush.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllNotification, resetNotifications } = slicer.actions;

export default slicer.reducer;
