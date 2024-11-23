import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product, ProductRequest, ProductResponse } from './products.models';

export const ProductActions = createActionGroup({
  source: 'Product',
  events: {
    // Load Products
    'Load Products': emptyProps(), // No additional payload required
    'Load Products Success': props<{ response: ProductResponse }>(),
    'Load Products Failure': props<{ error: string }>(),

    // Create Product
    'Create Product': props<{ product: ProductRequest }>(),
    'Create Product Success': props<{ product: Product }>(),
    'Create Product Failure': props<{ error: string }>(),

    // Update Product
    'Update Product': props<{ productId: string; product: ProductRequest }>(),
    'Update Product Success': props<{ product: Product }>(),
    'Update Product Failure': props<{ error: string }>(),

    // Delete Product
    'Delete Product': props<{ productId: string }>(),
    'Delete Product Success': props<{ productId: string }>(),
    'Delete Product Failure': props<{ error: string }>(),
  },
});
