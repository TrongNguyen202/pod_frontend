import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RepositoryRemote } from "src/services";

const initialState = {
  loading: false,
  error: "",
  categoriesIsLeaf: [],
  categoriesIsLeafType2: [],
  categoriesById: {},
  attributes: {},
  infoTable: {},
  categories: {},
  loadingById: false,
  attributeLoading: false,
  recommend: [],
};

export const fetchGetAllCategories = createAsyncThunk(
  "/categories/all",
  async () => {
    const response =
      await RepositoryRemote.categories.requestGetAllCategories();
    return response?.data?.data;
  }
);

export const fetchGetAllCategoriesIsLeaf = createAsyncThunk(
  "/categories/all-leaf",
  async () => {
    const response =
      await RepositoryRemote.categories.requestGetAllCategoriesIsLeaf();
    return response?.data?.data;
  }
);

export const fetchGetAllCategoriesIsLeafType2 = createAsyncThunk(
  "/categories/all-leaf-type-2",
  async (shopId) => {
    const response =
      await RepositoryRemote.categories.requestAllCategoriesIsLeafType2(shopId);
    return response.data.data;
  }
);

export const fetchGetCategoriesById = createAsyncThunk(
  "/categories/by-id",
  async (shopId) => {
    const response =
      await RepositoryRemote.categories.requestGetAllCategoriesIsLeaf(shopId);
    return response.data.data;
  }
);

export const fetchGetAttributeByCategory = createAsyncThunk(
  "/categories/attributes",
  async ({ shopId, categoryId }) => {
    const response =
      await RepositoryRemote.categories.requestGetAttributeByCategory(
        shopId,
        categoryId
      );
    return response.data.data;
  }
);

export const fetchGetRecommendCategory = createAsyncThunk(
  "/categories/recommend",
  async ({ shopId, data }) => {
    const response = await RepositoryRemote.categories.requestRecommendCategory(
      shopId,
      data
    );
    return response.data;
  }
);

const slicer = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoryData: (state) => {
      state.categoriesIsLeaf = [];
      state.categoriesIsLeafType2 = [];
      state.categoriesById = {};
      state.infoTable = {};
      state.attributes = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetAllCategories.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetAllCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload?.data;
      state.infoTable = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetAllCategories.rejected, (state, action) => {
      state.loading = false;
      state.categories = {};
      state.error = action?.error?.message || "Error while processing.";
    });

    builder.addCase(fetchGetAllCategoriesIsLeaf.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetAllCategoriesIsLeaf.fulfilled, (state, action) => {
      state.loading = false;
      state.categoriesIsLeaf = action.payload?.category_list;
      state.error = "";
    });
    builder.addCase(fetchGetAllCategoriesIsLeaf.rejected, (state, action) => {
      state.loading = false;
      state.categoriesIsLeaf = [];
      state.error = action?.error?.message || "Error while processing.";
    });

    builder.addCase(fetchGetAllCategoriesIsLeafType2.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchGetAllCategoriesIsLeafType2.fulfilled,
      (state, action) => {
        state.loading = false;
        state.categoriesIsLeafType2 = action.payload?.category_list;
        state.error = "";
      }
    );
    builder.addCase(
      fetchGetAllCategoriesIsLeafType2.rejected,
      (state, action) => {
        state.loading = false;
        state.categoriesIsLeafType2 = [];
        state.error = action?.error?.message || "Error while processing.";
      }
    );

    builder.addCase(fetchGetCategoriesById.pending, (state) => {
      state.loadingById = true;
    });
    builder.addCase(fetchGetCategoriesById.fulfilled, (state, action) => {
      state.loadingById = false;
      state.categoriesById = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetCategoriesById.rejected, (state, action) => {
      state.loadingById = false;
      state.categoriesById = {};
      state.error = action?.error?.message || "Error while processing.";
    });

    builder.addCase(fetchGetAttributeByCategory.pending, (state) => {
      state.attributeLoading = true;
    });
    builder.addCase(fetchGetAttributeByCategory.fulfilled, (state, action) => {
      state.attributeLoading = false;
      state.attributes = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetAttributeByCategory.rejected, (state, action) => {
      state.attributeLoading = false;
      state.attributes = {};
      state.error = action?.error?.message || "Error while processing.";
    });

    builder.addCase(fetchGetRecommendCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGetRecommendCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.recommend = action.payload;
      state.error = "";
    });
    builder.addCase(fetchGetRecommendCategory.rejected, (state, action) => {
      state.loading = false;
      state.recommend = [];
      state.error = action?.error?.message || "Error while processing.";
    });
  },
});

export const { resetCategoryData } = slicer.actions;
export default slicer.reducer;
