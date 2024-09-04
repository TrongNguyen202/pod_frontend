import { create } from 'zustand';
import { RepositoryRemote } from '../services';
// import { removeToken } from '../utils/auth';

export const useAuthStore = create((set) => ({
  tokenInfo: {},
  profile: {},
  loading: false,
  login: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestLogin(form);
      set({ tokenInfo: response.data.access });
      onSuccess(response.data.access);
    } catch (error) {
      onFail(error.response.data.msg || 'Tài khoản hoặc mật khẩu không đúng!');
    }
    set({ loading: false });
  },
  register: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestRegister(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  checkExists: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestCheckExits(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  resetPassword: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestResetPassword(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestSendOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  sendEmailOtp: async (form, onSuccess, onFail) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestSendMailOtp(form);
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  getProfileInfo: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.auth.requestGetProfileInfor();
      set({ profile: response.data });
      onSuccess(response);
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
  logOut: async (onSuccess, onFail = () => {}) => {
    try {
      // removeToken();
      // localStorage.removeItem("profile")
      // localStorage.removeItem("badges")
      localStorage.removeItem('user');
      localStorage.removeItem('flash-ship-tk');
      localStorage.removeItem('flash-ship-tk-expiration');
      set({ tokenInfo: {} });
      onSuccess();
    } catch (error) {
      onFail(error);
    }
    set({ loading: false });
  },
}));
