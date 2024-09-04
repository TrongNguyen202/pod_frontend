import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  sheets: {
    loading: false,
    error: "",
    data: [],
  },
};

export const fetchAllSheetInfo = createAsyncThunk(
  "/google/infor",
  async (range) => {
    const res = await RepositoryRemote.google.requestGetAlSheetInfo(range);
    return res?.data?.data;
  }
);

const slicer = createSlice({
  name: "google",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAllSheetInfo.pending, (state) => {
      state.sheets.loading = true;
    });
    builder.addCase(fetchAllSheetInfo.fulfilled, (state, action) => {
      state.sheets.loading = false;
      state.sheets.data = action.payload;
      state.sheets.error = "";
    });
    builder.addCase(fetchAllSheetInfo.rejected, (state, action) => {
      state.sheets.loading = false;
      state.sheets.data = [];
      state.sheets.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
