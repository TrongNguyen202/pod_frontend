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
  transaction: {
    loading: false,
    error: '',
    dataTopup: [],
    dataStatistics: [],
  },
  excelTransaction:{
    loading: false,
    error: '',
    data: [],
  }
};

export const fetchGetStatisticsOrder = createAsyncThunk('/statistics/order', async ({ query }) => {
  const res = await RepositoryRemote.statistics.requestGetStatisticOrder(query);
  return res.data.data;
});

export const fetchGetStatisticsTransaction = createAsyncThunk('/statistics/transaction', async ({ query }) => {
  const res = await RepositoryRemote.statistics.requestGetStatisticTransaction(query);
  return res.data.data;
});

export const fetchExportExcelStatisticTransaction = createAsyncThunk(
  '/statistics/export-excel-transaction',
  async ({ query }) => {
    const res = await RepositoryRemote.statistics.requestExportExcelStatisticTransaction(query);
    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'statistics_transaction.xlsx'); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return res.data; // Return the data if needed for further processing
  }
);

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
    builder.addCase(fetchGetStatisticsTransaction.pending, (state) => {
      state.transaction.loading = true;
    });
    builder.addCase(fetchGetStatisticsTransaction.fulfilled, (state, action) => {
      state.transaction.loading = false;
      state.transaction.dataTopup = action.payload.topups;
      state.transaction.dataStatistics = action.payload.statistics;
      state.transaction.error = '';
    });
    builder.addCase(fetchGetStatisticsTransaction.rejected, (state, action) => {
      state.transaction.loading = false;
      state.transaction.data = [];
      state.transaction.error = action?.error?.message || 'Error while processing.';
    });
    builder.addCase(fetchExportExcelStatisticTransaction.pending, (state) => {
      state.excelTransaction.loading = true;
    });
    builder.addCase(fetchExportExcelStatisticTransaction.fulfilled, (state, action) => {
      state.excelTransaction.loading = false;
      state.excelTransaction.error = '';
      // The file download is handled in the thunk, no need to store it in the state
    });
    builder.addCase(fetchExportExcelStatisticTransaction.rejected, (state, action) => {
      state.excelTransaction.loading = false;
      state.excelTransaction.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
