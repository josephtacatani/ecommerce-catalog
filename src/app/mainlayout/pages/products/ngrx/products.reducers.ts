import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductState } from './products.models';
import { ProductActions } from './products.actions';

const initialState: ProductState = {
  products: [],
  loading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
};

export const productFeature = createFeature({
  name: 'product',
  reducer: createReducer(
    initialState,

    // Load Products
    on(ProductActions.loadProducts, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(ProductActions.loadProductsSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      products: response.data.products,
      successMessage: 'Products loaded successfully',
    })),
    on(ProductActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create Product
    on(ProductActions.createProduct, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(ProductActions.createProductSuccess, (state, { product }) => ({
      ...state,
      isSubmitting: false,
      products: [...state.products, product], // Add single product
      successMessage: 'Product created successfully',
    })),
    on(ProductActions.createProductFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error,
    })),

    // Update Product
    on(ProductActions.updateProduct, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(ProductActions.updateProductSuccess, (state, { product }) => ({
      ...state,
      isSubmitting: false,
      products: state.products.map((p) =>
        p.product_name === product.product_name ? product : p
      ),
      successMessage: 'Product updated successfully',
    })),
    on(ProductActions.updateProductFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error,
    })),

    // Delete Product
    on(ProductActions.deleteProduct, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(ProductActions.deleteProductSuccess, (state, { productId }) => ({
      ...state,
      isSubmitting: false,
      products: state.products.filter((p) => p.product_name !== productId),
      successMessage: 'Product deleted successfully',
    })),
    on(ProductActions.deleteProductFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error,
    }))
  ),
});

export const {
  name: productFeatureKey,
  reducer: productReducer,
  selectProducts,
  selectLoading,
  selectIsSubmitting,
  selectError,
  selectSuccessMessage,
} = productFeature;
