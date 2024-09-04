import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  PODVariant: {
    loading: false,
    error: "",
    data: [],
  },
};

export const fetchGetFlashShipPODVariant = createAsyncThunk(
  "/flashShip/POD-variant/",
  async () => {
    const res =
      await RepositoryRemote.flashShip.requestGetFlashShipPODVariant();
    return res?.data;
  }
);

const slicer = createSlice({
  name: "flashShip",
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchGetFlashShipPODVariant.pending, (state) => {
      state.PODVariant.loading = true;
    });
    builder.addCase(fetchGetFlashShipPODVariant.fulfilled, (state, action) => {
      state.PODVariant.loading = false;
      state.PODVariant.data = action.payload;
      state.PODVariant.error = "";
    });
    builder.addCase(fetchGetFlashShipPODVariant.rejected, (state, action) => {
      state.PODVariant.loading = false;
      state.PODVariant.data = [];
      state.PODVariant.error =
        action?.error?.message || "Error while processing.";
    });
  },
});

export const {} = slicer.actions;

export default slicer.reducer;
