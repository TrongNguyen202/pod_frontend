import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RepositoryRemote } from 'src/services';

const initialState = {
  loading: false,
  error: '',
  shopByUser: {
    loading: false,
    error: '',
    data: [],
  },
  userInfo: {
    loading: false,
    error: '',
    data: [],
  },
  designerIds: {
    loading: false,
    error: '',
    data: [],
  },
};

export const fetchUserByEmail = createAsyncThunk('/user/post/user-detail', async (email) => {
  const res = await RepositoryRemote.users.requestGetUserInfoByEmail(email);
  return res.data.data;
});

export const updateUserProfile = createAsyncThunk('/user/update/profile', async (profileData) => {
  const res = await RepositoryRemote.users.requestUpdateUserProfile(profileData);
  return res.data.data;
});

export const fetchGetShopByUser = createAsyncThunk('/user/shop-by-user', async () => {
  const res = await RepositoryRemote.users.requestGetShopByUser();
  return res.data.data;
});

export const fetchGetDesginerIds = createAsyncThunk('/get/designer/ids', async () => {
  const res = await RepositoryRemote.users.requestGetDesignerIds();
  return res.data.data;
});

const slicer = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetDataDesginerIds(state) {
      state.designerIds = {
        loading: false,
        error: '',
        data: [],
      };
    },
    // Thêm reducer để update user info locally
    updateUserInfoLocal(state, action) {
      if (state.userInfo.data) {
        // Merge chỉ những field được trả về từ backend với data hiện tại
        state.userInfo.data = {
          ...state.userInfo.data,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetShopByUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetShopByUser.fulfilled, (state, action) => {
      state.loading = false;
      state.shopByUser = action.payload;
      state.error = '';
    });
    builder.addCase(fetchGetShopByUser.rejected, (state, action) => {
      state.loading = false;
      state.shopByUser = {};
      state.error = action?.error?.message || 'Error while processing.';
    });

    builder.addCase(fetchUserByEmail.pending, (state) => {
      state.loading = true;
      state.userInfo.loading = true;
    });
    builder.addCase(fetchUserByEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.userInfo = {
        loading: false,
        error: '',
        data: action.payload,
      };
      state.error = '';
    });
    builder.addCase(fetchUserByEmail.rejected, (state, action) => {
      state.loading = false;
      state.userInfo = {
        loading: false,
        error: action?.error?.message || 'Error while processing.',
        data: [],
      };
    });

    // Thêm cases cho updateUserProfile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.userInfo.loading = true;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.userInfo.loading = false;
      // Merge response với data hiện tại
      if (state.userInfo.data) {
        state.userInfo.data = {
          ...state.userInfo.data,
          ...action.payload,
          // Map các field từ backend response sang format hiện tại
          bankName: action.payload.bank_name || state.userInfo.data.bankName,
        };
      }
      state.userInfo.error = '';
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.userInfo.loading = false;
      state.userInfo.error = action?.error?.message || 'Error updating profile.';
    });

    builder.addCase(fetchGetDesginerIds.pending, (state) => {
      state.loading = true;
      state.designerIds.loading = true;
    });
    builder.addCase(fetchGetDesginerIds.fulfilled, (state, action) => {
      state.loading = false;
      state.designerIds = {
        loading: false,
        error: '',
        data: action.payload,
      };
      state.error = '';
    });
    builder.addCase(fetchGetDesginerIds.rejected, (state, action) => {
      state.loading = false;
      state.designerIds = {
        loading: false,
        error: action?.error?.message || 'Error while processing.',
        data: [],
      };
    });
  },
});

export const { resetDataDesginerIds, updateUserInfoLocal } = slicer.actions;

export default slicer.reducer;
