import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Categories } from './ngrx/categories.model';
import { CategoryActions } from '../../../mainlayout/pages/categories/ngrx/categories.actions';

import { selectCategories, selectError, selectLoading, selectSuccessMessage } from './ngrx/categories.reducers';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryModalComponent } from './categorymodal/categoryModal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,// Import MatTableModule for displaying tables
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTableModule
  ],
  standalone: true
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Categories[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  message$: Observable<string | null>;

  searchControl = new FormControl('');
  dataSource = new MatTableDataSource<Categories>();
  displayedColumns = ['category_id', 'category_name', 'date_created', 'created_by', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.categories$ = this.store.select(selectCategories);
    this.isLoading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.message$ = this.store.select(selectSuccessMessage);
  }

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadCategories());
    this.setupSubscriptions();
  }


  private setupSubscriptions(): void {
    // Update table data when categories change
    this.categories$.subscribe((response) => {
      if (response) {
        this.dataSource.data = response; // Ensure the dataSource gets the array of categories
        this.dataSource.paginator = this.paginator;
      }
    });

    this.error$.subscribe((error) => {
      if (error) {
        console.error('Error received in component:', error); // Log the error
        this.showSnackbar(error); // Optionally show the error in the UI
      }
    });

    this.message$.subscribe((message) => {
      if (message) {
        this.showSnackbar(message);
      }
    });
    
    

    this.searchControl.valueChanges.subscribe((value) => {
      const filterValue = value ? value.trim().toLowerCase() : ''; // Default to an empty string if value is null
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
    

    // Show success or error messages

  }

  openAddCategoryModal(): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '600px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(CategoryActions.createCategory({ categoryData: result }));
      }
    });
  }

  openEditCategoryModal(category: Categories): void {
    const dialogRef = this.dialog.open(CategoryModalComponent, {
      width: '600px',
      data: category, // Pre-fill the modal with existing category data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          CategoryActions.updateCategory({
            categoryId: category.category_id,
            categoryData: result,
          })
        );
      }
    });
  }

  onDeleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.store.dispatch(CategoryActions.deleteCategory({ categoryId }));
    }
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
