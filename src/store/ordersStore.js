import { create } from 'zustand';
import { RepositoryRemote } from '../services';

export const useShopsOrder = create((set) => ({
  orders: [],
  labels: [],
  toShipInfo: [],
  combineList: [],
  shippingServiceInfo: [],
  loading: false,
  loadingGetInfo: false,
  loadingUpload: false,
  loadingFulfillment: false,
  loadingGetLink: false,
  loadingRejectOrder: false,
  cancelTokenSource: null,
  packageBought: [],
  getAllOrders: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetAllOrders(id);
      set({ orders: response.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getLabelsById: async (orderId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetLabelById(orderId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },
  uploadLabelToDriver: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingUpload: true });
      const response = await RepositoryRemote.orders.requestUploadLabelToDriver(data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingUpload: false });
  },
  getToShipInfo: async (shopId, data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingGetInfo: true });
      const response = await RepositoryRemote.orders.requestGetToShipInfor(shopId, data);
      set({ toShipInfo: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingGetInfo: false });
  },

  getAllCombine: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.requestGetAllCombine(shopId);
      set({ combineList: response.data.data.data });
      onSuccess(response.data);
    } catch (error) {
      console.error(error);
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  confirmCombine: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.requestConfirmCombine(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  createLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestCreateLabel(shopId, body);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  shippingService: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestShippingService(shopId, body);
      set({ shippingServiceInfo: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  buyLabel: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestByLabel(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getShippingDoc: async (id, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingFulfillment: true });
      const response = await RepositoryRemote.orders.requestGetShippingDoc(id, body);
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingFulfillment: false });
  },

  getPackageBought: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.requestGetPackageBought();
      set({ packageBought: response.data });
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  pdfLabelSearch: async (packageId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPdfLabelSearch(packageId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  pdfLabelLinkSearch: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingGetLink: true });
      const response = await RepositoryRemote.orders.requestPdfLabelLinkSearch(body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingGetLink: false });
  },

  pdfLabelDownload: async (fileName, onSuccess = () => {}, onFail = () => {}) => {
    try {
      const response = await RepositoryRemote.orders.requestPdfLabelDownload(fileName);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
  },

  getDesignSku: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetDesignSku();
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuSize: async (page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetDesignSkuSize(page);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuByGroup: async (groupId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetDesignSkuGroup(groupId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuByGroupSize: async (groupId, page, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetDesignSkuSize(groupId, page);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  postDesignSku: async (data, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPostDesignSku(data);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  putDesignSku: async (data, DesignId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPutDesignSku(data, DesignId);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  deleteDesignSku: async (DesignId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      console.log(DesignId)
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestDeleteDesignSku(DesignId);
      onSuccess(response);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  searchDesignSku: async (body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestSearchDesignSky(body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  getDesignSkuById: async (skuId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestGetDesignSkuById(skuId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  packageCreateFlashShip: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPackageCreateFlashShip(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  packageCreatePrintCare: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPackageCreatePrintCare(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  packageFulfillmentCompleted: async (shopId, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPackageFulfillmentCompleted(shopId);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  packageFulfillmentCompletedInActive: async (packageId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loading: true });
      const response = await RepositoryRemote.orders.requestPackageFulfillmentCompletedInActive(packageId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loading: false });
  },

  cancelOrder: async (shopId, body, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingRejectOrder: true });
      const response = await RepositoryRemote.orders.requestCancelOder(shopId, body);
      onSuccess(response.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || 'Có lỗi xảy ra!');
    }
    set({ loadingRejectOrder: false });
  },
}));
