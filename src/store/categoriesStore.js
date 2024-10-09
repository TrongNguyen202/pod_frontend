import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useCategoriesStore = create((set) => ({
  categories: {},
  categoriesIsLeaf: [],
  categoriesIsLeafType2: [],
  categoriesById: {},
  infoTable: {},
  attributes: [],
  loading: false,
  loadingById: false,
  attributeLoading: false,
  getAllCategories: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.requestGetAllCategories();
      set({ categories: response.data.data.data });
      set({ infoTable: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getAllCategoriesIsLeaf: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.requestGetAllCategoriesIsLeaf();
      set({ categoriesIsLeaf: response.data.data.categories });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getAllCategoriesIsLeafType2: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.requestAllCategoriesIsLeafType2(shopId);
      set({ categoriesIsLeafType2: response.data.data });
      set({ infoTable: response.data.category_list });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getCategoriesById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingById: true });
      const response = await RepositoryRemote.categories.requestGetCategoriesById(id);
      set({ categoriesById: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra khi lấy dữ liệu category!');
    }
    set({ loadingById: false });
  },
  getAttributeByCategory: async (shopId, categoryId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ attributeLoading: true });
      const response = await RepositoryRemote.categories.requestGetAttributeByCategory(shopId, categoryId);
      set({ attributes: response.data.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi khi lấy thuộc tính sản phẩm');
    }
    set({ attributeLoading: false });
  },
  resetCategoryData: () => {
    set({ categories: {} });
    set({ categoriesIsLeaf: [] });
    set({ categoriesIsLeafType2: [] });
    set({ categoriesById: {} });
    set({ infoTable: {} });
    set({ attributes: [] });
  },
  recommendCategory: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.categories.requestRecommendCategory(shopId, data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi khi gợi ý danh mục');
    }
    set({ loading: false });
  },
}));
