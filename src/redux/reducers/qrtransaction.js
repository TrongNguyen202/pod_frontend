import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  qrInfo: {
    loading: false,
    error: '',
    data: [],
  },
  pendingQrInfo: {
    loading: false,
    error: '',
    data: [],
  },
  webhookInfo: {
    loading: false,
    error: '',
    data: [],
  },
  paymentInfo: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchCreateQr = createAsyncThunk('/create/qr', async ({ userId, amount, transactionCode }) => {
  const res = await RepositoryRemote.qrtransaction.requestPostCreateQr(userId, amount, transactionCode);
  return res?.data?.data;
});

export const fetchGetPendingQr = createAsyncThunk('/peding', async (data) => {
  const res = await RepositoryRemote.qrtransaction.requestGetPendingQr(data);
  return res.data;
});

export const fetchPostWebhookQr = createAsyncThunk('/webhook/', async (data) => {
  const res = await RepositoryRemote.qrtransaction.requestPostWebhookSepay(data);
  return res.data;
});

export const fetchGetInfoPayment = createAsyncThunk('/get/info/payment', async (transactionCode) => {
  const res = await RepositoryRemote.qrtransaction.requestGetPaymentInfo(transactionCode);
  return res.data;
});

const slicer = createSlice({
  name: 'qrtransaction',
  initialState,
  extraReducers: (builder) => {
    // Tao qr
    builder.addCase(fetchCreateQr.pending, (state) => {
      state.qrInfo.loading = true;
    });
    builder.addCase(fetchCreateQr.fulfilled, (state, action) => {
      state.qrInfo.loading = false;
      state.qrInfo.data = action.payload.bodyData;
      state.qrInfo.error = '';
    });
    builder.addCase(fetchCreateQr.rejected, (state, action) => {
      state.qrInfo.loading = false;
      state.qrInfo.data = [];
      state.qrInfo.error = action?.error?.message || 'Error while processing.';
    });

    // Lay pending qr
    builder.addCase(fetchGetPendingQr.pending, (state) => {
      state.pendingQrInfo.loading = true;
    });
    builder.addCase(fetchGetPendingQr.fulfilled, (state, action) => {
      state.pendingQrInfo.loading = false;
      state.pendingQrInfo.data = action.payload.data;
      state.pendingQrInfo.error = '';
    });
    builder.addCase(fetchGetPendingQr.rejected, (state, action) => {
      state.pendingQrInfo.loading = false;
      state.pendingQrInfo.data = [];
      state.pendingQrInfo.error = action?.error?.message || 'Error while processing.';
    });

    // Ban webhook
    builder.addCase(fetchPostWebhookQr.pending, (state) => {
      state.webhookInfo.loading = true;
    });
    builder.addCase(fetchPostWebhookQr.fulfilled, (state, action) => {
      state.webhookInfo.loading = false;
      state.webhookInfo.data = action.payload.data;
      state.webhookInfo.error = '';
    });
    builder.addCase(fetchPostWebhookQr.rejected, (state, action) => {
      state.webhookInfo.loading = false;
      state.webhookInfo.data = [];
      state.webhookInfo.error = action?.error?.message || 'Error while processing.';
    });

    // Lay thong tin payment check interval kiem tra giao dich
    builder.addCase(fetchGetInfoPayment.pending, (state) => {
      state.paymentInfo.loading = true;
    });
    builder.addCase(fetchGetInfoPayment.fulfilled, (state, action) => {
      state.paymentInfo.loading = false;
      state.paymentInfo.data = action.payload.data;
      state.paymentInfo.error = '';
    });
    builder.addCase(fetchGetInfoPayment.rejected, (state, action) => {
      state.paymentInfo.loading = false;
      state.paymentInfo.data = [];
      state.paymentInfo.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllComments, resetDataListComments, resetComments } = slicer.actions;

export default slicer.reducer;
