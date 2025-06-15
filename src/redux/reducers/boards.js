import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  boardService: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetBoardsByUserId = createAsyncThunk('/get/board/user', async ({ userId, query }) => {
  const res = await RepositoryRemote.boards.requestGetBoardsByUserId(userId, query);
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setQueryAllBoards: (state, action) => {
      state.boards.query = action.payload;
    },
    resetDataListBoard: (state, action) => {
      state.boards.data = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetBoardsByUserId.pending, (state) => {
      state.boardService.loading = true;
    });
    builder.addCase(fetchGetBoardsByUserId.fulfilled, (state, action) => {
      state.boardService.loading = false;
      state.boardService.data = action.payload.bodyData;
      state.boardService.error = '';
    });
    builder.addCase(fetchGetBoardsByUserId.rejected, (state, action) => {
      state.boardService.loading = false;
      state.boardService.data = [];
      state.boardService.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllBoards, resetDataListBoard } = slicer.actions;

export default slicer.reducer;
