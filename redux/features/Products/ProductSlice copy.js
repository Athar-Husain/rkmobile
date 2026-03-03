import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import ProductService from './ProductService'
import { safeShowMessage } from '../Auth/AuthSlice'

// ================================
// Initial State
// ================================
const initialState = {
    products: [],
    featuredProducts: [],
    // New state to hold dynamic category/subcategory mapping
    categoriesList: [],
    product: null,
    similarProducts: [],
    applicableCoupons: [],
    availability: null,
    comparison: null,
    filters: {},
    pagination: {},
    isProductLoading: false,
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

// NEW: Fetch Categories List (Dynamic Category/Subcategory Mapping)
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

// ... (Existing Thunks: fetchProducts, fetchFeaturedProducts, etc.)
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
            // After adding a product, refresh categories to include potential new ones
            thunkAPI.dispatch(fetchCategoriesList())
            return response
        } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error))
        }
    }
)

// ----------------
// Search
// ----------------
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

// ----------------
// Compare
// ----------------
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

// ----------------
// Availability
// ----------------
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

// ----------------
// Product Details
// ----------------
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

export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await ProductService.updateProduct(id, data)
            // After updating, refresh categories list in case category was changed
            thunkAPI.dispatch(fetchCategoriesList())
            return response
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
            state.isProductLoading = false
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
            // ----------------
            // Categories List
            // ----------------
            .addCase(fetchCategoriesList.fulfilled, (state, action) => {
                // action.payload.data is the array: [{ category: 'mob-dhi', subcategories: [...] }]
                state.categoriesList = action.payload.data
            })

            // ----------------
            // Listings
            // ----------------
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products = action.payload.products
                state.filters = action.payload.filters
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })

            // ----------------
            // Add Product
            // ----------------
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.unshift(action.payload.product) // Add to top of list
                state.isProductSuccess = true
                state.message = action.payload.message
                // toast.success(action.payload.message)
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })

            // ----------------
            // Update Product
            // ----------------
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (p) => p._id === action.payload.product._id
                )
                if (index !== -1) state.products[index] = action.payload.product
                state.isProductSuccess = true
                state.message = action.payload.message
                // toast.success(action.payload.message)
                safeShowMessage({
                    message: action.payload.message,
                    type: 'success',
                })
            })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.featuredProducts = action.payload.products
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
                state.products = action.payload.products
                state.filters = action.payload.filters
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })

            // ----------------
            // Product Detail
            // ----------------
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.product = action.payload.product
                state.similarProducts = action.payload.similarProducts
                state.applicableCoupons = action.payload.applicableCoupons
            })

            // ----------------
            // Search
            // ----------------
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.products = action.payload.products
                state.pagination = {
                    total: action.payload.total,
                    pages: action.payload.pages,
                    currentPage: action.payload.currentPage,
                }
            })

            // ----------------
            // Availability
            // ----------------
            .addCase(checkProductAvailability.fulfilled, (state, action) => {
                state.availability = action.payload
            })

            // ----------------
            // Compare
            // ----------------
            .addCase(compareProducts.fulfilled, (state, action) => {
                state.comparison = action.payload
            })

            // ... (Keep other existing cases)

            // ----------------
            // Global Matchers
            // ----------------
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isProductLoading = true
                    state.isProductError = false
                    state.message = ''
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.isProductLoading = false
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isProductLoading = false
                    state.isProductError = true
                    state.message = action.payload
                    // toast.error(action.payload)
                    safeShowMessage({ message: action.payload, type: 'danger' })
                }
            )
    },
})

export const { RESET_PRODUCT_STATE, CLEAR_PRODUCT_DETAILS } =
    productSlice.actions
export default productSlice.reducer
