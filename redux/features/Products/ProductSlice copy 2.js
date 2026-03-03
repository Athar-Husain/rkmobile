import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ProductService from './ProductService'
import { safeShowMessage } from '../Auth/AuthSlice'

// ================================
// Initial State
// ================================
const initialState = {
    products: [],
    featuredProducts: [],
    categoriesList: [],
    categoriesMap: {}, // Normalized category -> subcategories
    product: null,
    similarProducts: [],
    applicableCoupons: [],
    availability: null,
    comparison: null,
    filters: {},
    pagination: {},
    // Per-thunk loading flags
    isFetchingProducts: false,
    isFetchingFeatured: false,
    isFetchingCategories: false,
    isAddingProduct: false,
    isUpdatingProduct: false,
    isSearchingProducts: false,
    isCheckingAvailability: false,
    isComparingProducts: false,
    isProductSuccess: false,
    isProductError: false,
    message: '',
}

// ================================
// Helper
// ================================
const getErrorMessage = (error) =>
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'

// ================================
// Async Thunks
// ================================
export const fetchCategoriesList = createAsyncThunk(
    'product/fetchCategories',
    async (_, thunkAPI) => {
        try {
            return await ProductService.getCategoriesList()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchProducts = createAsyncThunk(
    'product/fetchAll',
    async (params, thunkAPI) => {
        try {
            return await ProductService.getProducts(params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchFeaturedProducts = createAsyncThunk(
    'product/fetchFeatured',
    async (_, thunkAPI) => {
        try {
            return await ProductService.getFeaturedProducts()
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchByCategory',
    async ({ category, params }, thunkAPI) => {
        try {
            return await ProductService.getProductsByCategory(category, params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const addProduct = createAsyncThunk(
    'product/add',
    async (data, thunkAPI) => {
        try {
            const response = await ProductService.addProduct(data)
            // Refresh categories after adding
            thunkAPI.dispatch(fetchCategoriesList())
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await ProductService.updateProduct(id, data)
            thunkAPI.dispatch(fetchCategoriesList())
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const searchProducts = createAsyncThunk(
    'product/search',
    async ({ query, params }, thunkAPI) => {
        try {
            return await ProductService.searchProducts(query, params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const compareProducts = createAsyncThunk(
    'product/compare',
    async (data, thunkAPI) => {
        try {
            return await ProductService.compareProducts(data)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const checkProductAvailability = createAsyncThunk(
    'product/checkAvailability',
    async ({ id, params }, thunkAPI) => {
        try {
            return await ProductService.checkAvailability(id, params)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'product/fetchById',
    async (id, thunkAPI) => {
        try {
            return await ProductService.getProductById(id)
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ================================
// Slice
// ================================
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        RESET_PRODUCT_STATE: (state) => {
            state.isProductSuccess = false
            state.isProductError = false
            state.message = ''
        },
        CLEAR_PRODUCT_DETAILS: (state) => {
            state.product = null
            state.similarProducts = []
            state.applicableCoupons = []
            state.availability = null
        },
    },
    extraReducers: (builder) => {
        builder
            // ---------------- Categories ----------------
            .addCase(fetchCategoriesList.pending, (state) => {
                state.isFetchingCategories = true
            })
            .addCase(fetchCategoriesList.fulfilled, (state, action) => {
                state.isFetchingCategories = false
                state.categoriesList = action.payload.data
                const map = {}
                action.payload.data.forEach((cat) => {
                    map[cat.category] = cat
                })
                state.categoriesMap = map
            })
            .addCase(fetchCategoriesList.rejected, (state, action) => {
                state.isFetchingCategories = false
                state.isProductError = true
                state.message = action.payload
                safeShowMessage({ message: action.payload, type: 'danger' })
            })

            // ---------------- Products ----------------
            .addCase(fetchProducts.pending, (state) => {
                state.isFetchingProducts = true
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isFetchingProducts = false
                state.products = action.payload.products
                state.filters = action.payload.filters
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isFetchingProducts = false
                state.isProductError = true
                state.message = action.payload
            })

            // ---------------- Featured Products ----------------
            .addCase(fetchFeaturedProducts.pending, (state) => {
                state.isFetchingFeatured = true
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.isFetchingFeatured = false
                state.featuredProducts = action.payload.products
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.isFetchingFeatured = false
                state.isProductError = true
                state.message = action.payload
            })

            // ---------------- Add Product ----------------
            .addCase(addProduct.pending, (state) => {
                state.isAddingProduct = true
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isAddingProduct = false
                state.products.unshift(action.payload.product)
                state.isProductSuccess = true
                state.message = action.payload.message
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isAddingProduct = false
                state.isProductError = true
                state.message = action.payload
                safeShowMessage({ message: action.payload, type: 'danger' })
            })

            // ---------------- Update Product ----------------
            .addCase(updateProduct.pending, (state) => {
                state.isUpdatingProduct = true
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isUpdatingProduct = false
                const index = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                )
                if (index !== -1) state.products[index] = action.payload.product
                state.isProductSuccess = true
                state.message = action.payload.message
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isUpdatingProduct = false
                state.isProductError = true
                state.message = action.payload
                safeShowMessage({ message: action.payload, type: 'danger' })
            })

            // ---------------- Search ----------------
            .addCase(searchProducts.pending, (state) => {
                state.isSearchingProducts = true
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.isSearchingProducts = false
                state.products = action.payload.products
                state.filters = action.payload.filters || state.filters
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.isSearchingProducts = false
                state.isProductError = true
                state.message = action.payload
            })

            // ---------------- Compare ----------------
            .addCase(compareProducts.pending, (state) => {
                state.isComparingProducts = true
            })
            .addCase(compareProducts.fulfilled, (state, action) => {
                state.isComparingProducts = false
                state.comparison = action.payload
            })
            .addCase(compareProducts.rejected, (state, action) => {
                state.isComparingProducts = false
                state.isProductError = true
                state.message = action.payload
            })

            // ---------------- Availability ----------------
            .addCase(checkProductAvailability.pending, (state) => {
                state.isCheckingAvailability = true
            })
            .addCase(checkProductAvailability.fulfilled, (state, action) => {
                state.isCheckingAvailability = false
                state.availability = action.payload
            })
            .addCase(checkProductAvailability.rejected, (state, action) => {
                state.isCheckingAvailability = false
                state.isProductError = true
                state.message = action.payload
            })

            // ---------------- Product Details ----------------
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.product = action.payload.product
                state.similarProducts = action.payload.similarProducts
                state.applicableCoupons = action.payload.applicableCoupons
            })
    },
})

export const { RESET_PRODUCT_STATE, CLEAR_PRODUCT_DETAILS } =
    productSlice.actions
export default productSlice.reducer
