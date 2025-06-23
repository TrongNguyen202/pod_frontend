import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  templateInfo: {
    loading: false,
    error: '',
    data: [],
  },
  templatePost: {
    loading: false,
    error: '',
    data: [],
  },
  templateDelete: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchAllTemplatesByBoardId = createAsyncThunk('/get/templates/boardId', async ({ boardId, query }) => {
  const res = await RepositoryRemote.templates.requestGetTemplatesByBoardId(boardId, query);
  return res?.data?.data;
});

export const postTemplate = createAsyncThunk('/post/templates/boardId', async ({ data }) => {
  const res = await RepositoryRemote.templates.requestPostTemplate({ data });
  return res?.data?.data;
});

export const fetchDeleteTemplateById = createAsyncThunk('/delete/templates/templateId', async ({ templateId }) => {
  const res = await RepositoryRemote.templates.requestDeleteTemplateById({ templateId });
  return res?.data?.data;
});

const slicer = createSlice({
  name: 'templates',
  initialState,
  extraReducers: (builder) => {
    // Lay thong tin cac template tu boardId
    builder.addCase(fetchAllTemplatesByBoardId.pending, (state) => {
      state.templateInfo.loading = true;
    });
    builder.addCase(fetchAllTemplatesByBoardId.fulfilled, (state, action) => {
      state.templateInfo.loading = false;
      state.templateInfo.data = action.payload;
      state.templateInfo.error = '';
    });
    builder.addCase(fetchAllTemplatesByBoardId.rejected, (state, action) => {
      state.templateInfo.loading = false;
      state.templateInfo.data = [];
      state.templateInfo.error = action?.error?.message || 'Error while processing.';
    });

    // Tao moi template
    builder.addCase(postTemplate.pending, (state) => {
      state.templatePost.loading = true;
    });
    builder.addCase(postTemplate.fulfilled, (state, action) => {
      state.templatePost.loading = false;
      state.templatePost.data = action.payload.bodyData;
      state.templatePost.error = '';
    });
    builder.addCase(postTemplate.rejected, (state, action) => {
      state.templatePost.loading = false;
      state.templatePost.data = [];
      state.templatePost.error = action?.error?.message || 'Error while processing.';
    });

    // Xoa template
    builder.addCase(fetchDeleteTemplateById.pending, (state) => {
      state.templateDelete.loading = true;
    });
    builder.addCase(fetchDeleteTemplateById.fulfilled, (state, action) => {
      state.templateDelete.loading = false;
      state.templateDelete.data = action.payload.bodyData;
      state.templateDelete.error = '';
    });
    builder.addCase(fetchDeleteTemplateById.rejected, (state, action) => {
      state.templateDelete.loading = false;
      state.templateDelete.data = [];
      state.templateDelete.error = action?.error?.message || 'Error while processing.';
    });
  },
});

export const { setQueryAllTemplates, resetDataListTemplates } = slicer.actions;

export default slicer.reducer;
