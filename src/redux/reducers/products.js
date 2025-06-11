import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  products: {},
  productById: {},
};

export const fetchAllShops = createAsyncThunk('/shop/list', async ({ page }) => {
  const res = await RepositoryRemote.products.requestGetAllShop(page);
  return res.data;
});

export const fetchShopByBoardId = createAsyncThunk('/shop/product/id', async ({ boardId, page }) => {
  const res = await RepositoryRemote.products.requestGetInfoBoardById(boardId, page);
  return res.data;
});

export const fetchGetProductsBuyShop = createAsyncThunk('/shop/product', async ({ shopId, page }) => {
  const res = await RepositoryRemote.products.requestGetAllProducts(shopId, page);
  return res.data;
});
export const fetchGetProductsById = createAsyncThunk('/shop/product-by-id', async ({ shopId, productId }) => {
  const res = await RepositoryRemote.products.requestGetProductById(shopId, productId);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'products',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAllShops.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllShops.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = '';
    });
    builder.addCase(fetchAllShops.rejected, (state, action) => {
      state.loading = false;
      state.products = {};
      state.error = action?.error?.message || 'Error while processsing.';
    });

    builder.addCase(fetchShopByBoardId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchShopByBoardId.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = '';
    });
    builder.addCase(fetchShopByBoardId.rejected, (state, action) => {
      state.loading = false;
      state.products = {};
      state.error = action?.error?.message || 'Error while processsing.';
    });

    builder.addCase(fetchGetProductsBuyShop.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetProductsBuyShop.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
      state.error = '';
    });
    builder.addCase(fetchGetProductsBuyShop.rejected, (state, action) => {
      state.loading = false;
      state.products = {};
      state.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetProductsById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetProductsById.fulfilled, (state, action) => {
      state.loading = false;
      state.productById = action.payload;
      state.error = '';
    });
    builder.addCase(fetchGetProductsById.rejected, (state, action) => {
      state.loading = false;
      state.productById = {};
      state.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
