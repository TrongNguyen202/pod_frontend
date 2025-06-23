import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  orderService: {
    loading: false,
    error: '',
    data: [],
  },
  orderPostSignle: {
    loading: false,
    error: '',
    data: [],
  },
  orderPostMulti: {
    loading: false,
    error: '',
    data: [],
  },
  orderPutService: {
    loading: false,
    error: '',
    data: [],
  },
  orderById: {
    loading: false,
    error: '',
    data: [],
  },
  changeStatusService: {
    loading: false,
    error: '',
    data: [],
  },
  deleteService: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetOrdersByBoardId = createAsyncThunk('/get/order/boardId', async ({ query }) => {
  const res = await RepositoryRemote.orders.requestGetOrdersByBoardId(query);
  return res?.data?.data;
});

export const postOrder = createAsyncThunk('/post/order', async ({ data }) => {
  const res = await RepositoryRemote.orders.requestPostOrder(data);
  return res.data;
});

export const postOrders = createAsyncThunk('/post/orders-many', async ({ data }) => {
  const res = await RepositoryRemote.orders.requestPostOrders(data);
  return res.data;
});

export const putOrder = createAsyncThunk('/put/order', async ({ orderId, data }) => {
  const res = await RepositoryRemote.orders.requestPutOrder(orderId, data);
  return res.data;
});

export const fetchtGetOrder = createAsyncThunk('/get/order/id', async ({ orderId }) => {
  const res = await RepositoryRemote.orders.requestGetOrderById(orderId);
  return res.data;
});

export const changeStatusOrders = createAsyncThunk('/put/order/change/status', async ({ data }) => {
  const res = await RepositoryRemote.orders.requestChangeStatusOrders(data);
  return res.data;
});

export const requestDeleteOrders = createAsyncThunk('/delete/orders', async ({ ids }) => {
  const res = await RepositoryRemote.orders.requestApiDeleteOrders({ ids });
  return res.data;
});

export const fetchAssignOrdersForDesigner = createAsyncThunk('/asign/orders', async ({ data }) => {
  const res = await RepositoryRemote.orders.requestAssignOrdersForDesigner(data);
});

const slicer = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setQueryAllOrders: (state, action) => {
      state.boards.query = action.payload;
    },
    resetDataListOrder(state) {
      state.orderService = {
        loading: false,
        error: '',
        data: [],
      };
    },
  },
  extraReducers: (builder) => {
    // Lay thong tin cac order tu boardId
    builder.addCase(fetchGetOrdersByBoardId.pending, (state) => {
      state.orderService.loading = true;
    });
    builder.addCase(fetchGetOrdersByBoardId.fulfilled, (state, action) => {
      state.orderService.loading = false;
      state.orderService.data = action.payload.bodyData;
      state.orderService.error = '';
    });
    builder.addCase(fetchGetOrdersByBoardId.rejected, (state, action) => {
      state.orderService.loading = false;
      state.orderService.data = [];
      state.orderService.error = action?.error?.message || 'Error while processing.';
    });

    // Tao 1 order
    builder.addCase(postOrder.pending, (state) => {
      state.orderPostSignle.loading = true;
    });
    builder.addCase(postOrder.fulfilled, (state, action) => {
      state.orderPostSignle.loading = false;
      state.orderPostSignle.data = action.payload.bodyData;
      state.orderPostSignle.error = '';
    });
    builder.addCase(postOrder.rejected, (state, action) => {
      state.orderPostSignle.loading = false;
      state.orderPostSignle.data = [];
      state.orderPostSignle.error = action?.error?.message || 'Error while processing.';
    });

    // Tao nhieu orders
    builder.addCase(postOrders.pending, (state) => {
      state.orderPostMulti.loading = true;
    });
    builder.addCase(postOrders.fulfilled, (state, action) => {
      state.orderPostMulti.loading = false;
      state.orderPostMulti.data = action.payload.bodyData;
      state.orderPostMulti.error = '';
    });
    builder.addCase(postOrders.rejected, (state, action) => {
      state.orderPostMulti.loading = false;
      state.orderPostMulti.data = [];
      state.orderPostMulti.error = action?.error?.message || 'Error while processing.';
    });

    // Cap nhat thong tin order tu orderId
    builder.addCase(putOrder.pending, (state) => {
      state.orderPutService.loading = true;
    });
    builder.addCase(putOrder.fulfilled, (state, action) => {
      state.orderPutService.loading = false;
      state.orderPutService.data = action.payload.bodyData;
      state.orderPutService.error = '';
    });
    builder.addCase(putOrder.rejected, (state, action) => {
      state.orderPutService.loading = false;
      state.orderPutService.data = [];
      state.orderPutService.error = action?.error?.message || 'Error while processing.';
    });

    // Lay thong tin cac order tu orderId
    builder.addCase(fetchtGetOrder.pending, (state) => {
      state.orderById.loading = true;
    });
    builder.addCase(fetchtGetOrder.fulfilled, (state, action) => {
      state.orderById.loading = false;
      state.orderById.data = action.payload.bodyData;
      state.orderById.error = '';
    });
    builder.addCase(fetchtGetOrder.rejected, (state, action) => {
      state.orderById.loading = false;
      state.orderById.data = [];
      state.orderById.error = action?.error?.message || 'Error while processing.';
    });

    // Change status multi
    builder.addCase(changeStatusOrders.pending, (state) => {
      state.changeStatusService.loading = true;
    });
    builder.addCase(changeStatusOrders.fulfilled, (state, action) => {
      state.changeStatusService.loading = false;
      state.changeStatusService.data = action.payload.bodyData;
      state.changeStatusService.error = '';
    });
    builder.addCase(changeStatusOrders.rejected, (state, action) => {
      state.changeStatusService.loading = false;
      state.changeStatusService.data = [];
      state.changeStatusService.error = action?.error?.message || 'Error while processing.';
    });

    // Delete orders
    builder.addCase(requestDeleteOrders.pending, (state) => {
      state.deleteService.loading = true;
    });
    builder.addCase(requestDeleteOrders.fulfilled, (state, action) => {
      state.deleteService.loading = false;
      state.deleteService.data = action.payload.bodyData;
      state.deleteService.error = '';
    });
    builder.addCase(requestDeleteOrders.rejected, (state, action) => {
      state.deleteService.loading = false;
      state.deleteService.data = [];
      state.deleteService.error = action?.error?.message || 'Error while processing.';
    });

    // Assign order for designer
    builder.addCase(fetchAssignOrdersForDesigner.pending, (state) => {
      state.deleteService.loading = true;
    });
    builder.addCase(fetchAssignOrdersForDesigner.fulfilled, (state, action) => {
      state.deleteService.loading = false;
      state.deleteService.data = action.payload;
      state.deleteService.error = '';
    });
    builder.addCase(fetchAssignOrdersForDesigner.rejected, (state, action) => {
      state.deleteService.loading = false;
      state.deleteService.data = [];
      state.deleteService.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllOrders, resetDataListOrder } = slicer.actions;

export default slicer.reducer;
