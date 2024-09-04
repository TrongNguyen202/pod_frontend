import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  shopByUser: {},
};

export const fetchGetShopByUser = createAsyncThunk(
  "/user/shop-by-user",
  async () => {
    const res = await RepositoryRemote.users.requestGetShopByUser();
    return res.data.data;
  }
);

const slicer = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGetShopByUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetShopByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.shopByUser = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetShopByUser.rejected, (state, action) => {
      state.loading = false;
      state.shopByUser = {};
      state.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
