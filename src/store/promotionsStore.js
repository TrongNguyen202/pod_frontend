import { create } from 'zustand';
import { RepositoryRemote } from '../services';
import { alerts } from '../utils/alerts';
import { promotions } from '../services/promotions';

export const usePromotionsStore = create((set, get) => ({
  promotions: [],
  loading: false,
  loadingPromotion: false,
  getPromotions: async (shopId, pageNumber, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const { data } = await RepositoryRemote.promotions.requestGetPromotions(shopId, pageNumber);
      if (data.success === false) {
        alerts.error(data.message);
        return;
      }

      set({ promotions: [...get().promotions, data.promotion_list] });

      onSuccess(promotions);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  getPromotionDetail: async (shopId, productId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingPromotion: true });
      const response = await RepositoryRemote.promotions.requestGetPromotionDetail(shopId, productId);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingPromotion: false });
  },
  createPromotion: async (shopId, promotionData, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestCreatePromotion(shopId, promotionData);
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
  listProductNoDiscount: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestListProductNoDiscount(shopId);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo promotion!');
    }
    set({ loading: false });
  },

  listProductNoFlashDeal: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestListProductNoFlashDeal(shopId);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo promotion!');
    }
    set({ loading: false });
  },

  createFlashDeal: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestCreateFlashDeal(shopId, data);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo promotion!');
    }
    set({ loading: false });
  },

  InactivePromotion: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestInactivePromotion(shopId, data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo promotion!');
    }
    set({ loading: false });
  },

  PromotionDetail: async (shopId, promotionId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.promotions.requestPromotionDetail(shopId, promotionId);

      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.message || 'Có lỗi xảy ra lấy dữ liệu promotion!');
    }
    set({ loading: false });
  },
}));
