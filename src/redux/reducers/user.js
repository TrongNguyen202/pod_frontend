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
  designerTax: {
    loading: false,
    error: '',
    data: [],
  },
  usersList: {
    loading: false,
    error: '',
    data: [],
    total: 0,
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

export const fetchUpdateTaxForDesigner = createAsyncThunk('/put/designer/tax', async (data) => {
  const res = await RepositoryRemote.users.requestSetTaxForDesigner(data);
  return res.data.data;
});

export const createUserAccount = createAsyncThunk('/user/create', async (userData) => {
  const res = await RepositoryRemote.users.requestCreateUserAccount(userData);
  return res.data;
});

export const fetchUsers = createAsyncThunk('/user/fetch-list', async (filterData) => {
  const res = await RepositoryRemote.users.requestGetUsers(filterData);
  return res.data;
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
    resetUsersList(state) {
      state.usersList = {
        loading: false,
        error: '',
        data: [],
        total: 0,
      };
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

    builder.addCase(fetchUpdateTaxForDesigner.pending, (state) => {
      state.loading = true;
      state.designerTax.loading = true;
    });
    builder.addCase(fetchUpdateTaxForDesigner.fulfilled, (state, action) => {
      state.loading = false;
      state.designerTax = {
        loading: false,
        error: '',
        data: action.payload,
      };
      state.error = '';
    });
    builder.addCase(fetchUpdateTaxForDesigner.rejected, (state, action) => {
      state.loading = false;
      state.designerTax = {
        loading: false,
        error: action?.error?.message || 'Error while processing.',
        data: [],
      };
    });

    // Create user account
    builder.addCase(createUserAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createUserAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.error = '';
    });
    builder.addCase(createUserAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.error?.message || 'Error creating user.';
    });

    // Fetch users list
    builder.addCase(fetchUsers.pending, (state) => {
      state.usersList.loading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.usersList.loading = false;
      state.usersList.data = action.payload.data || [];
      state.usersList.total = action.payload.total || 0;
      state.usersList.error = '';
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.usersList.loading = false;
      state.usersList.error = action?.error?.message || 'Error fetching users.';
    });
  },
});

export const { resetDataDesginerIds, updateUserInfoLocal, resetUsersList } = slicer.actions;

export default slicer.reducer;
