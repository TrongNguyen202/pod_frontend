import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  PODKcfVariant: {
    loading: false,
    error: "",
    data: [],
  },
};


export const fetchGetCkfVariant = createAsyncThunk(
  "/Ckf/POD-variant/",
  async () => {
    const res = await RepositoryRemote.flashShip.requestGetCkfVariant();
    return res?.data;
    }
)

const slicer = createSlice({
  name: "ckf",
  initialState,

  extraReducers: (builder) => {

    // Xử lý fetchGetCkfVariant
    builder.addCase(fetchGetCkfVariant.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetCkfVariant.fulfilled, (state, action) => {
        state.PODKcfVariant.loading = false;
        state.PODKcfVariant.data = action.payload; // Storing data in the correct property
        state.PODKcfVariant.error = "";
      });
      
    builder.addCase(fetchGetCkfVariant.rejected, (state, action) => {
      state.loading = false;
      state.PODKcfVariant.data = [];
      state.PODKcfVariant.error =
        action?.error?.message || "Error while processing CKF Variant.";
    });
  },
});


export const {} = slicer.actions;

export default slicer.reducer;
