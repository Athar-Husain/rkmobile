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
    categoriesMap: {},
    product: null,
    similarProducts: [],
    applicableCoupons: [],
    availability: null,
    comparison: null,
    filters: {},
    pagination: {},

    // UI States
    isLoading: false, // Global loader for basic products
    isFetchingFeatured: false,
    isFetchingCategories: false,
    isProductSuccess: false,
    isProductError: false,
    message: '',
}

// ================================
// Helper: Error Handler
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
    async (_, { rejectWithValue }) => {
        try {
            return await ProductService.getCategoriesList()
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const fetchProducts = createAsyncThunk(
    'product/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await ProductService.getProducts(params)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const fetchFeaturedProducts = createAsyncThunk(
    'product/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            return await ProductService.getFeaturedProducts()
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const fetchProductsByCategory = createAsyncThunk(
    'product/fetchByCategory',
    async ({ category, params }, { rejectWithValue }) => {
        try {
            return await ProductService.getProductsByCategory(category, params)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const addProduct = createAsyncThunk(
    'product/add',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const response = await ProductService.addProduct(data)
            dispatch(fetchCategoriesList())
            return response
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const response = await ProductService.updateProduct(id, data)
            dispatch(fetchCategoriesList())
            return response
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const searchProducts = createAsyncThunk(
    'product/search',
    async ({ query, params }, { rejectWithValue }) => {
        try {
            return await ProductService.searchProducts(query, params)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
        }
    }
)

export const fetchProductById = createAsyncThunk(
    'product/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await ProductService.getProductById(id)
        } catch (e) {
            return rejectWithValue(getErrorMessage(e))
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
            // ---------------- Specific Success Cases ----------------
            .addCase(fetchCategoriesList.fulfilled, (state, action) => {
                state.isFetchingCategories = false
                state.categoriesList = action.payload.data
                state.categoriesMap = action.payload.data.reduce((acc, cat) => {
                    acc[cat.category] = cat
                    return acc
                }, {})
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload.products
                state.filters = action.payload.filters
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.isFetchingFeatured = false
                state.featuredProducts = action.payload.products
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.products.unshift(action.payload.product)
                state.isProductSuccess = true
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false
                const idx = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                )
                if (idx !== -1) state.products[idx] = action.payload.product
                state.isProductSuccess = true
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false
                state.product = action.payload.product
                state.similarProducts = action.payload.similarProducts
                state.applicableCoupons = action.payload.applicableCoupons
            })

            // ---------------- Matchers (Global Handlers) ----------------
            // Matches any pending product action
            .addMatcher(
                (action) =>
                    action.type.startsWith('product/') &&
                    action.type.endsWith('/pending'),
                (state, action) => {
                    state.isProductError = false
                    state.message = ''

                    // Set specific flags based on thunk type
                    if (action.type.includes('fetchFeatured'))
                        state.isFetchingFeatured = true
                    else if (action.type.includes('fetchCategories'))
                        state.isFetchingCategories = true
                    else state.isLoading = true
                }
            )
            // Matches any rejected product action
            .addMatcher(
                (action) =>
                    action.type.startsWith('product/') &&
                    action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false
                    state.isFetchingFeatured = false
                    state.isFetchingCategories = false
                    state.isProductError = true
                    state.message = action.payload
                    safeShowMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { RESET_PRODUCT_STATE, CLEAR_PRODUCT_DETAILS } =
    productSlice.actions
export default productSlice.reducer
