import { isUndefined } from 'lodash';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RepositoryRemote } from '../../services';
import { alerts } from '../../utils/alerts';

const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  loading: true,
  isAuthenticated: false,
  isGuest: false,
  account: null,
  isInitialized: false,
  reAuthenticate: 0,
  isLogout: false,
  error: '',
};

const slicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticate: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    setReAuthenticate: (state) => {
      state.reAuthenticate = !isUndefined(state.reAuthenticate) ? state.reAuthenticate + 1 : 0;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setStatusLogout: (state, action) => {
      state.isLogout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload;
      state.error = '';
    });
    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.data = [];
      state.error = action?.error?.message || 'Error while processing.';
      // alerts.error('Lỗi đăng nhập');
    });
  },
});

export const { setAuthenticate, setInitialized, setReAuthenticate, setAccount, setStatusLogout } = slicer.actions;

export default slicer.reducer;

export const fetchUserInfo = createAsyncThunk('/user/get-all', async () => {
  const response = await RepositoryRemote.auth.requestGetProfileInfor();
  if(response){
    localStorage.setItem("usernamecurrent", response.data.username)
  }
  return response?.data;
});
