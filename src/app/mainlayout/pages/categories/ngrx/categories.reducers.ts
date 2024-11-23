import { createFeature, createReducer, on } from '@ngrx/store';
import { CategoryState } from './categories.model';
import { CategoryActions } from './categories.actions';

const initialState: CategoryState = {
  categories: [],
  loading: false,
  isSubmitting: false,
  error: null,
  successMessage: null,
};

export const categoryFeature = createFeature({
  name: 'category',
  reducer: createReducer(
    initialState,

    // Load Categories
    on(CategoryActions.loadCategories, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CategoryActions.loadCategoriesSuccess, (state, { response }) => ({
      ...state,
      loading: false,
      categories: response.data,
      successMessage: 'Categories loaded successfully',
    })),
    on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    // Create Category
    on(CategoryActions.createCategory, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(CategoryActions.createCategorySuccess, (state, { category }) => ({
      ...state,
      isSubmitting: false,
      categories: [...state.categories, category], // Add single category
      successMessage: 'Category created successfully',
    })),
    on(CategoryActions.createCategoryFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error: error.data.error,
    })),

    // Update Category
    on(CategoryActions.updateCategory, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
      ...state,
      isSubmitting: false,
      categories: state.categories.map((c) =>
        c.category_id === category.category_id ? category : c
      ),
      successMessage: 'Category updated successfully',
    })),
    on(CategoryActions.updateCategoryFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error,
    })),

    // Delete Category
    on(CategoryActions.deleteCategory, (state) => ({
      ...state,
      isSubmitting: true,
      error: null,
    })),
    on(CategoryActions.deleteCategorySuccess, (state, { categoryId }) => ({
      ...state,
      isSubmitting: false,
      categories: state.categories.filter((c) => c.category_id !== categoryId),
      successMessage: 'Category deleted successfully',
    })),
    on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
      ...state,
      isSubmitting: false,
      error,
    }))
  ),
});

export const {
  name: categoryFeatureKey,
  reducer: categoryReducer,
  selectCategories,
  selectLoading,
  selectIsSubmitting,
  selectError,
  selectSuccessMessage,
} = categoryFeature;
