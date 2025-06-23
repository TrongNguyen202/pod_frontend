import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  userWalletInfo: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetWalletInfoByUserId = createAsyncThunk('/fetch/userwallet', async ({ data }) => {
  const res = await RepositoryRemote.userwallets.requestGetWalletInfo(data);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'user-wallets',
  initialState,
  extraReducers: (builder) => {
    // Lay thong tin wallet user
    builder.addCase(fetchGetWalletInfoByUserId.pending, (state) => {
      state.userWalletInfo.loading = true;
    });
    builder.addCase(fetchGetWalletInfoByUserId.fulfilled, (state, action) => {
      state.userWalletInfo.loading = false;
      state.userWalletInfo.data = action.payload;
      state.userWalletInfo.error = '';
    });
    builder.addCase(fetchGetWalletInfoByUserId.rejected, (state, action) => {
      state.userWalletInfo.loading = false;
      state.userWalletInfo.data = [];
      state.userWalletInfo.error = action?.error?.message || 'Error while processing.';
    });
  },
});

// export const { setQueryAllComments, resetDataListComments, resetComments } = slicer.actions;

export default slicer.reducer;
