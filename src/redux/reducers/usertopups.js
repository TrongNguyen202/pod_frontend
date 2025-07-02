import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  userTransactionInfo: {
    loading: false,
    error: '',
    data: {
      transactions: [],
      total: 0,
      totalIn: 0,
      totalOut: 0,
      totalUse: 0,
      totalMake: 0,
    },
  },
  updateStatusTransaction: {
    loading: false,
    data: [],
    error: '',
  },

  createWithdraw: {
    laoding: false,
    data: [],
    error: '',
  },
};

export const fetchGetTopupInfo = createAsyncThunk('/fetch/usertopups', async (query) => {
  const res = await RepositoryRemote.usertopups.requestGetTransactionInfo(query);
  return res?.data?.data;
});

export const fetchUpdateStatusTransaction = createAsyncThunk('/fetch/vetify/transaction', async (data) => {
  const res = await RepositoryRemote.usertopups.requestUpdateStatusTransaction(data);
  return res?.data?.data;
});

export const fetchCreateWithdraw = createAsyncThunk('/create/withdraw', async (data) => {
  const res = await RepositoryRemote.usertopups.requestCreateWithdraw(data);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'usertopups',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGetTopupInfo.pending, (state) => {
      state.userTransactionInfo.loading = true;
    });
    builder.addCase(fetchGetTopupInfo.fulfilled, (state, action) => {
      state.userTransactionInfo.loading = false;
      state.userTransactionInfo.data = action.payload;
      state.userTransactionInfo.error = '';
    });
    builder.addCase(fetchGetTopupInfo.rejected, (state, action) => {
      state.userTransactionInfo.loading = false;
      state.userTransactionInfo.data = [];
      state.userTransactionInfo.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchUpdateStatusTransaction.pending, (state) => {
      state.updateStatusTransaction.loading = true;
    });
    builder.addCase(fetchUpdateStatusTransaction.fulfilled, (state, action) => {
      state.updateStatusTransaction.loading = false;
      state.updateStatusTransaction.data = action.payload;
      state.updateStatusTransaction.error = '';
    });
    builder.addCase(fetchUpdateStatusTransaction.rejected, (state, action) => {
      state.updateStatusTransaction.loading = false;
      state.updateStatusTransaction.data = [];
      state.updateStatusTransaction.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchCreateWithdraw.pending, (state) => {
      state.createWithdraw.loading = true;
    });
    builder.addCase(fetchCreateWithdraw.fulfilled, (state, action) => {
      state.createWithdraw.loading = false;
      state.createWithdraw.data = action.payload;
      state.createWithdraw.error = '';
    });
    builder.addCase(fetchCreateWithdraw.rejected, (state, action) => {
      state.createWithdraw.loading = false;
      state.createWithdraw.data = [];
      state.createWithdraw.error = action?.error?.message || 'Error while processing.';
    });
  },
});

// export const { setQueryAllComments, resetDataListComments, resetComments } = slicer.actions;

export default slicer.reducer;
