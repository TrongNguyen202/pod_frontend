import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useFlashShipStores = create((set) => ({
  loading: false,
  getFlashShipPODVariant: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.flashShip.requestGetFlashShipPODVariant();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  LoginFlashShip: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.requestLoginFlashShip(body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  createOrderFlashShip: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.requestCreateOrderFlashShip(body);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  detailOrderFlashShip: async (orderId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.requestDetailOrderFlashShip(orderId);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  cancelOrderFlashShip: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.flashShip.requestCancelOrderFlashShip(body);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getCkfVariant: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.flashShip.requestGetCkfVariant();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  }
}));
