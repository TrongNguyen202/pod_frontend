import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  warehouses: {
    loading: false,
    error: "",
    data: [],
  },
};

export const fetchWarehouseByShop = createAsyncThunk(
  "/warehouses/by-shop",
  async (shopId) => {
    const res = await RepositoryRemote.warehouses.requestGetWarehousesByShopId(
      shopId
    );
    return res?.data;
  }
);

const slicer = createSlice({
  name: "warehouses",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchWarehouseByShop.pending, (state) => {
      state.warehouses.loading = true;
    });
    builder.addCase(fetchWarehouseByShop.fulfilled, (state, action) => {
      state.warehouses.loading = false;
      state.warehouses.data = action.payload;
      state.warehouses.error = "";
    });
    builder.addCase(fetchWarehouseByShop.rejected, (state, action) => {
      state.warehouses.loading = false;
      state.warehouses.data = [];
      state.warehouses.error =
        action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
