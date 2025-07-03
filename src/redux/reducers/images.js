import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  imageService: {
    loading: false,
    error: '',
    data: [],
  },
};

export const requestUploadImages = createAsyncThunk(
  '/images/upload',
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await RepositoryRemote.images.requestPostImages(data);
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const slicer = createSlice({
  name: 'images',
  initialState,
  extraReducers: (builder) => {
    // Upload anh
    builder.addCase(requestUploadImages.pending, (state) => {
      state.imageService.loading = true;
    });
    builder.addCase(requestUploadImages.fulfilled, (state, action) => {
      state.imageService.loading = false;
      state.imageService.data = action.payload.bodyData;
      state.imageService.error = '';
    });
    builder.addCase(requestUploadImages.rejected, (state, action) => {
      state.imageService.loading = false;
      state.imageService.data = [];
      state.imageService.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllBoards, resetDataListBoard } = slicer.actions;

export default slicer.reducer;
