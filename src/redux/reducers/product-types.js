import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  productTypes: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetAllProductTypes = createAsyncThunk('/get/all/product-type', async ({ query }) => {
  const res = await RepositoryRemote.productTypes.requestGetAllProductTypes(query);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'productTypes',
  initialState,
  reducers: {
    setQueryAllProductTypes: (state, action) => {
      state.productTypes.query = action.payload;
    },
    resetDataListProductTypes: (state, action) => {
      state.productTypes.data = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetAllProductTypes.pending, (state) => {
      state.productTypes.loading = true;
    });
    builder.addCase(fetchGetAllProductTypes.fulfilled, (state, action) => {
      state.productTypes.loading = false;
      state.productTypes.data = action.payload;
      state.productTypes.error = '';
    });
    builder.addCase(fetchGetAllProductTypes.rejected, (state, action) => {
      state.productTypes.loading = false;
      state.productTypes.data = [];
      state.productTypes.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllProductTypes, resetDataListProductTypes } = slicer.actions;

export default slicer.reducer;
