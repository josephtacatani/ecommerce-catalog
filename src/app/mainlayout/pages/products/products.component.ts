import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ProductActions} from '../products/ngrx/products.actions'

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { selectError, selectLoading, selectProducts, selectSuccessMessage } from './ngrx/products.reducers';
import { OtherDetails, Product } from './ngrx/products.models';
import { ProductsModalComponent } from './productmodal/productmodal.component';
import { Categories } from '../categories/ngrx/categories.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
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
export class ProductsComponent implements OnInit  {
  products$: Observable<Product[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  message$: Observable<string | null>;

  searchControl = new FormControl('');
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  displayedColumns = ['product_id', 'product_name', 'product_img', 'product_description', 'category', 'price', 'other_details', 'date_created', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.products$ = this.store.select(selectProducts);
    this.isLoading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.message$ = this.store.select(selectSuccessMessage);
  }

  ngOnInit(): void {
    this.setupSubscriptions()
    this.store.dispatch(ProductActions.loadProducts());
  
    this.products$.subscribe((response) => {
      if (response) {
        console.log(response);
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
  
        // Set a custom filter predicate
        this.dataSource.filterPredicate = (data: Product, filter: string) => {
          const transformedFilter = filter.trim().toLowerCase();
          const otherDetailsString = this.flattenOtherDetails(data.other_details).toLowerCase();
  
          // Check if any field matches the filter string
          return (
            data.product_name.toLowerCase().includes(transformedFilter) ||
            data.product_description.toLowerCase().includes(transformedFilter) ||
            data.category.some(cat => cat.category_name.toLowerCase().includes(transformedFilter)) || 
            data.currency.toLowerCase().includes(transformedFilter) ||
            otherDetailsString.includes(transformedFilter)
          );
        };
      }
    });

    
  
    // Subscribe to the search control value changes
    this.searchControl.valueChanges.subscribe((value) => {
      const filterValue = value ? value.trim().toLowerCase() : '';
      this.dataSource.filter = filterValue;
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });

    
  }

  private flattenOtherDetails(otherDetails: OtherDetails): string {
    if (!otherDetails) {
      return ''; // Return an empty string if other_details is null or undefined
    }
  
    return Object.entries(otherDetails)
      .map(([section, details]) =>
        `${section}: ${Object.entries(details)
          .map(([key, value]) => `${key} ${value}`)
          .join(' ')}`
      )
      .join(' ');
  }
  
  


  getCategoryNames(categories: Categories[]): string {
    if (!categories || categories.length === 0) {
      return 'No Category';
    }
    return categories.map((cat) => cat.category_name).join(', ');
  }

  getOtherDetailsSections(otherDetails: OtherDetails): { sectionName: string; details: { key: string; value: string }[] }[] {
    if (!otherDetails) {
      return [];
    }
  
    return Object.entries(otherDetails).map(([sectionName, sectionData]) => ({
      sectionName,
      details: Object.entries(sectionData).map(([key, value]) => ({ key, value })),
    }));
  }
  


  private setupSubscriptions(): void {
    


    this.error$.subscribe((error) => {
      if (error) {
        console.error('Error received in component:', error); // Log the error
        this.showSnackbar(error); // Optionally show the error in the UI
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
    this.message$.subscribe((message) => {
      if (message) {
        this.showSnackbar(message);
      }
    });
  }

  openAddCategoryModal(): void {
    const dialogRef = this.dialog.open(ProductsModalComponent, {
      width: '800px',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(ProductActions.createProduct({ product: result }));
        console.log('result', result);
      }
    });
  }

  openEditCategoryModal(product: Product): void {
    const dialogRef = this.dialog.open(ProductsModalComponent, {
      width: '600px',
      data: product, // Pre-fill the modal with existing category data
    
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ProductActions.updateProduct({
            productId: product.product_id,
            product: result,
          })
        );
      }
    });
  }

  onDeleteCategory(productId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.store.dispatch(ProductActions.deleteProduct({ productId }));
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


