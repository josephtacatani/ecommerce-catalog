import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Categories } from '../ngrx/categories.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/user.model';
import { selectLoggedusers } from 'src/app/state/users/users.reducer';

@Component({
  selector: 'app-category-modal',
  templateUrl: './categoryModal.component.html',
  styleUrls: ['./categoryModal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatTableModule
  ],
  standalone: true
})
export class CategoryModalComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode: boolean;
  userLogged$: Observable<User | null>;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryModalComponent>,
    private store: Store,

    @Inject(MAT_DIALOG_DATA) public data: Categories | null
  ) {
    this.isEditMode = !!data; // Determine if it's edit mode based on the presence of data
    this.categoryForm = this.fb.group({
      category_name: [data?.category_name || '', [Validators.required, Validators.maxLength(50)]],
      created_by: [data?.created_by]
    });

    this.userLogged$ = this.store.select(selectLoggedusers);
  }

  ngOnInit(): void {

    this.userLogged$.subscribe((data)=>{
      if(data && !this.isEditMode){
        this.categoryForm.patchValue({created_by: data.username});
      }
    })
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value); // Pass the form data back to the parent
    }
  }

  onCancel(): void {
    this.dialogRef.close(null); // Close the dialog without passing any data
  }
}
