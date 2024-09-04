import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const slicer = createSlice({
  name: "main",
  initialState,
  reducers: {
    setFullScreenLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFullScreenLoading } = slicer.actions;

export default slicer.reducer;
