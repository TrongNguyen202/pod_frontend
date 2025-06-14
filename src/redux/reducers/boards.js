import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  boardService: {
    loading: false,
    error: '',
    data: [],
  },
  packagesBought: {
    loading: false,
    error: '',
    data: [],
  },
  orders: {
    loading: false,
    query: '',
    error: '',
    data: {},
  },
};

export const fetGetBoardsByUserId = createAsyncThunk('/get/board/user', async ({ userId, query }) => {
  const res = await RepositoryRemote.boards.requestGetBoardsByUserId(userId, query);
  return res?.data?.data;
});

export const fetchGetPackageBought = createAsyncThunk('/orders/package-bought', async () => {
  const res = await RepositoryRemote.orders.requestGetPackageBought();
  return res?.data;
});

export const fetchGetAllOrders = createAsyncThunk('/orders/all', async (query) => {
  const res = await RepositoryRemote.orders.requestGetAllOrders(query);
  return res?.data;
  // return mockData;
});

export const fetchPackageFulfillmentCompleted = createAsyncThunk('/orders/fulfillment-completed', async (shopId) => {
  const res = await RepositoryRemote.orders.requestPackageFulfillmentCompleted(shopId);
  return res?.data;
});

export const fetchPackageFulfillmentCompletedInactive = createAsyncThunk(
  '/orders/fulfillment-completed-inactive',
  async ({ packageId, body }) => {
    const res = await RepositoryRemote.orders.requestPackageFulfillmentCompletedInActive(packageId, body);
    return res?.data;
  },
);

export const fetchGetDesignSku = createAsyncThunk('/orders/design-sku', async () => {
  const res = await RepositoryRemote.orders.requestGetDesignSku();
  return res?.data;
});

export const fetchToShipInfor = createAsyncThunk('/orders/to-ship-infor', async ({ shopId, body }) => {
  const res = await RepositoryRemote.orders.requestGetToShipInfor(shopId, body);
  return res?.data;
});

export const fetchAllOrderByShop = createAsyncThunk('/orders/by-shop', async (shopId) => {
  const res = await RepositoryRemote.orders.requestGetAllOrderByShop(shopId);
  return res?.data;
});

const slicer = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setQueryAllOrders: (state, action) => {
      state.orders.query = action.payload;
    },
    resetDataListOrder: (state, action) => {
      state.orders.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetGetBoardsByUserId.pending, (state) => {
      state.boardService.loading = true;
    });
    builder.addCase(fetGetBoardsByUserId.fulfilled, (state, action) => {
      state.boardService.loading = false;
      state.boardService.data = action.payload.data.body.Data;
      state.boardService.error = '';
    });
    builder.addCase(fetGetBoardsByUserId.rejected, (state, action) => {
      state.boardService.loading = false;
      state.boardService.data = [];
      state.boardService.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetPackageBought.pending, (state) => {
      state.packagesBought.loading = true;
    });
    builder.addCase(fetchGetPackageBought.fulfilled, (state, action) => {
      state.packagesBought.loading = false;
      state.packagesBought.data = action.payload;
      state.packagesBought.error = '';
    });
    builder.addCase(fetchGetPackageBought.rejected, (state, action) => {
      state.packagesBought.loading = false;
      state.packagesBought.data = [];
      state.packagesBought.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetAllOrders.pending, (state) => {
      state.orders.loading = true;
    });
    builder.addCase(fetchGetAllOrders.fulfilled, (state, action) => {
      state.orders.loading = false;
      state.orders.data = action.payload;
      state.orders.error = '';
    });
    builder.addCase(fetchGetAllOrders.rejected, (state, action) => {
      state.orders.loading = false;
      state.orders.data = {};
      state.orders.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchPackageFulfillmentCompleted.pending, (state) => {
      state.packageFulfillmentCompleted.loading = true;
    });
    builder.addCase(fetchPackageFulfillmentCompleted.fulfilled, (state, action) => {
      state.packageFulfillmentCompleted.loading = false;
      state.packageFulfillmentCompleted.data = action.payload;
      state.packageFulfillmentCompleted.error = '';
    });
    builder.addCase(fetchPackageFulfillmentCompleted.rejected, (state, action) => {
      state.packageFulfillmentCompleted.loading = false;
      state.packageFulfillmentCompleted.data = [];
      state.packageFulfillmentCompleted.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchGetDesignSku.pending, (state) => {
      state.designSku.loading = true;
    });
    builder.addCase(fetchGetDesignSku.fulfilled, (state, action) => {
      state.designSku.loading = false;
      state.designSku.data = action.payload;
      state.designSku.initial = true;
      state.designSku.error = '';
    });
    builder.addCase(fetchGetDesignSku.rejected, (state, action) => {
      state.designSku.loading = false;
      state.designSku.data = [];
      state.designSku.error = action?.error?.message || 'Error while processing.';
      state.designSku.initial = true;
    });

    builder.addCase(fetchToShipInfor.pending, (state) => {
      state.toShipInfor.loading = true;
    });
    builder.addCase(fetchToShipInfor.fulfilled, (state, action) => {
      state.toShipInfor.loading = false;
      state.toShipInfor.data = action.payload;
      state.toShipInfor.error = '';
    });
    builder.addCase(fetchToShipInfor.rejected, (state, action) => {
      state.toShipInfor.loading = false;
      state.toShipInfor.data = [];
      state.toShipInfor.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchAllOrderByShop.pending, (state) => {
      state.orderByShop.loading = true;
    });
    builder.addCase(fetchAllOrderByShop.fulfilled, (state, action) => {
      state.orderByShop.loading = false;
      state.orderByShop.data = action.payload;
      state.orderByShop.error = '';
    });
    builder.addCase(fetchAllOrderByShop.rejected, (state, action) => {
      state.orderByShop.loading = false;
      state.orderByShop.data = [];
      state.orderByShop.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllOrders, resetDataListOrder } = slicer.actions;

export default slicer.reducer;
