import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CategoryService } from './categories.service';
import { CategoryActions } from './categories.actions';
import { CategoryResponseInterface } from './categories.model';

@Injectable()
export class CategoryEffects {
  constructor(private actions$: Actions, private categoryService: CategoryService) {}

  // Load Categories
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories), // Triggered by loadCategories action
      mergeMap(() =>
        this.categoryService.getCategories().pipe(
          map((response: CategoryResponseInterface) => {
            return CategoryActions.loadCategoriesSuccess({ response }); // Dispatch success action
          }),
          catchError((error) => {
         
            return of(CategoryActions.loadCategoriesFailure({ error: error.message || 'Unknown error' })); // Dispatch failure action
          })
        )
      )
    )
  );
  
  

  // Create Category
  createCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.createCategory),
      mergeMap((action) =>
        this.categoryService.createCategory(action.categoryData).pipe(
          map((category) => CategoryActions.createCategorySuccess({ category })), // Pass single category
          catchError((error) =>
            of(CategoryActions.createCategoryFailure({ error }))
          )
        )
      )
    )
  );

  refreshCategoriesAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.createCategorySuccess),
      map(() => CategoryActions.loadCategories())
    )
  );

  // Update Category
  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      mergeMap((action) =>
        this.categoryService.updateCategory(action.categoryId, action.categoryData).pipe(
          map((category) => CategoryActions.updateCategorySuccess({ category })), // Pass single category
          catchError((error) =>
            of(CategoryActions.updateCategoryFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshCategoriesAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategorySuccess),
      map(() => CategoryActions.loadCategories())
    )
  );

  // Delete Category
  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      mergeMap((action) =>
        this.categoryService.deleteCategory(action.categoryId).pipe(
          map((response) =>
            CategoryActions.deleteCategorySuccess({
              categoryId: action.categoryId,
              response,
            })
          ),
          catchError((error) =>
            of(CategoryActions.deleteCategoryFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshCategoriesAfterDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategorySuccess),
      map(() => CategoryActions.loadCategories())
    )
  );
}
