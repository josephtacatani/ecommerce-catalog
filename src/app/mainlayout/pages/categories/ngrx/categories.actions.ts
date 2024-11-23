import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Categories,
  CategoryErrorInterface,
  CategoryRequestInterface,
  CategoryResponseInterface,
} from './categories.model';

export const CategoryActions = createActionGroup({
  source: 'Category',
  events: {
    // Load Categories
    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ response: CategoryResponseInterface }>(),
    'Load Categories Failure': props<{ error: string }>(),

    // Create Category
    'Create Category': props<{ categoryData: CategoryRequestInterface }>(),
    'Create Category Success': props<{ category: Categories }>(), // Single category
    'Create Category Failure': props<{ error: CategoryErrorInterface }>(),

    // Update Category
    'Update Category': props<{ categoryId: string; categoryData: CategoryRequestInterface }>(),
    'Update Category Success': props<{ category: Categories }>(), // Single category
    'Update Category Failure': props<{ error: string }>(),

    // Delete Category
    'Delete Category': props<{ categoryId: string }>(),
    'Delete Category Success': props<{ categoryId: string; response: { message: string } }>(),
    'Delete Category Failure': props<{ error: string }>(),
  },
});
