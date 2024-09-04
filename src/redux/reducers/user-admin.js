import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const { RepositoryRemote } = require("src/services");

const initialState = {
  loading: false,
  users: {},
  groupUser: 1,
  groupCustoms: [],
  error: "",
};

export const fetchGetListUser = createAsyncThunk(
  "/user-admin/users",
  async (groupId) => {
    const res = await RepositoryRemote.users.requestGetUserShopAll(groupId);
    return res.data;
  }
);

export const fetchGetGroupCustom = createAsyncThunk(
  "/user-admin/group-customs",
  async () => {
    const res = await RepositoryRemote.users.requestGetGroupUser();
    return res.data;
  }
);

const slicer = createSlice({
  name: "user-admin",
  initialState,
  reducers: {
    setGroupUser: (state, action) => {
      state.groupUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch list users
    builder.addCase(fetchGetListUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetListUser.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetListUser.rejected, (state, action) => {
      state.loading = false;
      state.users = {};
      state.error = action?.error?.message || "Error while processing.";
    });

    // Fetch group custom
    builder.addCase(fetchGetGroupCustom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetGroupCustom.fulfilled, (state, action) => {
      state.loading = false;
      state.groupCustoms = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetGroupCustom.rejected, (state, action) => {
      state.loading = false;
      state.groupCustoms = [];
      state.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const { setGroupUser } = slicer.actions;

export default slicer.reducer;
