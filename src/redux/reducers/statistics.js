import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  order: {
    loading: false,
    error: '',
    data: [],
  },
  finance: {
    loading: false,
    error: '',
    data: [],
  },
  financeToday: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetStatisticsOrder = createAsyncThunk('/statistics/order', async (query) => {
  const res = await RepositoryRemote.statistics.requestGetStatisticOrder(query);
  return res.data.data;
});

export const fetchGetStatisticsFinance = createAsyncThunk('/statistics/finance', async (query) => {
  const res = await RepositoryRemote.statistics.requestGetStatisticFinance(query);
  return res.data.data;
});

export const fetchGetStatisticsFinanceToday = createAsyncThunk('/statistics/finance-today', async (query) => {
  const res = await RepositoryRemote.statistics.requestGetStatisticFinance(query);
  return res.data.data;
});

const slicer = createSlice({
  name: 'statistics',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGetStatisticsOrder.pending, (state) => {
      state.order.loading = true;
    });
    builder.addCase(fetchGetStatisticsOrder.fulfilled, (state, action) => {
      state.order.loading = false;
      state.order.data = action.payload;
      state.order.error = '';
    });
    builder.addCase(fetchGetStatisticsOrder.rejected, (state, action) => {
      state.order.loading = false;
      state.order.data = [];
      state.order.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetStatisticsFinance.pending, (state) => {
      state.finance.loading = true;
    });
    builder.addCase(fetchGetStatisticsFinance.fulfilled, (state, action) => {
      state.finance.loading = false;
      state.finance.data = action.payload;
      state.finance.error = '';
    });
    builder.addCase(fetchGetStatisticsFinance.rejected, (state, action) => {
      state.finance.loading = false;
      state.finance.data = [];
      state.finance.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetStatisticsFinanceToday.pending, (state) => {
      state.financeToday.loading = true;
    });
    builder.addCase(fetchGetStatisticsFinanceToday.fulfilled, (state, action) => {
      state.financeToday.loading = false;
      state.financeToday.data = action.payload;
      state.financeToday.error = '';
    });
    builder.addCase(fetchGetStatisticsFinanceToday.rejected, (state, action) => {
      state.financeToday.loading = false;
      state.financeToday.data = [];
      state.financeToday.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
