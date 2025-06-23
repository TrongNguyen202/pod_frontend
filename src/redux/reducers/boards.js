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
  boardInfo: {
    loading: false,
    error: '',
    data: [],
  },
  boardUpdate: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchGetBoardsByUserId = createAsyncThunk('/get/board/user', async ({ userId, query }) => {
  const res = await RepositoryRemote.boards.requestGetBoardsByUserId(userId, query);
  return res?.data?.data;
});

export const fetchBoardInfoByBoardId = createAsyncThunk('/board/info/id', async ({ boardId }) => {
  const res = await RepositoryRemote.boards.requestGetBoardInfoById(boardId);
  return res.data;
});

export const putBoardInfoByBoardId = createAsyncThunk('/put/board/id', async ({ boardId, data }) => {
  const res = await RepositoryRemote.boards.updateBoardInfoById(boardId, data);
  return res.data;
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
    },
    resetBoardInfo(state) {
      state.boardInfo = {
        loading: false,
        error: '',
        data: {},
      };
    },
  },
  extraReducers: (builder) => {
    // Lay thong tin cac board tu userId
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

    // Lay thong tin chi tiet board tu boardId
    builder.addCase(fetchBoardInfoByBoardId.pending, (state) => {
      state.boardInfo.loading = true;
    });
    builder.addCase(fetchBoardInfoByBoardId.fulfilled, (state, action) => {
      state.boardInfo.loading = false;
      state.boardInfo.data = action.payload.data;
      state.boardInfo.error = '';
    });
    builder.addCase(fetchBoardInfoByBoardId.rejected, (state, action) => {
      state.boardInfo.loading = false;
      state.boardInfo.data = [];
      state.boardInfo.error = action?.error?.message || 'Error while processing.';
    });

    // Cap nhat thong tin board tu boardId
    builder.addCase(putBoardInfoByBoardId.pending, (state) => {
      state.boardUpdate.loading = true;
    });
    builder.addCase(putBoardInfoByBoardId.fulfilled, (state, action) => {
      state.boardUpdate.loading = false;
      state.boardUpdate.data = action.payload.data;
      state.boardUpdate.error = '';
    });
    builder.addCase(putBoardInfoByBoardId.rejected, (state, action) => {
      state.boardUpdate.loading = false;
      state.boardUpdate.data = [];
      state.boardUpdate.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllBoards, resetDataListBoard, resetBoardInfo } = slicer.actions;

export default slicer.reducer;
