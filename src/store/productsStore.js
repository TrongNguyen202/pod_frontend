import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';

export const useProductsStore = create((set, get) => ({
  products: [],
  productById: {},
  infoTable: {},
  newProduct: {},
  loading: false,
  loadingImage: false,
  getAllProducts: async (id, page_number, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestGetAllProducts(id, page_number);
      if (response.data.message === 'seller is inactivated') {
        alerts.error('seller is inactivated');
        return;
      }
      set({ products: [...get().products, ...response?.data.data?.products] });
      set({ infoTable: response?.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  clearProducts: () => {
    set({ products: [] });
  },
  getProductsById: async (shopId, productId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestGetProductById(shopId, productId);
      set({ productById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  changeStatusProduct: async (id, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      await RepositoryRemote.products.requestChangeStatusProduct(id, params);
      onSuccess();
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  createProductList: async (shopId, params, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestCreateProductList(shopId, params);
      onSuccess(response.data);
    } catch (error) {
      if (error?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category');
      } else {
        onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
      }
    }
    set({ loading: false });
  },
  editProduct: async (shopId, productId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestEditProduct(shopId, productId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi sửa sản phẩm!');
    }
    set({ loading: false });
  },
  createOneProduct: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestCreateOneProduct(shopId, body);
      set({ newProduct: response.data.data });
      onSuccess(response.data);
    } catch (error) {
      if (error?.response?.data?.message === 'required qualification is missing') {
        onFail('Wrong category, please choose another category');
      } else {
        onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm!');
      }
    }
    set({ loading: false });
  },
  createOneProductDraff: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestCreateOneProductDraff(shopId, body);
      set({ newProduct: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra khi tạo sản phẩm nháp!');
    }
    set({ loading: false });
  },
  resetProductById: () => {
    set({ productById: {}, infoTable: {} });
  },

  changeProductImageToWhite: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingImage: true });
      const response = await RepositoryRemote.products.requestChangeProductImageToWhite(body);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.error || 'Có lỗi xảy ra khi thay nền ảnh!');
    }
    set({ loadingImage: false });
  },

  removeProduct: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.products.requestRemoveProduct(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra khi thay nền ảnh!');
    }
    set({ loading: false });
  },
}));
