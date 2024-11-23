import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from 'src/app/core/user.model';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    ReactiveFormsModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatFormFieldModule,
    CommonModule,
    MatRadioModule],
  standalone: true
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  imagePreview: string | null = null; // Base64 preview string

  accessLevels = [
    { value: 'admin', viewValue: 'admin' },
    { value: 'user', viewValue: 'user' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null  // Inject data passed to dialog
  ) {
    this.isEditMode = !!data;  // If data is provided, it’s edit mode
    this.userForm = this.fb.group({
      first_name: [data?.first_name || '', Validators.required],
      last_name: [data?.last_name || '', Validators.required],
      contact_number: [
        data?.contact_number || '',
        [Validators.required], // Validate for a 10-digit number
      ],
      address: [data?.address || '', Validators.required],
      username: [data?.username || '', Validators.required],
      password: ['', this.isEditMode ? [] : Validators.required], // Require password only on Add
      access_level: [data?.access_level || '', Validators.required],
      user_img: [data?.user_img || '', Validators.required],
      position: [data?.position || '', Validators.required],
      department: [data?.department || '', Validators.required],
      branch: [data?.branch || '', Validators.required],
      status: [data?.status || '', Validators.required], // Ensure status is a required field
    });
    
  }

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Base64 string for preview
        this.userForm.patchValue({ user_img: this.imagePreview }); // Update form control
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('Submitting form data:', this.userForm.value);
      this.dialogRef.close(this.userForm.value); // Close with valid data
    } else {
      console.log('Form is invalid:', this.userForm.status); // Log form status
      console.log('Form errors:', this.getFormValidationErrors()); // Log detailed errors
      this.userForm.markAllAsTouched(); // Mark all controls as touched to display validation errors
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();  // Close modal without any data
  }

  getFormValidationErrors(): string[] {
    const errors: string[] = [];
    Object.keys(this.userForm.controls).forEach((key) => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach((keyError) => {
          errors.push(`Control: ${key}, Error: ${keyError}`);
        });
      }
    });
    return errors;
  }
}
