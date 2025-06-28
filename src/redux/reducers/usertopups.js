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
};

export const fetchGetTopupInfo = createAsyncThunk('/fetch/usertopups', async (query) => {
  const res = await RepositoryRemote.usertopups.requestGetTransactionInfo(query);
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
  },
});

// export const { setQueryAllComments, resetDataListComments, resetComments } = slicer.actions;

export default slicer.reducer;
