import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  brands: {},
  loading: false,
};

export const fetchGetAllBrand = createAsyncThunk(
  "/brand/all",
  async (shopId) => {
    const response = await RepositoryRemote.brand.requestGetAllBrand(shopId);
    return response?.data?.data;
  }
);

const slicer = createSlice({
  name: "shopBrand",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchGetAllBrand.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetAllBrand.fulfilled, (state, action) => {
      state.loading = false;
      state.brands = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetAllBrand.rejected, (state, action) => {
      state.loading = false;
      state.brands = {};
      state.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;
export default slicer.reducer;
