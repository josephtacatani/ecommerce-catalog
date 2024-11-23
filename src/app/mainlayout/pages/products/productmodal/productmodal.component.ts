import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product } from '../ngrx/products.models';
import { Observable } from 'rxjs';
import { Categories } from '../../categories/ngrx/categories.model';
import { Store } from '@ngrx/store';
import { selectCategories } from '../../categories/ngrx/categories.reducers';
import { CategoryActions } from '../../categories/ngrx/categories.actions';
import { selectLoggedusers } from 'src/app/state/users/users.reducer';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-form',
  templateUrl: './productmodal.component.html',
  styleUrls: ['./productmodal.component.scss'],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
})
export class ProductsModalComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  imagePreview: string | null = null;
  categories$: Observable<Categories[]>;
  user: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<ProductsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.isEditMode = !!data;

    // Initialize the reactive form
    this.productForm = this.fb.group({
      product_name: [data?.product_name || '', Validators.required],
      product_img: [data?.product_img || '', Validators.required],
      product_description: [data?.product_description || ''],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      currency: [data?.currency || 'php', Validators.required],
      category: [data?.category?.[0]?.category_id || null, Validators.required],
      created_by: [{ value: data?.created_by || '', disabled: true }], // Auto-populated
      other_details: this.fb.array([]), // Dynamic sections
    });
    
    this.categories$ = this.store.select(selectCategories);
    if (this.isEditMode && data?.product_img) {
      this.imagePreview = data.product_img; // Set the image preview
    }
  }

  ngOnInit(): void {
    // Dispatch actions to load categories
    this.store.dispatch(CategoryActions.loadCategories());
  
    // If edit mode, ensure `created_by` is set from data
    if (this.isEditMode) {
      console.log('Edit Mode:', this.isEditMode);
      console.log('Created By (From Data):', this.data?.created_by);
  
      if (this.data?.created_by) {
        this.productForm.patchValue({ created_by: this.data.created_by });
      }
    } else {
      // If not in edit mode (add mode), populate `created_by` with the logged user
      this.store.select(selectLoggedusers).subscribe((user) => {
        if (user) {
          console.log('Logged User:', user.username);
          this.productForm.patchValue({ created_by: user.username });
        }
      });
    }
  
    // Populate "other_details" if in edit mode
    if (this.isEditMode && this.data?.other_details) {
      this.populateOtherDetails(this.data.other_details);
    }
  
    // Log final created_by value for debugging
    console.log('Final Created By (Form Value):', this.productForm.get('created_by')?.value);
  }
  
  
  // Helper method to populate other_details
  private populateOtherDetails(otherDetails: { [sectionName: string]: { [key: string]: string } }): void {
    Object.entries(otherDetails).forEach(([sectionName, fields]) => {
      // Create a section for each key in other_details
      const sectionGroup = this.fb.group({
        sectionName: [sectionName, Validators.required],
        fields: this.fb.array([]), // Array for key-value pairs
      });
  
      // Add key-value pairs to the fields array
      Object.entries(fields).forEach(([key, value]) => {
        const keyValuePair = this.fb.group({
          key: [key, Validators.required],
          value: [value, Validators.required],
        });
  
        (sectionGroup.get('fields') as FormArray).push(keyValuePair);
      });
  
      // Push the section group into the other_details form array
      this.otherDetails.push(sectionGroup);
    });
  }
  
  

  // Getter for dynamic other_details array
  get otherDetails(): FormArray {
    return this.productForm.get('other_details') as FormArray;
  }

  // Add a new section to other_details
  addOtherDetailsSection(): void {
    const sectionGroup = this.fb.group({
      sectionName: ['', Validators.required], // Section name (e.g., "specifications")
      fields: this.fb.array([]), // Array of key-value pairs
    });
    this.otherDetails.push(sectionGroup);
  }

  // Add a key-value pair to a specific section
  addKeyValuePair(sectionIndex: number): void {
    const fields = this.otherDetails.at(sectionIndex).get('fields') as FormArray;
    const keyValuePair = this.fb.group({
      key: ['', Validators.required], // Key (e.g., "battery_life")
      value: ['', Validators.required], // Value (e.g., "15 hours")
    });
    fields.push(keyValuePair);
  }

  // Remove a section
  removeOtherDetailsSection(index: number): void {
    this.otherDetails.removeAt(index);
  }

  // Remove a key-value pair from a section
  removeKeyValuePair(sectionIndex: number, fieldIndex: number): void {
    const fields = this.otherDetails.at(sectionIndex).get('fields') as FormArray;
    fields.removeAt(fieldIndex);
  }

  // Handle image file change
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Base64 string for preview
        this.productForm.patchValue({ product_img: this.imagePreview }); // Update form control
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  getFields(sectionIndex: number): FormArray {
    return this.otherDetails.at(sectionIndex).get('fields') as FormArray;
  }
  

  // Submit handler
  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = { ...this.productForm.value };

      // Transform category into an array
      formData.category = [formData.category];

          // Explicitly add `created_by`, even if the field is disabled
      formData.created_by = this.productForm.get('created_by')?.value;

      // Transform other_details into the desired key-value structure
      formData.other_details = this.otherDetails.controls.reduce((details: Record<string, any>, group) => {
        const sectionName = group.get('sectionName')?.value?.trim();
        const fields = (group.get('fields') as FormArray).controls.reduce((fieldDetails: Record<string, string>, fieldGroup) => {
          const key = fieldGroup.get('key')?.value?.trim();
          const value = fieldGroup.get('value')?.value?.trim();
          if (key && value) {
            fieldDetails[key] = value;
          }
          return fieldDetails;
        }, {});

        if (sectionName && Object.keys(fields).length > 0) {
          details[sectionName] = fields;
        }
        return details;
      }, {});

      console.log('Transformed Payload:', formData);
      this.dialogRef.close(formData); // Close modal with the payload
    } else {
      console.log('Form is invalid:', this.productForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  
}
