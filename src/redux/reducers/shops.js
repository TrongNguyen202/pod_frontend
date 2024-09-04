import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  shops: [],
  products: {},
};

export const fetchGetListShops = createAsyncThunk("/shop/lists", async () => {
  const res = await RepositoryRemote.stores.requestGetAllStores();
  return res.data;
});

const slicer = createSlice({
  name: "shops",
  initialState,
  extraReducers: (builder) => {
    // Fetch list shops
    builder.addCase(fetchGetListShops.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetListShops.fulfilled, (state, action) => {
      state.loading = false;
      state.shops = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetListShops.rejected, (state, action) => {
      state.loading = false;
      state.shops = [];
      state.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
